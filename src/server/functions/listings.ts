import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { getFirebaseAdmin } from '../admin'
import { sanitizeData } from './utils'

type ListingStatus = 'active' | 'low' | 'sold_out' | 'paused'

export interface ListingInput {
  id?: string
  name: string
  description?: string
  price: string
  priceUnit: string
  stock: string
  stockUnit: string
  emoji: string
  status: ListingStatus
  category: string
  imageUrl?: string
  orders?: number
  freshness?: string
  practice?: string
  delivery?: string
}

export const getFarmerListingsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()
  if (!userId) return []
  const { db } = await getFirebaseAdmin()
  const snapshot = await db.collection('listings').where('farmerId', '==', userId).get()
  const listings = snapshot.docs.map(doc => sanitizeData({ id: doc.id, ...doc.data() }))
  return listings.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0))
})

export const getAllListingsFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  try {
    const { category, searchTerm } = (ctx.data || {}) as { category?: string; searchTerm?: string }
    const { db } = await getFirebaseAdmin()
    let query: any = db.collection('listings').where('status', '==', 'active')
    if (category && category !== 'All') query = query.where('category', '==', category)
    const snapshot = await query.get()
    const usersSnapshot = await db.collection('users').get()
    const usersMap = new Map()
    usersSnapshot.forEach(doc => usersMap.set(doc.id, doc.data().name || doc.data().fullName || 'Verified Farmer'))
    let listings = snapshot.docs.map((doc: any) => {
      const data = doc.data() as any
      return sanitizeData({
        id: doc.id,
        ...data,
        farmerName: usersMap.get(data.farmerId) || 'Verified Farmer',
      })
    })
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      listings = listings.filter((l: any) => l.name.toLowerCase().includes(lowerSearch) || l.description?.toLowerCase().includes(lowerSearch))
    }
    return listings.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0))
  } catch (error: any) {
    console.error('[getAllListingsFn] Error:', error.message)
    throw error
  }
})

export const createListingFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const data = ctx.data as ListingInput
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  const { db } = await getFirebaseAdmin()
  const listing = {
    ...data,
    price: data.price?.toString() || '0',
    stock: data.stock?.toString() || '0',
    farmerId: userId,
    views: 0,
    createdAt: new Date(),
  }
  const docRef = await db.collection('listings').add(listing)
  return sanitizeData({ id: docRef.id, ...listing })
})

export const updateListingFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const data = ctx.data as ListingInput
  const { userId } = await auth()
  if (!userId || !data.id) throw new Error('Unauthorized or Missing ID')
  const { db } = await getFirebaseAdmin()
  const docRef = db.collection('listings').doc(data.id)
  const doc = await docRef.get()
  if (!doc.exists || doc.data()?.farmerId !== userId) throw new Error('Unauthorized')
  const updates = { ...data, price: data.price.toString(), stock: data.stock.toString(), updatedAt: new Date() }
  delete updates.id
  await docRef.update(updates)
  return { success: true }
})

export const deleteListingFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const data = ctx.data as { id: string }
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  const { db } = await getFirebaseAdmin()
  const docRef = db.collection('listings').doc(data.id)
  const doc = await docRef.get()
  if (!doc.exists || doc.data()?.farmerId !== userId) throw new Error('Unauthorized')
  await docRef.delete()
  return { success: true }
})

export const toggleWishlistFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const { id: listingId } = ctx.data as { id: string }
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  const { db } = await getFirebaseAdmin()
  const wishlistRef = db.collection('wishlists')
  const q = await wishlistRef.where('userId', '==', userId).where('listingId', '==', listingId).get()
  if (!q.empty) {
    await q.docs[0].ref.delete()
    return { saved: false }
  } else {
    await wishlistRef.add({ userId, listingId, createdAt: new Date() })
    return { saved: true }
  }
})

export const getWishlistFn = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()
  if (!userId) return []
  const { db } = await getFirebaseAdmin()
  const snapshot = await db.collection('wishlists').where('userId', '==', userId).get()
  const listingIds = snapshot.docs.map(doc => doc.data().listingId)
  if (listingIds.length === 0) return []
  const listingsSnapshot = await db.collection('listings').where('__name__', 'in', listingIds.slice(0, 10)).get()
  return listingsSnapshot.docs.map(doc => sanitizeData({ id: doc.id, ...doc.data() }))
})
