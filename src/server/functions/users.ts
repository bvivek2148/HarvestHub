import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { getFirebaseAdmin } from '../admin'
import { sanitizeData } from './utils'

async function checkAdmin() {
  const { userId } = await auth()
  if (!userId) return false
  const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    }
  })
  const user = await response.json()
  return user?.public_metadata?.role === 'admin'
}

export const getCurrentUserProfileFn = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()
  if (!userId) return null
  const { db } = await getFirebaseAdmin()
  const doc = await db.collection('users').doc(userId).get()
  if (!doc.exists) return null
  return sanitizeData({ id: doc.id, ...doc.data() })
})

export const updateUserProfileFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const data = ctx.data as any
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  const { db } = await getFirebaseAdmin()
  await db.collection('users').doc(userId).set({ ...data, updatedAt: new Date() }, { merge: true })
  return { success: true }
})

export const updateUserNameFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const { name } = ctx.data as { name: string }
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  const { db } = await getFirebaseAdmin()
  await db.collection('users').doc(userId).set({ name, updatedAt: new Date() }, { merge: true })
  return { name }
})

export const listAllUsersFn = createServerFn({ method: 'GET' }).handler(async () => {
  if (!(await checkAdmin())) return { users: [] }
  const response = await fetch(`https://api.clerk.com/v1/users?limit=100&offset=0&order_by=-created_at`, {
    headers: {
      'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    }
  })
  const clerkUsers = await response.json()
  if (!Array.isArray(clerkUsers)) return { users: [] }
  const users = clerkUsers.map((u: any) => ({
    id: u.id,
    name: u.first_name ? `${u.first_name}${u.last_name ? ' ' + u.last_name : ''}` : (u.username || 'User'),
    email: u.email_addresses?.[0]?.email_address || '',
    labels: u.public_metadata?.role ? [u.public_metadata.role] : ['buyer'],
    status: !u.banned,
    registration: new Date(u.created_at).toISOString(),
  }))
  return { users }
})

export const updateUserRoleFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const data = ctx.data as { userId: string; role: string }
  if (!(await checkAdmin())) throw new Error('Unauthorized')
  await fetch(`https://api.clerk.com/v1/users/${data.userId}/metadata`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ public_metadata: { role: data.role } })
  })
  return { success: true }
})

export const deleteUserFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const data = ctx.data as { userId: string }
  if (!(await checkAdmin())) throw new Error('Unauthorized')
  await fetch(`https://api.clerk.com/v1/users/${data.userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    }
  })
  return { success: true }
})

export const getPlatformStatsFn = createServerFn({ method: 'GET' }).handler(async () => {
  if (!(await checkAdmin())) throw new Error('Unauthorized')
  const { db } = await getFirebaseAdmin()
  const listings = await db.collection('listings').get()
  const orders = await db.collection('orders').get()
  const reviews = await db.collection('reviews').get()
  return {
    listings: listings.size,
    orders: orders.size,
    reviews: reviews.size,
    revenue: 0,
  }
})
