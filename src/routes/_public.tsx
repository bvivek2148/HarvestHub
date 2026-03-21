import { createFileRoute } from '@tanstack/react-router'

// Reads currentUser from __root loader — no extra network call
export const Route = createFileRoute('/_public')({
  loader: async ({ context }) => {
    return {
      currentUser: context.currentUser ?? null,
    }
  },
})
