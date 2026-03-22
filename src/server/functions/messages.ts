import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { getFirebaseAdmin } from '../admin'
import { sanitizeData } from './utils'

export interface MessageInput {
  threadId: string
  content: string
}

export const getFarmerThreadsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()
  if (!userId) return []
  const { db } = await getFirebaseAdmin()
  const snapshot = await db.collection('threads').where('farmerId', '==', userId).orderBy('updatedAt', 'desc').get()
  return snapshot.docs.map(doc => sanitizeData({ id: doc.id, ...doc.data() }))
})

export const getThreadMessagesFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const { threadId } = ctx.data as { threadId: string }
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  const { db } = await getFirebaseAdmin()
  const snapshot = await db.collection('threads').doc(threadId).collection('messages').orderBy('createdAt', 'asc').get()
  return snapshot.docs.map(doc => sanitizeData({ id: doc.id, ...doc.data() }))
})

export const sendMessageFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const { threadId, content } = ctx.data as MessageInput
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  const { db } = await getFirebaseAdmin()
  const threadRef = db.collection('threads').doc(threadId)
  const thread = await threadRef.get()
  if (!thread.exists) throw new Error('Thread not found')
  const tData = thread.data()!
  const isFarmer = tData.farmerId === userId
  const isBuyer = tData.buyerId === userId
  if (!isFarmer && !isBuyer) throw new Error('Unauthorized')
  const message = { content, senderId: userId, createdAt: new Date() }
  await threadRef.collection('messages').add(message)
  const unreadUpdate: any = {}
  if (isFarmer) unreadUpdate[`unreadCount.${tData.buyerId}`] = (tData.unreadCount?.[tData.buyerId] || 0) + 1
  else unreadUpdate[`unreadCount.${tData.farmerId}`] = (tData.unreadCount?.[tData.farmerId] || 0) + 1
  await threadRef.update({ lastMessage: content, updatedAt: new Date(), ...unreadUpdate })
  return { success: true }
})

export const getOrCreateThreadFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const { farmerId, listingId, farmerName, productName, productEmoji } = ctx.data as any
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  const { db } = await getFirebaseAdmin()
  const buyerDoc = await db.collection('users').doc(userId).get()
  const buyerName = buyerDoc.data()?.name || 'Buyer'
  
  const threadsRef = db.collection('threads')
  const existing = await threadsRef.where('buyerId', '==', userId).where('farmerId', '==', farmerId).where('listingId', '==', listingId).get()
  
  if (!existing.empty) {
    const doc = existing.docs[0]
    const data = doc.data()
    if (!data.participants || !data.buyerName) {
      await doc.ref.update({ 
        participants: [userId, farmerId],
        buyerName: buyerName
      })
    }
    return sanitizeData({ id: doc.id, ...data, participants: [userId, farmerId], buyerName })
  }
  const thread = {
    buyerId: userId,
    farmerId,
    participants: [userId, farmerId],
    listingId,
    buyerName,
    farmerName,
    productName,
    productEmoji,
    lastMessage: 'Interested in your produce!',
    updatedAt: new Date(),
    createdAt: new Date(),
    unreadCount: { [farmerId]: 1, [userId]: 0 }
  }
  const docRef = await threadsRef.add(thread)
  await docRef.collection('messages').add({ content: thread.lastMessage, senderId: userId, createdAt: new Date() })
  return sanitizeData({ id: docRef.id, ...thread })
})

export const markThreadAsReadFn = createServerFn({ method: 'POST' }).handler(async (ctx: any) => {
  const { threadId } = ctx.data as { threadId: string }
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  const { db } = await getFirebaseAdmin()
  const threadRef = db.collection('threads').doc(threadId)
  await threadRef.update({
    [`unreadCount.${userId}`]: 0
  })
  return { success: true }
})
