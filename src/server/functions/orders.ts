import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { getFirebaseAdmin } from '../admin'
import { sanitizeData } from './utils'

type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderInput {
  farmerId: string
  listingId: string
  qty: number
  total: number
}

export const getFarmerOrdersFn = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()
  if (!userId) return []
  const { db } = await getFirebaseAdmin()
  const snapshot = await db.collection('orders').where('farmerId', '==', userId).orderBy('createdAt', 'desc').get()
  return snapshot.docs.map(doc => sanitizeData({ id: doc.id, ...doc.data() }))
})

export const getBuyerOrdersFn = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()
  if (!userId) return []
  const { db } = await getFirebaseAdmin()
  const snapshot = await db.collection('orders').where('buyerId', '==', userId).orderBy('createdAt', 'desc').get()
  return snapshot.docs.map(doc => sanitizeData({ id: doc.id, ...doc.data() }))
})

export const createOrderFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const data = ctx.data as OrderInput
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  const { db } = await getFirebaseAdmin()
  const listingDoc = await db.collection('listings').doc(data.listingId).get()
  const listingName = listingDoc.data()?.name || 'New Produce'
  const order = { ...data, buyerId: userId, status: 'pending' as OrderStatus, createdAt: new Date() }
  const docRef = await db.collection('orders').add(order)
  await db.collection('notifications').add({
    userId: data.farmerId,
    title: 'New Order! 📦',
    message: `You received a new order for ${listingName}.`,
    type: 'order',
    read: false,
    createdAt: new Date()
  })
  return sanitizeData({ id: docRef.id, ...order })
})

export const updateOrderStatusFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const data = ctx.data as { id: string, status: OrderStatus }
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  const { db } = await getFirebaseAdmin()
  const docRef = db.collection('orders').doc(data.id)
  const doc = await docRef.get()
  if (!doc.exists) throw new Error('NotFound')
  const orderData = doc.data()!
  if (orderData.farmerId !== userId) throw new Error('Unauthorized')
  await docRef.update({ status: data.status })
  const listingDoc = await db.collection('listings').doc(orderData.listingId).get()
  const listingName = listingDoc.data()?.name || 'Produce'
  await db.collection('notifications').add({
    userId: orderData.buyerId,
    title: 'Order Updated 🚚',
    message: `Your order for ${listingName} is now ${data.status}.`,
    type: 'order',
    read: false,
    createdAt: new Date()
  })
  return { success: true }
})
