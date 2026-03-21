import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore'
import { useAuth } from '@/hooks/use-auth'

export interface ChatThread {
  id: string
  participants: string[]
  buyerId: string
  buyerName: string
  farmerId: string
  farmerName: string
  productName: string
  productEmoji: string
  lastMessage: string
  updatedAt: any
  unreadCount: Record<string, number>
}

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  text: string
  createdAt: any
}

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { app } from '@/lib/firebase'

export function useChatThreads() {
  const { currentUser } = useAuth()
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser?.id) {
      setThreads([])
      setLoading(false)
      return
    }

    const auth = getAuth(app)
    let unsubscribeSnapshot: (() => void) | undefined

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user?.uid === currentUser.id) {
        setLoading(true)
        const q = query(
          collection(db, 'threads'),
          where('participants', 'array-contains', currentUser.id),
          orderBy('updatedAt', 'desc')
        )

        unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as ChatThread[]
          setThreads(docs)
          setLoading(false)
        }, (error) => {
          console.error("Chat threads error:", error)
          setLoading(false)
        })
      } else {
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot()
          unsubscribeSnapshot = undefined
        }
        setThreads([])
      }
    })

    return () => {
      unsubscribeAuth()
      if (unsubscribeSnapshot) unsubscribeSnapshot()
    }
  }, [currentUser?.id])

  return { threads, loading }
}

export function useChatMessages(threadId: string | null) {
  const { currentUser } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    if (!threadId || !currentUser?.id) return

    const auth = getAuth(app)
    let unsubscribeSnapshot: (() => void) | undefined

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user?.uid === currentUser.id) {
        const q = query(
          collection(db, 'threads', threadId, 'messages'),
          orderBy('createdAt', 'asc')
        )

        unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as ChatMessage[]
          setMessages(docs)
        })

        // Reset unread count for current user when opening thread
        const ref = doc(db, 'threads', threadId)
        updateDoc(ref, {
          [`unreadCount.${currentUser.id}`]: 0
        }).catch(err => console.error("Failed to reset unread", err))

      } else {
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot()
          unsubscribeSnapshot = undefined
        }
        setMessages([])
      }
    })

    return () => {
      unsubscribeAuth()
      if (unsubscribeSnapshot) unsubscribeSnapshot()
    }
  }, [threadId, currentUser?.id])

  const sendMessage = async (text: string, otherUserId: string) => {
    if (!threadId || !currentUser?.id || !text.trim()) return

    const messageData = {
      senderId: currentUser.id,
      senderName: currentUser.name || 'Member',
      text: text.trim(),
      createdAt: serverTimestamp()
    }

    try {
      // Add message
      await addDoc(collection(db, 'threads', threadId, 'messages'), messageData)

      // Update thread
      const threadRef = doc(db, 'threads', threadId)
      await updateDoc(threadRef, {
        lastMessage: text.trim(),
        updatedAt: serverTimestamp(),
        [`unreadCount.${otherUserId}`]: increment(1)
      })
    } catch (err) {
      console.error('Failed to send message', err)
    }
  }

  return { messages, sendMessage }
}
