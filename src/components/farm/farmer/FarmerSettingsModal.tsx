import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Mail, MapPin, Phone, CheckCircle, Loader2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useRouter } from '@tanstack/react-router'
import { updateUserProfileFn } from '@/server/functions/users'
import { toast } from 'sonner'
import { C } from './FarmerTypes'

const INPUT_CLS =
  'w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all'
const INPUT_STYLE = {
  background: 'rgba(15,31,15,0.8)',
  border: '1px solid rgba(55,95,55,0.4)',
  color: '#eef5ee',
}
const LABEL_CLS = 'block text-xs font-semibold uppercase tracking-wider mb-1.5'

type Tab = 'profile' | 'notifications' | 'preferences'

const TOGGLE_ITEMS = [
  {
    id: 'newOrders',
    label: 'New order alerts',
    desc: 'Get notified when a buyer places an order',
  },
  {
    id: 'messages',
    label: 'Message alerts',
    desc: 'Notifications for new buyer messages',
  },
  {
    id: 'lowStock',
    label: 'Low stock warnings',
    desc: 'Alert when stock drops below 10 units',
  },
  {
    id: 'reviews',
    label: 'New reviews',
    desc: 'Notify when buyers leave reviews',
  },
]

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean
  onChange: () => void
}) {
  return (
    <button
      onClick={onChange}
      className="relative rounded-full transition-all shrink-0"
      style={{
        width: 40,
        height: 22,
        background: enabled
          ? 'linear-gradient(135deg, #4ade80, #16a34a)'
          : 'rgba(55,95,55,0.3)',
        border: enabled
          ? '1px solid rgba(74,222,128,0.4)'
          : '1px solid rgba(55,95,55,0.4)',
      }}
    >
      <div
        className="absolute top-0.5 rounded-full transition-all"
        style={{
          width: 17,
          height: 17,
          background: '#fff',
          left: enabled ? 20 : 2,
        }}
      />
    </button>
  )
}


interface Props {
  user: { 
    name: string; 
    email: string;
    phone?: string;
    location?: string;
    farmName?: string;
    bio?: string;
  }
  onClose: () => void
  onNameUpdated?: (name: string) => void
}

