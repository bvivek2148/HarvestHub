import { redirect } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

const AUTH_PAGES = ['/sign-in', '/sign-up', '/forgot-password', '/sso-callback']

function getRoleDest(role: string): string {
  if (role === 'admin') return '/admin'
  if (role === 'farmer') return '/farmer'
  return '/buyer'
}

export const Route = createFileRoute('/_auth')({
  loader: async ({ context, location }) => {
    const isAuthPage = AUTH_PAGES.some((p) => location.pathname.startsWith(p))
    if (!isAuthPage) return { currentUser: null }

    const currentUser = context.currentUser ?? null

    if (currentUser && location.pathname !== '/sign-out') {
      const role = (currentUser.labels?.[0]) || 'buyer'
      const dest = getRoleDest(role)
      throw redirect({ to: dest })
    }

    return { currentUser }
  },
})
