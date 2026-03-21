import { redirect } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

// Reads currentUser from __root loader — no extra network call
export const Route = createFileRoute('/_protected')({
  loader: async ({ context, location }) => {
    const currentUser = context.currentUser ?? null

    if (!currentUser) {
      throw redirect({ to: '/sign-in/$', search: { redirect: location.href } })
    }

    return {
      currentUser,
    }
  },
})
