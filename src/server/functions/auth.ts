import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'

// We leave these as empty stubs because Clerk handles the actual mechanics UI-side
export const signUpFn = createServerFn({ method: 'POST' }).handler(async () => null)
export const signInFn = createServerFn({ method: 'POST' }).handler(async () => null)

export const authMiddleware = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()
  if (!userId) return { currentUser: null }
  
  // Fetch fresh user data from Clerk Backend API to ensure we have latest metadata
  // sessionClaims often has stale metadata or lacks public_metadata entirely
  const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    }
  })
  
  const clerkUser = await response.json()
  const metadata = (clerkUser?.public_metadata || {}) as any
  const role = metadata.role || 'buyer'
  
  const name = clerkUser?.first_name 
    ? `${clerkUser.first_name}${clerkUser.last_name ? ' ' + clerkUser.last_name : ''}`
    : (clerkUser?.username || 'User')
    
  const email = clerkUser?.email_addresses?.[0]?.email_address || ''
  
  return { 
    currentUser: { 
      id: userId,
      name,
      email,
      labels: [role]
    } 
  }
})

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()
  if (!userId) return null
  
  const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    }
  })
  
  const clerkUser = await response.json()
  const metadata = (clerkUser?.public_metadata || {}) as any
  const role = metadata.role || 'buyer'

  const name = clerkUser?.first_name 
    ? `${clerkUser.first_name}${clerkUser.last_name ? ' ' + clerkUser.last_name : ''}`
    : (clerkUser?.username || 'User')
    
  const email = clerkUser?.email_addresses?.[0]?.email_address || ''

  return { 
    id: userId,
    name,
    email,
    labels: [role]
  }
})

export const forgotPasswordFn = createServerFn({ method: 'POST' }).handler(async () => null)
export const resetPasswordFn = createServerFn({ method: 'POST' }).handler(async () => null)
