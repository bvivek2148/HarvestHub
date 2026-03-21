import { createServerFn } from '@tanstack/react-start'
import { getFirebaseAdmin } from '../admin'

export const syncFirebaseUserFn = createServerFn({ method: 'POST' })
  .handler(async (ctx: any) => {
    const data = ctx.data as { idToken: string }
    const { idToken } = data
    const { adminAuth: firebaseAuth } = await getFirebaseAdmin()
    
    try {
      // 1. Verify Firebase Token
      const decodedToken = await firebaseAuth.verifyIdToken(idToken)
      const phoneNumber = decodedToken.phone_number
      
      if (!phoneNumber) {
        throw new Error('No phone number found in token')
      }

      // 2. Search for user in Clerk
      const clerkSecret = process.env.CLERK_SECRET_KEY
      const searchResponse = await fetch(`https://api.clerk.com/v1/users?phone_number=${encodeURIComponent(phoneNumber)}`, {
        headers: {
          'Authorization': `Bearer ${clerkSecret}`
        }
      })
      
      const clerkUsers = await searchResponse.json()
      let clerkUser = clerkUsers[0]

      // 3. Create user in Clerk if not exists
      if (!clerkUser) {
        const createResponse = await fetch(`https://api.clerk.com/v1/users`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${clerkSecret}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            phone_number: [phoneNumber],
            skip_password_checks: true,
            skip_verification: true, // Already verified by Firebase
            public_metadata: {
              role: 'buyer', // Default role for new phone signups
              auth_provider: 'firebase_phone'
            }
          })
        })
        
        if (!createResponse.ok) {
          const err = await createResponse.text()
          throw new Error(`Clerk user creation failed: ${err}`)
        }
        
        clerkUser = await createResponse.json()
      }

      // 4. Create a Sign-In Token for Clerk so the client can log in
      const tokenResponse = await fetch(`https://api.clerk.com/v1/sign_in_tokens`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${clerkSecret}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: clerkUser.id
        })
      })
      
      const tokenData = await tokenResponse.json()

      // 5. Return user info and sign-in token
      return {
        success: true,
        signInToken: tokenData.token,
        user: {
          id: clerkUser.id,
          phoneNumber: phoneNumber,
          role: clerkUser.public_metadata?.role || 'buyer'
        }
      }
    } catch (error: any) {
      console.error('Sync Error:', error)
      return { success: false, error: error.message }
    }
  })
