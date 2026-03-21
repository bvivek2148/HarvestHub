import { useClerk } from '@clerk/tanstack-react-start'
import { useLoaderData, useRouter } from '@tanstack/react-router'

export function useAuth() {
  const { currentUser } = useLoaderData({ from: '__root__' }) as {
    currentUser: any
  }
  const { signOut: clerkSignOut } = useClerk()
  const router = useRouter()

  const signOut = async () => {
    await clerkSignOut()
    await router.invalidate()
  }

  return {
    currentUser,
    signOut,
  }
}
