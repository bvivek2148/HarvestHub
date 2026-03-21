import { motion } from 'motion/react'
import { X, Bell, Package, Tag, Settings } from 'lucide-react'
import { C, type Notification } from './BuyerTypes'

function NotifIcon({ type }: { type: Notification['type'] }) {
  if (type === 'order')
    return <Package className="w-4 h-4" style={{ color: C.blue }} />
  if (type === 'promo')
    return <Tag className="w-4 h-4" style={{ color: C.gold }} />
  return <Settings className="w-4 h-4" style={{ color: C.purple }} />
}

const TYPE_BG: Record<Notification['type'], string> = {
  order: 'rgba(96,165,250,0.1)',
  promo: 'rgba(240,180,41,0.1)',
  system: 'rgba(167,139,250,0.1)',
}

interface Props {
  onClose: () => void
  notifications: Notification[]
  onMarkRead: (id: string) => void
  onClearAll: () => void
}

export function BuyerNotificationsPanel({
  onClose,
  notifications,
  onMarkRead,
  onClearAll,
}: Props) {
  const unread = notifications.filter((n) => !n.read).length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-end pt-20 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0a1a0a', border: `1px solid ${C.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" style={{ color: C.green }} />
            <h3
              className="text-sm font-bold"
              style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
            >
              Notifications
            </h3>
            {unread > 0 && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: C.green + '20', color: C.green }}
              >
                {unread} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs hover:underline"
                style={{ color: C.muted }}
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="hover:text-[#f5f0e8] transition-colors"
              style={{ color: C.muted }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-5">
              <Bell className="w-8 h-8 mb-3" style={{ color: C.muted }} />
              <p className="text-sm" style={{ color: C.muted }}>
                You're all caught up!
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((n, i) => (
                <motion.button
                  key={n.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => onMarkRead(n.id)}
                  className="w-full flex items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
                  style={{
                    borderBottom:
                      i < notifications.length - 1
                        ? `1px solid ${C.border}`
                        : 'none',
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: TYPE_BG[n.type] }}
                  >
                    <NotifIcon type={n.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className="text-xs font-semibold"
                        style={{ color: n.read ? C.muted : C.text }}
                      >
                        {n.title}
                      </div>
                      {!n.read && (
                        <div
                          className="w-2 h-2 rounded-full shrink-0 mt-1"
                          style={{ background: C.green }}
                        />
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                      {n.message}
                    </p>
                    <p
                      className="text-[10px] mt-1"
                      style={{ color: C.border2 }}
                    >
                      {n.time}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
