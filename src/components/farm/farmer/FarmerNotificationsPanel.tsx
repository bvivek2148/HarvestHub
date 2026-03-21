import { motion } from 'motion/react'
import { X, Bell } from 'lucide-react'
import { C, type Notification } from './FarmerTypes'

const TYPE_CONFIG: Record<
  Notification['type'],
  { color: string; icon: string }
> = {
  order: { color: C.green, icon: '📦' },
  review: { color: C.gold, icon: '⭐' },
  system: { color: C.blue, icon: '🔔' },
  promo: { color: C.purple, icon: '🎁' },
}

interface Props {
  notifications: Notification[]
  onMarkRead: (id: string) => void
  onClearAll: () => void
  onClose: () => void
}

export function FarmerNotificationsPanel({
  notifications,
  onMarkRead,
  onClearAll,
  onClose,
}: Props) {
  const unread = notifications.filter((n) => !n.read).length

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className="absolute right-0 top-full mt-2 w-80 rounded-2xl overflow-hidden shadow-2xl z-50"
      style={{
        background: '#080f08',
        border: '1px solid rgba(74,222,128,0.2)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" style={{ color: C.green }} />
          <span className="text-sm font-bold" style={{ color: C.text }}>
            Notifications
          </span>
          {unread > 0 && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: C.green + '20', color: C.green }}
            >
              {unread} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button
              onClick={onClearAll}
              className="text-[10px] font-semibold hover:underline"
              style={{ color: C.muted }}
            >
              Clear all
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg"
            style={{ color: C.muted }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-72 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-10 text-center">
            <div className="text-3xl mb-2">🔔</div>
            <p className="text-sm" style={{ color: C.muted }}>
              All caught up!
            </p>
          </div>
        ) : (
          notifications.map((n) => {
            const tc = TYPE_CONFIG[n.type]
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-all hover:bg-white/[0.02]"
                style={{
                  borderBottom: `1px solid ${C.border}`,
                  background: n.read ? 'transparent' : 'rgba(74,222,128,0.03)',
                }}
                onClick={() => onMarkRead(n.id)}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0 mt-0.5"
                  style={{ background: tc.color + '15' }}
                >
                  {tc.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-xs font-bold"
                      style={{ color: n.read ? C.muted : C.text }}
                    >
                      {n.title}
                    </span>
                    {!n.read && (
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: C.green }}
                      />
                    )}
                  </div>
                  <p className="text-[11px] mt-0.5" style={{ color: C.muted }}>
                    {n.message}
                  </p>
                  <p
                    className="text-[10px] mt-1"
                    style={{ color: C.muted + '80' }}
                  >
                    {n.time}
                  </p>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </motion.div>
  )
}
