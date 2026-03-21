import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { getFirebaseAdmin } from '../admin'

export const getFirebaseTokenFn = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const { adminAuth } = await getFirebaseAdmin()

  try {
    const customToken = await adminAuth.createCustomToken(userId)
    return customToken
  } catch (error) {
    console.error('Error creating custom token:', error)
    throw new Error('Failed to generate Firebase token')
  }
})
