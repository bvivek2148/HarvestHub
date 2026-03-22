import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronRight, Loader2 } from 'lucide-react'
import { C } from './BuyerTypes'
import { useChatThreads, type ChatThread } from '@/hooks/use-firestore-chat'
import { ChatPanel } from '../common/ChatPanel'
import { useAuth } from '@/hooks/use-auth'

export function BuyerChatTab({ activeThreadId }: { activeThreadId?: string | null }) {
  const { currentUser } = useAuth()
  const { threads, loading } = useChatThreads()
  const [activeChat, setActiveChat] = useState<ChatThread | null>(null)

  useEffect(() => {
    if (activeThreadId && threads.length > 0) {
      const thread = threads.find(t => t.id === activeThreadId)
      if (thread) setActiveChat(thread)
    }
  }, [activeThreadId, threads])

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center py-20 gap-3" style={{ color: C.muted }}>
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: C.green }} />
              <p className="text-sm">Loading conversations…</p>
          </div>
      )
  }

  return (
    <>
      <div className="space-y-5">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
          >
            My Conversations{' '}
            <span
              className="text-sm font-normal ml-1"
              style={{ color: C.muted }}
            >
              ({threads.length})
            </span>
          </h2>
          <p className="text-xs mt-0.5" style={{ color: C.muted }}>
            Contact farmers directly about their produce
          </p>
        </div>

        {threads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">💬</div>
            <h3
              className="text-lg font-bold mb-2"
              style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
            >
              No conversations yet
            </h3>
            <p className="text-sm max-w-xs" style={{ color: C.muted }}>
              Go to the Explore tab and message a farmer to start chatting!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {threads.map((thread, i) => {
              const unread = thread.unreadCount?.[currentUser?.id || ''] ?? 0
              return (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActiveChat(thread)}
                whileHover={{ x: 3 }}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all"
                style={{
                  background: C.surface,
                  border: `1px solid ${unread > 0 ? C.green + '30' : C.border}`,
                }}
              >
                <div className="relative shrink-0">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                    style={{
                      background: 'rgba(74,222,128,0.08)',
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    {thread.productEmoji}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-bold"
                      style={{ color: C.text }}
                    >
                      {thread.farmerName}
                    </span>
                    <span className="text-xs" style={{ color: C.muted }}>
                      {thread.updatedAt?.toDate ? thread.updatedAt.toDate().toLocaleDateString() : '...'}
                    </span>
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: C.muted }}>
                    Re: {thread.productName}
                  </div>
                  <div
                    className="text-xs mt-0.5 truncate"
                    style={{ color: unread > 0 ? '#b5ceb5' : C.muted }}
                  >
                    {thread.lastMessage}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {unread > 0 && (
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: C.green, color: '#051005' }}
                    >
                      {unread}
                    </span>
                  )}
                  <ChevronRight
                    className="w-4 h-4"
                    style={{ color: C.muted }}
                  />
                </div>
              </motion.div>
            )})}
          </div>
        )}
      </div>

      <AnimatePresence>
        {activeChat && currentUser && (
          <ChatPanel 
            thread={activeChat} 
            currentUserId={currentUser.id}
            onClose={() => setActiveChat(null)} 
          />
        )}
      </AnimatePresence>
    </>
  )
}
