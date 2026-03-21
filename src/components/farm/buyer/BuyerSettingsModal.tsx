import { useState } from 'react'
import { motion } from 'motion/react'
import { Link } from '@tanstack/react-router'
import { X, Bell, Moon, Globe, Shield, Mail } from 'lucide-react'
import { C } from './BuyerTypes'
import { toast } from 'sonner'

interface Props {
  onClose: () => void
  displayName: string
  email: string
  initials: string
  onSignOut: () => void
  ordersCount: number
  savedCount: number
  profile?: any
}

interface ToggleSetting {
  label: string
  desc: string
  key: string
  icon: React.ReactNode
}

const TOGGLES: ToggleSetting[] = [
  {
    label: 'Order Notifications',
    desc: 'Get updates on your orders',
    key: 'orderNotifs',
    icon: <Bell className="w-4 h-4" />,
  },
  {
    label: 'Promo Alerts',
    desc: 'Deals and flash sale alerts',
    key: 'promoAlerts',
    icon: <Globe className="w-4 h-4" />,
  },
  {
    label: 'Dark Mode',
    desc: 'App appearance preference',
    key: 'darkMode',
    icon: <Moon className="w-4 h-4" />,
  },
  {
    label: 'Secure Checkout',
    desc: 'Two-factor at checkout',
    key: 'securePay',
    icon: <Shield className="w-4 h-4" />,
  },
]

export function BuyerSettingsModal({
  onClose,
  displayName,
  email,
  initials,
  onSignOut,
  ordersCount,
  savedCount,
}: Props) {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    orderNotifs: true,
    promoAlerts: false,
    darkMode: true,
    securePay: true,
  })

  const toggle = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
    toast.success('Setting updated')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: '#0a1a0a', border: `1px solid ${C.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          <h3
            className="text-base font-bold"
            style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
          >
            Account Settings
          </h3>
          <button
            onClick={onClose}
            className="hover:text-[#f5f0e8] transition-colors"
            style={{ color: C.muted }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Profile */}
          <div
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{ background: C.surface2, border: `1px solid ${C.border}` }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0"
              style={{
                background:
                  'linear-gradient(135deg, rgba(74,222,128,0.25), rgba(74,222,128,0.08))',
                color: C.green,
                border: '2px solid rgba(74,222,128,0.35)',
                fontFamily: "'Syne', sans-serif",
              }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-sm font-bold truncate"
                style={{ color: C.text }}
              >
                {displayName}
              </div>
              <div
                className="text-xs mt-0.5 truncate"
                style={{ color: C.muted }}
              >
                {email}
              </div>
              <div
                className="text-xs mt-1 font-semibold"
                style={{ color: C.green }}
              >
                🛒 Buyer Account
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Orders', value: ordersCount.toString(), color: C.blue },
              { label: 'Saved', value: savedCount.toString(), color: C.red },
              { label: 'Reviews', value: '0', color: C.gold },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-3 text-center"
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div
                  className="text-lg font-bold"
                  style={{ color: s.color, fontFamily: "'Syne', sans-serif" }}
                >
                  {s.value}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: C.muted }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Toggle Settings */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${C.border}` }}
          >
            {TOGGLES.map((t, i) => (
              <div
                key={t.key}
                className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                style={{
                  borderBottom:
                    i < TOGGLES.length - 1 ? `1px solid ${C.border}` : 'none',
                }}
                onClick={() => toggle(t.key)}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: 'rgba(74,222,128,0.08)',
                    color: C.green,
                  }}
                >
                  {t.icon}
                </div>
                <div className="flex-1">
                  <div
                    className="text-sm font-semibold"
                    style={{ color: C.text }}
                  >
                    {t.label}
                  </div>
                  <div className="text-xs" style={{ color: C.muted }}>
                    {t.desc}
                  </div>
                </div>
                <div
                  className="w-10 h-6 rounded-full relative shrink-0 transition-all duration-300"
                  style={{
                    background: settings[t.key]
                      ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                      : 'rgba(255,255,255,0.08)',
                  }}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 rounded-full shadow transition-all duration-300"
                    style={{
                      left: settings[t.key] ? '1.25rem' : '0.125rem',
                      background: '#fff',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <Link
            to="/join-farmer"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-bold transition-all hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #f0b429, #f59e0b)',
              color: '#0d1a0d',
            }}
          >
            🌾 Apply to Become a Farmer
          </Link>

          {/* Need Help? */}
          <div
            className="rounded-2xl p-4 flex items-center justify-between gap-4"
            style={{
              background: 'rgba(74,222,128,0.05)',
              border: '1px solid rgba(74,222,128,0.12)',
            }}
          >
            <div className="flex-1 min-w-0">
              <div
                className="text-[10px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: C.muted }}
              >
                Need Help?
              </div>
              <a
                href="mailto:farmconnect.helpdesk@gmail.com"
                className="text-xs font-bold truncate block hover:underline"
                style={{ color: C.green }}
              >
                farmconnect.helpdesk@gmail.com
              </a>
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: 'rgba(74,222,128,0.1)',
                color: C.green,
              }}
            >
              <Mail className="w-5 h-5" />
            </div>
          </div>

          <button
            onClick={() => {
              onClose()
              onSignOut()
            }}
            className="w-full py-3 rounded-2xl text-sm font-semibold border transition-colors hover:bg-red-950/20"
            style={{ border: `1px solid rgba(248,113,113,0.25)`, color: C.red }}
          >
            Sign Out
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
