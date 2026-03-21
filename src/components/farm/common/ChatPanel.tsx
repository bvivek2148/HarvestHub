import { useState } from 'react'
import { motion } from 'motion/react'
import { X, Send } from 'lucide-react'
import { useChatMessages, type ChatThread } from '@/hooks/use-firestore-chat'
import { C } from '../farmer/FarmerTypes'

interface Props {
  thread: ChatThread
  currentUserId: string
  onClose: () => void
}

export function ChatPanel({ thread, currentUserId, onClose }: Props) {
  const [input, setInput] = useState('')
  const { messages, sendMessage } = useChatMessages(thread.id)

  const otherUserId = thread.participants.find(id => id !== currentUserId) || ''
  const otherUserName = currentUserId === thread.buyerId ? thread.farmerName : thread.buyerName

  const handleSend = async () => {
    if (!input.trim()) return
    await sendMessage(input, otherUserId)
    setInput('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className="fixed inset-y-0 right-0 z-50 w-full max-w-sm flex flex-col shadow-2xl"
      style={{ background: '#070e07', borderLeft: `1px solid ${C.border}` }}
    >
      <div
        className="flex items-center gap-3 px-4 py-4"
        style={{ borderBottom: `1px solid ${C.border}` }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-base relative shrink-0"
          style={{
            background: 'rgba(74,222,128,0.1)',
            border: `1px solid ${C.border}`,
          }}
        >
          {thread.productEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold" style={{ color: C.text }}>
            {otherUserName}
          </div>
          <div
            className="text-xs"
            style={{ color: C.muted }}
          >
            Re: {thread.productName}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-theme-muted hover:bg-theme-surface2 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => {
            const isMe = m.senderId === currentUserId
            return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-[82%] px-4 py-2.5 rounded-2xl text-sm"
              style={{
                background:
                  isMe ? 'rgba(74,222,128,0.15)' : C.surface2,
                color: isMe ? C.green : C.text,
                border:
                  isMe
                    ? '1px solid rgba(74,222,128,0.25)'
                    : `1px solid ${C.border}`,
                borderBottomRightRadius: isMe ? 4 : undefined,
                borderBottomLeftRadius: !isMe ? 4 : undefined,
              }}
            >
              {m.text}
              <div className="text-[10px] opacity-50 mt-1">
                {m.createdAt?.toDate ? m.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
              </div>
            </div>
          </motion.div>
        )})}
      </div>

      <div
        className="px-4 py-4 flex gap-2"
        style={{ borderTop: `1px solid ${C.border}` }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message…"
          className="flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none"
          style={{
            background: C.surface2,
            border: `1px solid ${C.border}`,
            color: C.text,
          }}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-1.5 transition-all hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, #4ade80, #16a34a)',
            color: '#051005',
          }}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}
