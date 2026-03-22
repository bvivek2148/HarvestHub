import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { useAuth } from '@/hooks/use-auth'
import { sendMessageFn, markThreadAsReadFn } from '@/server/functions/messages'
import { toast } from 'sonner'

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
  content: string
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
          if (error.code === 'permission-denied') {
            toast.error("Dashboard: Chat loading blocked by Firestore permissions. Please check your Firebase Console rules.")
          }
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

        // Reset unread count for current user when opening thread via server
        ;(markThreadAsReadFn as any)({ data: { threadId } })
          .catch((err: any) => console.error("Failed to reset unread via server", err))

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

  const sendMessage = async (content: string, _otherUserId: string) => {
    if (!threadId || !currentUser?.id || !content.trim()) return
    try {
      await (sendMessageFn as any)({ data: { threadId, content: content.trim() } })
    } catch (err) {
      console.error('Failed to send message via server', err)
    }
  }

  return { messages, sendMessage }
}
