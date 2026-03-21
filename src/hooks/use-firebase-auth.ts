import { useEffect } from 'react'
import { useAuth } from '@clerk/tanstack-react-start'
import { getAuth, signInWithCustomToken, signOut } from 'firebase/auth'
import { app } from '@/lib/firebase'
import { useServerFn } from '@tanstack/react-start'
import { getFirebaseTokenFn } from '@/server/functions/firebase'

export function useFirebaseAuth() {
  const { isLoaded, isSignedIn, userId } = useAuth()
  const getToken = useServerFn(getFirebaseTokenFn)

  useEffect(() => {
    if (!isLoaded) return

    const auth = getAuth(app)

    const syncFirebase = async () => {
      if (isSignedIn && userId) {
        // Only fetch and sign in if not already signed in as this user
        if (auth.currentUser?.uid !== userId) {
          try {
            console.log('[FirebaseSync] Get token for:', userId)
            const token = await getToken()
            console.log('[FirebaseSync] Signing in...')
            await signInWithCustomToken(auth, token)
            console.log('[FirebaseSync] Success!')
          } catch (err) {
            console.error('[FirebaseSync] Failed to sync Firebase Auth', err)
          }
        } else {
            console.log('[FirebaseSync] Already signed in as:', auth.currentUser?.uid)
        }
      } else {
        // Sign out of Firebase if logged out of Clerk
        if (auth.currentUser) {
            console.log('[FirebaseSync] Signing out...')
            await signOut(auth)
        }
      }
    }

    syncFirebase()
  }, [isLoaded, isSignedIn, userId, getToken])
}
