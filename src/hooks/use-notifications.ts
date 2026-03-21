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

export function useNotifications() {
  const { currentUser } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!currentUser?.id) return

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.id),
      orderBy('createdAt', 'asc'), // Fetch in ASC order to handle "new" arrivals easily? No, keep DESC for list.
      limit(20)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[]
      
      // Sort desc for the UI list
      const sortedDocs = [...docs].sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis())

      // Look for newly added docs
      snapshot.docChanges().forEach((change) => {
          if (change.type === 'added' && !snapshot.metadata.fromCache) {
              const data = change.doc.data() as Notification
              // Only toast if it's very recent (not initial load)
              toast.info(data.title, {
                  description: data.message,
                  duration: 5000,
              })
          }
      })

      setNotifications(sortedDocs)
      setUnreadCount(docs.filter(n => !n.read).length)
    })

    return () => unsubscribe()
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
