import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import appCss from '../styles.css?url'

import { ClerkProvider } from '@clerk/tanstack-react-start'
import { useFirebaseAuth } from '@/hooks/use-firebase-auth'
import { CartProvider } from '@/context/CartContext'

import { useEffect } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from 'next-themes'
import { authMiddleware } from '@/server/functions/auth'
import { getBaseUrl } from '@/server/functions/request'
import {
  createOGMetaTags,
  generateOGImageUrl,
  OGImageConfig,
  OGMetaTags,
} from '@/lib/og-config'
interface MyRouterContext {
  queryClient: QueryClient
  currentUser?: any | null
}

const scripts: React.DetailedHTMLProps<
  React.ScriptHTMLAttributes<HTMLScriptElement>,
  HTMLScriptElement
>[] = []

if (import.meta.env.VITE_INSTRUMENTATION_SCRIPT_SRC) {
  scripts.push({
    src: import.meta.env.VITE_INSTRUMENTATION_SCRIPT_SRC,
    type: 'module',
  })
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    const { currentUser } = await authMiddleware()
    return { currentUser }
  },
  loader: async ({ context }) => {
    const baseUrl = await getBaseUrl()
    return { 
      baseUrl,
      currentUser: context.currentUser 
    }
  },
  head: ({ loaderData }) => {
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : (loaderData?.baseUrl ?? 'https://harvesthub.app')

    const config: OGImageConfig = { isCustom: false }
    const ogImageUrl = generateOGImageUrl(config, baseUrl)

    const metadata: OGMetaTags = {
      title: 'HarvestHub Marketplace',
      description:
        'A Progressive Web App connecting farmers directly with consumers and retailers, featuring real-time chat, escrow payments, AI assistance, and offline-capable browsing optimized for low-bandwidth mobile devices.',
      image: ogImageUrl,
      url: typeof window !== 'undefined' ? window.location.href : baseUrl,
    }

    const ogTags = createOGMetaTags(metadata)

    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { title: 'HarvestHub Marketplace' },
        {
          name: 'description',
          content:
            'A Progressive Web App connecting farmers directly with consumers and retailers, featuring real-time chat, escrow payments, AI assistance, and offline-capable browsing optimized for low-bandwidth mobile devices.',
        },
        { name: 'theme-color', content: '#f7f5f0' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'HarvestHub' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        ...ogTags.meta,
      ],
      links: [
        { rel: 'stylesheet', href: appCss },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossOrigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap',
        },
      ],
      scripts: [...scripts],
    }
  },

  shellComponent: RootDocument,
})

function FirebaseSync() {
  useFirebaseAuth()
  return null
}

function RootDocument({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ClerkProvider>
            <CartProvider>
              <FirebaseSync />
              {children}
              <Toaster />
            </CartProvider>
          </ClerkProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