export function FarmerSettingsModal({ user, onClose, onNameUpdated }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone || '')
  const [location, setLocation] = useState(user.location || '')
  const [farmName, setFarmName] = useState(user.farmName || '')
  const [bio, setBio] = useState(user.bio || '')
  const [toggles, setToggles] = useState({
    newOrders: true,
    messages: true,
    lowStock: true,
    reviews: false,
  })
  const router = useRouter()
  const updateProfile = useServerFn(updateUserProfileFn)

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!name.trim()) throw new Error('Name cannot be empty')
      return (updateProfile as any)({ 
        data: { 
          name: name.trim(),
          phone: phone.trim(),
          location: location.trim(),
          farmName: farmName.trim(),
          bio: bio.trim()
        } 
      })
    },
    onSuccess: async () => {
      toast.success('Profile updated successfully!')
      await router.invalidate()
      onNameUpdated?.(name.trim())
    },
    onError: (err: unknown) => {
      const e = err as { message?: string }
      toast.error(e?.message ?? 'Failed to update profile')
    },
  })

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'notifications', label: 'Alerts', icon: '🔔' },
    { id: 'preferences', label: 'Account', icon: '⚙️' },
  ]

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
        exit={{ scale: 0.92, opacity: 0 }}
        className="rounded-2xl w-full max-w-md overflow-hidden"
        style={{
          background: '#070e07',
          border: '1px solid rgba(74,222,128,0.18)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          <div>
            <div
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: C.muted }}
            >
              Account
            </div>
            <div
              className="text-base font-bold"
              style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
            >
              Settings & Profile
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg"
            style={{ color: C.muted }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex" style={{ borderBottom: `1px solid ${C.border}` }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-3 text-xs font-semibold transition-all"
              style={{
                color: activeTab === tab.id ? C.green : C.muted,
                borderBottom: `2px solid ${activeTab === tab.id ? C.green : 'transparent'}`,
                background:
                  activeTab === tab.id
                    ? 'rgba(74,222,128,0.05)'
                    : 'transparent',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.form
              key="profile"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              onSubmit={(e) => {
                e.preventDefault()
                saveMutation.mutate()
              }}
              className="p-6 space-y-4 max-h-[60vh] overflow-y-auto"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
                  style={{
                    background:
                      'linear-gradient(135deg,rgba(74,222,128,0.25),rgba(74,222,128,0.08))',
                    color: C.green,
                    border: '2px solid rgba(74,222,128,0.35)',
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  {(name || user.name)
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: C.text }}>
                    {name || user.name}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: C.green }}>
                    🌾 Verified Farmer
                  </div>
                </div>
              </div>

              <div>
                <label className={LABEL_CLS} style={{ color: C.muted }}>
                  Display Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className={INPUT_CLS}
                  style={INPUT_STYLE}
                />
              </div>
              <div>
                <label className={LABEL_CLS} style={{ color: C.muted }}>
                  Farm Name
                </label>
                <input
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="e.g. Hyderabad Organic Farm"
                  className={INPUT_CLS}
                  style={INPUT_STYLE}
                />
              </div>
              <div>
                <label className={LABEL_CLS} style={{ color: C.muted }}>
                  Email (read-only)
                </label>
                <div
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
                  style={{
                    background: 'rgba(74,222,128,0.05)',
                    border: '1px solid rgba(74,222,128,0.15)',
                    color: C.muted,
                  }}
                >
                  <Mail className="w-4 h-4" style={{ color: C.green }} />
                  {user.email}
                </div>
              </div>
              <div>
                <label className={LABEL_CLS} style={{ color: C.muted }}>
                  Phone
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: C.muted }}
                  />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={`${INPUT_CLS} pl-10`}
                    style={INPUT_STYLE}
                  />
                </div>
              </div>
              <div>
                <label className={LABEL_CLS} style={{ color: C.muted }}>
                  Farm Location
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: C.muted }}
                  />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Moinabad, Ranga Reddy, Telangana"
                    className={`${INPUT_CLS} pl-10`}
                    style={INPUT_STYLE}
                  />
                </div>
              </div>
              <div>
                <label className={LABEL_CLS} style={{ color: C.muted }}>
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell buyers about your farm…"
                  rows={2}
                  className={`${INPUT_CLS} resize-none`}
                  style={INPUT_STYLE}
                />
              </div>

              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
                style={{
                  background: saveMutation.isSuccess
                    ? 'rgba(74,222,128,0.15)'
                    : 'linear-gradient(135deg,#4ade80,#16a34a)',
                  color: saveMutation.isSuccess ? C.green : '#051005',
                  border: saveMutation.isSuccess
                    ? `1px solid ${C.green}44`
                    : 'none',
                }}
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving…
                  </>
                ) : saveMutation.isSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Saved!
                  </>
                ) : (
                  'Save Profile'
                )}
              </button>
            </motion.form>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-6 space-y-3"
            >
              {TOGGLE_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl"
                  style={{
                    background: C.surface2,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: C.text }}
                    >
                      {item.label}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: C.muted }}>
                      {item.desc}
                    </div>
                  </div>
                  <Toggle
                    enabled={toggles[item.id as keyof typeof toggles]}
                    onChange={() =>
                      setToggles((t) => ({
                        ...t,
                        [item.id]: !t[item.id as keyof typeof toggles],
                      }))
                    }
                  />
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'preferences' && (
            <motion.div
              key="preferences"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-6 space-y-4"
            >
              <div
                className="rounded-xl p-4 space-y-3"
                style={{
                  background: C.surface2,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: C.muted }}
                >
                  Account Info
                </div>
                {[
                  ['Role', '🌾 Farmer'],
                  ['Status', 'Verified'],
                  ['Email', user.email],
                  ['Support', 'farmconnect.helpdesk@gmail.com'],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between text-xs py-1"
                    style={{ borderBottom: `1px solid ${C.border}` }}
                  >
                    <span style={{ color: C.muted }}>{k}</span>
                    <span style={{ color: C.text }}>{v}</span>
                  </div>
                ))}
              </div>
              <div
                className="rounded-xl p-4"
                style={{
                  background: 'rgba(248,113,113,0.05)',
                  border: '1px solid rgba(248,113,113,0.15)',
                }}
              >
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: C.muted }}
                >
                  Need Help?
                </div>
                <a
                  href="mailto:farmconnect.helpdesk@gmail.com"
                  className="text-xs font-semibold flex items-center gap-1.5 hover:underline"
                  style={{ color: C.green }}
                >
                  <Mail className="w-3.5 h-3.5" />
                  farmconnect.helpdesk@gmail.com
                </a>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl text-sm font-semibold"
                style={{ border: `1px solid ${C.border}`, color: C.muted }}
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
