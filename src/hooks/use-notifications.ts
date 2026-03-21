import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, onSnapshot, orderBy, limit, doc, updateDoc } from 'firebase/firestore'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'order' | 'message' | 'system'
  read: boolean
  createdAt: any
}

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { app } from '@/lib/firebase'

export function useNotifications() {
  const { currentUser } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!currentUser?.id) return

    const auth = getAuth(app)
    let unsubscribeSnapshot: (() => void) | undefined

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // If we already have a listener, kill it if the user changed
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot()
        unsubscribeSnapshot = undefined
      }

      if (!user) return

      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', currentUser.id),
        orderBy('createdAt', 'asc'),
        limit(20)
      )

      unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Notification[]
        
        const sortedDocs = [...docs].sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis())

        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added' && !snapshot.metadata.fromCache) {
            const data = change.doc.data() as Notification
            toast.info(data.title, {
              description: data.message,
              duration: 5000,
            })
          }
        })

        setNotifications(sortedDocs)
        setUnreadCount(docs.filter(n => !n.read).length)
      })
    })

    return () => {
      unsubscribeAuth()
      if (unsubscribeSnapshot) unsubscribeSnapshot()
    }
  }, [currentUser?.id])

  const markAsRead = async (id: string) => {
    try {
      const ref = doc(db, 'notifications', id)
      await updateDoc(ref, { read: true })
    } catch (err) {
      console.error('Failed to mark notification as read', err)
    }
  }

  const markAllAsRead = async () => {
    // Basic implementation: mark local notifications as read in parallel
    // Production would use a batch or server function
    try {
      const unread = notifications.filter(n => !n.read)
      await Promise.all(unread.map(n => markAsRead(n.id)))
    } catch (err) {
      console.error('Failed to mark all as read', err)
    }
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  }
}
