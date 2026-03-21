import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import {
  listAllUsersFn,
  updateUserRoleFn,
  deleteUserFn,
  getPlatformStatsFn,
} from '@/server/functions/users'
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Users,
  LogOut,
  Sprout,
  Bell,
  BarChart3,
  Settings,
  Search,
  Trash2,
  ChevronDown,
  CheckCircle,
  Loader2,
  AlertTriangle,
  ArrowUpCircle,
  Mail,
  ShieldOff,
  X,
  TrendingUp,
  Activity,
  Eye,
  RefreshCw,
  Shield,
  Leaf,
  ShoppingCart,
  Menu,
  Zap,
  ArrowRight,
  ChevronRight,
  Home,
  UserCheck,
} from 'lucide-react'
import { toast } from 'sonner'

type UserRole = 'farmer' | 'buyer'
type TabType = 'overview' | 'users' | 'applications' | 'analytics' | 'settings'

interface UserRow {
  id: string
  name: string
  email: string
  labels: string[]
  status: boolean
  registration: string
}

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: '#06080f',
  surface: '#0d1117',
  surface2: '#161b22',
  surface3: '#1c2128',
  border: 'rgba(48,54,70,0.8)',
  borderGlow: 'rgba(34,197,94,0.25)',
  text: '#e6edf3',
  textSub: '#8b949e',
  textMuted: '#484f58',
  green: '#22c55e',
  greenDark: '#16a34a',
  greenGlow: 'rgba(34,197,94,0.15)',
  amber: '#f59e0b',
  amberGlow: 'rgba(245,158,11,0.15)',
  violet: '#a78bfa',
  violetGlow: 'rgba(167,139,250,0.15)',
  red: '#f87171',
  redGlow: 'rgba(248,113,113,0.12)',
  blue: '#60a5fa',
  blueGlow: 'rgba(96,165,250,0.12)',
}

const ROLE_COLORS: Record<
  string,
  { color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  farmer: {
    color: C.green,
    bg: C.greenGlow,
    border: C.borderGlow,
    icon: <Leaf className="w-3 h-3" />,
  },
  buyer: {
    color: C.amber,
    bg: C.amberGlow,
    border: 'rgba(245,158,11,0.3)',
    icon: <ShoppingCart className="w-3 h-3" />,
  },
  admin: {
    color: C.violet,
    bg: C.violetGlow,
    border: 'rgba(167,139,250,0.3)',
    icon: <Shield className="w-3 h-3" />,
  },
  none: {
    color: C.textSub,
    bg: 'rgba(139,148,158,0.1)',
    border: 'rgba(139,148,158,0.2)',
    icon: <Users className="w-3 h-3" />,
  },
}

function getRoleKey(labels: string[]): string {
  if (labels.includes('admin')) return 'admin'
  if (labels.includes('farmer')) return 'farmer'
  if (labels.includes('buyer')) return 'buyer'
  return 'none'
}

function getInitials(name: string, email?: string): string {
  const n = name || email?.split('@')[0] || '??'
  return n
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const end = value
    const step = Math.ceil(end / 30)
    const timer = setInterval(() => {
      start = Math.min(start + step, end)
      setDisplay(start)
      if (start >= end) clearInterval(timer)
    }, 20)
    return () => clearInterval(timer)
  }, [value])
  return <>{display}</>
}

function StatCard({
  label,
  value,
  sub,
  color,
  icon,
  loading,
  onClick,
}: {
  label: string
  value: number
  sub?: string
  color: string
  icon: React.ReactNode
  loading?: boolean
  onClick?: () => void
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={onClick}
      className={`rounded-2xl p-5 relative overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
      style={{ background: C.surface2, border: `1px solid ${C.border}` }}
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
        style={{
          background: color,
          opacity: 0.06,
          filter: 'blur(24px)',
          transform: 'translate(30%,-30%)',
        }}
      />
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}18`, color }}
        >
          {icon}
        </div>
        {onClick && (
          <ChevronRight className="w-4 h-4" style={{ color: C.textMuted }} />
        )}
      </div>
      <div
        className="text-3xl font-black mb-3"
        style={{ color: C.text, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}
      >
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin" style={{ color }} />
        ) : (
          <AnimatedNumber value={value} />
        )}
      </div>
      <div className="text-sm font-medium" style={{ color: C.textSub }}>
        {label}
      </div>
      {sub && (
        <div className="text-xs mt-1" style={{ color }}>
          {sub}
        </div>
      )}
    </motion.div>
  )
}

function RoleBadge({ role }: { role: string }) {
  const rc = ROLE_COLORS[role] ?? ROLE_COLORS.none
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        background: rc.bg,
        color: rc.color,
        border: `1px solid ${rc.border}`,
      }}
    >
      {rc.icon}
      {role === 'none'
        ? 'No Role'
        : role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  )
}

function Avatar({
  name,
  email,
  role,
  size = 10,
}: {
  name: string
  email?: string
  role: string
  size?: number
}) {
  const rc = ROLE_COLORS[role] ?? ROLE_COLORS.none
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center font-bold shrink-0`}
      style={{
        background: rc.bg,
        color: rc.color,
        border: `1px solid ${rc.border}`,
        fontSize: size <= 8 ? 11 : 14,
        fontFamily: "'Syne', sans-serif",
      }}
    >
      {getInitials(name, email)}
    </div>
  )
}

function UserRowItem({
  user,
  onView,
  onRole,
  onDelete,
  roleLoading,
}: {
  user: UserRow
  onView: (u: UserRow) => void
  onRole: (userId: string, role: UserRole) => void
  onDelete: (userId: string) => void
  roleLoading: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const role = getRoleKey(user.labels)
  const rc = ROLE_COLORS[role]
  const isAdmin = role === 'admin'
  const name = user.name || user.email?.split('@')[0] || 'Unknown'

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <motion.tr
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="group"
      style={{ borderBottom: `1px solid ${C.border}` }}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={name} email={user.email} role={role} size={9} />
          <div className="min-w-0">
            <div
              className="text-sm font-semibold truncate"
              style={{ color: C.text }}
            >
              {name}
            </div>
            <div className="text-xs truncate" style={{ color: C.textSub }}>
              {user.email}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <RoleBadge role={role} />
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <div className="flex items-center gap-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: user.status ? C.green : C.red }}
          />
          <span
            className="text-xs"
            style={{ color: user.status ? C.green : C.red }}
          >
            {user.status ? 'Active' : 'Inactive'}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <span className="text-xs" style={{ color: C.textSub }}>
          {formatDate(user.registration)}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={() => onView(user)}
            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
            style={{ color: C.textSub }}
            title="View details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {!isAdmin && (
            <div className="relative" ref={ref}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: C.surface3,
                  color: C.textSub,
                  border: `1px solid ${C.border}`,
                }}
              >
                <span style={{ color: rc.color }}>●</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    className="absolute right-0 top-full mt-1 z-30 rounded-xl overflow-hidden shadow-2xl w-36"
                    style={{
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    {(['farmer', 'buyer'] as UserRole[]).map((r) => {
                      const rci = ROLE_COLORS[r]
                      return (
                        <button
                          key={r}
                          onClick={() => {
                            onRole(user.id, r)
                            setOpen(false)
                          }}
                          disabled={roleLoading || role === r}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-left transition-colors disabled:opacity-40"
                          style={{ color: rci.color }}
                          onMouseEnter={(e) => {
                            ;(e.currentTarget as HTMLElement).style.background =
                              C.surface2
                          }}
                          onMouseLeave={(e) => {
                            ;(e.currentTarget as HTMLElement).style.background =
                              'transparent'
                          }}
                        >
                          {rci.icon}
                          Make {r.charAt(0).toUpperCase() + r.slice(1)}
                          {role === r && (
                            <CheckCircle className="w-3 h-3 ml-auto opacity-60" />
                          )}
                        </button>
                      )
                    })}
                    <div style={{ borderTop: `1px solid ${C.border}` }}>
                      <button
                        onClick={() => {
                          onDelete(user.id)
                          setOpen(false)
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-left transition-colors"
                        style={{ color: C.red }}
                        onMouseEnter={(e) => {
                          ;(e.currentTarget as HTMLElement).style.background =
                            'rgba(248,113,113,0.06)'
                        }}
                        onMouseLeave={(e) => {
                          ;(e.currentTarget as HTMLElement).style.background =
                            'transparent'
                        }}
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          {isAdmin && (
            <div
              className="px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1"
              style={{
                background: C.surface3,
                color: C.violet,
                border: `1px solid rgba(167,139,250,0.2)`,
              }}
            >
              <Shield className="w-3 h-3" />
            </div>
          )}
        </div>
      </td>
    </motion.tr>
  )
}

function UserDetailModal({
  user,
  onClose,
  onRole,
  onDelete,
}: {
  user: UserRow
  onClose: () => void
  onRole: (userId: string, role: UserRole) => void
  onDelete: (userId: string) => void
}) {
  const role = getRoleKey(user.labels)
  const name = user.name || user.email?.split('@')[0] || 'Unknown'
  const isAdmin = role === 'admin'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 22, stiffness: 300 }}
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{ background: C.surface, border: `1px solid ${C.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          <span
            className="text-sm font-bold"
            style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
          >
            User Details
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg transition-colors"
            style={{ color: C.textMuted }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <Avatar name={name} email={user.email} role={role} size={14} />
            <div>
              <div className="text-base font-bold" style={{ color: C.text }}>
                {name}
              </div>
              <div className="text-xs mb-2" style={{ color: C.textSub }}>
                {user.email}
              </div>
              <RoleBadge role={role} />
            </div>
          </div>
          <div
            className="rounded-xl p-4 space-y-2.5"
            style={{ background: C.surface2, border: `1px solid ${C.border}` }}
          >
            {[
              {
                label: 'Status',
                value: user.status ? 'Active' : 'Inactive',
                color: user.status ? C.green : C.red,
              },
              {
                label: 'Joined',
                value: formatDate(user.registration),
                color: C.text,
              },
              {
                label: 'User ID',
                value: user.id.slice(0, 14) + '…',
                color: C.textMuted,
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between items-center"
              >
                <span className="text-xs" style={{ color: C.textSub }}>
                  {row.label}
                </span>
                <span
                  className="text-xs font-medium font-mono"
                  style={{ color: row.color }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
          {!isAdmin ? (
            <div className="space-y-2">
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: C.textMuted }}
              >
                Change Role
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(['farmer', 'buyer'] as UserRole[]).map((r) => {
                  const rc = ROLE_COLORS[r]
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        onRole(user.id, r)
                        onClose()
                      }}
                      disabled={role === r}
                      className="py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: rc.bg,
                        color: rc.color,
                        border: `1px solid ${rc.border}`,
                      }}
                    >
                      {rc.icon} Make {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => {
                  onDelete(user.id)
                  onClose()
                }}
                className="w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all mt-1"
                style={{
                  background: C.redGlow,
                  color: C.red,
                  border: `1px solid rgba(248,113,113,0.2)`,
                }}
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Account
              </button>
            </div>
          ) : (
            <div
              className="rounded-xl p-4 text-center"
              style={{ background: C.violetGlow }}
            >
              <ShieldOff
                className="w-5 h-5 mx-auto mb-1.5"
                style={{ color: C.violet }}
              />
              <p className="text-xs" style={{ color: C.textSub }}>
                Admin accounts are protected from modification.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function DeleteModal({
  onConfirm,
  onCancel,
  loading,
}: {
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 300 }}
        className="w-full max-w-sm rounded-2xl p-6 text-center"
        style={{
          background: C.surface,
          border: `1px solid rgba(248,113,113,0.3)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{
            background: C.redGlow,
            border: '1px solid rgba(248,113,113,0.25)',
          }}
        >
          <AlertTriangle className="w-7 h-7" style={{ color: C.red }} />
        </div>
        <h3
          className="text-lg font-black mb-2"
          style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
        >
          Delete User?
        </h3>
        <p className="text-sm mb-6" style={{ color: C.textSub }}>
          This action is permanent and cannot be undone. All user data will be
          removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: C.surface2,
              color: C.textSub,
              border: `1px solid ${C.border}`,
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
            style={{
              background: 'linear-gradient(135deg,#ef4444,#b91c1c)',
              color: '#fff',
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-xl px-4 py-3 shadow-2xl"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}
    >
      {label && (
        <div
          className="text-xs font-semibold mb-2"
          style={{ color: C.textSub }}
        >
          {label}
        </div>
      )}
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: p.color }}
          />
          <span style={{ color: C.textSub }}>{p.name}:</span>
          <span className="font-bold" style={{ color: C.text }}>
            {p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function OverviewTab({
  allUsers,
  farmers,
  buyers,
  admins,
  unassigned,
  listings,
  orders,
  loading,
  setActiveTab,
}: {
  allUsers: UserRow[]
  farmers: number
  buyers: number
  admins: number
  unassigned: number
  listings: number
  orders: number
  loading: boolean
  setActiveTab: (t: TabType) => void
}) {
  const growthData = (() => {
    const months: Record<
      string,
      { month: string; farmers: number; buyers: number; total: number }
    > = {}
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = d.toLocaleString('default', { month: 'short' })
      months[key] = { month: key, farmers: 0, buyers: 0, total: 0 }
    }
    allUsers.forEach((u) => {
      const d = new Date(u.registration)
      const diff =
        (now.getFullYear() - d.getFullYear()) * 12 +
        now.getMonth() -
        d.getMonth()
      if (diff >= 0 && diff <= 5) {
        const key = d.toLocaleString('default', { month: 'short' })
        if (months[key]) {
          months[key].total++
          if (u.labels.includes('farmer')) months[key].farmers++
          else if (u.labels.includes('buyer')) months[key].buyers++
        }
      }
    })
    return Object.values(months)
  })()

  const pieData = [
    { name: 'Farmers', value: farmers, color: C.green },
    { name: 'Buyers', value: buyers, color: C.amber },
    { name: 'Admins', value: admins, color: C.violet },
    { name: 'Unassigned', value: unassigned, color: C.textMuted },
  ].filter((d) => d.value > 0)

  const recentUsers = [...allUsers]
    .sort(
      (a, b) =>
        new Date(b.registration).getTime() - new Date(a.registration).getTime(),
    )
    .slice(0, 5)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={allUsers.length}
          color={C.blue}
          icon={<Users className="w-5 h-5" />}
          loading={loading}
          onClick={() => setActiveTab('users')}
          sub="All registered"
        />
        <StatCard
          label="Active Listings"
          value={listings}
          color={C.green}
          icon={<Leaf className="w-5 h-5" />}
          loading={loading}
          sub="In marketplace"
        />
        <StatCard
          label="Total Orders"
          value={orders}
          color={C.amber}
          icon={<ShoppingCart className="w-5 h-5" />}
          loading={loading}
          sub="All time"
        />
        <StatCard
          label="Unassigned"
          value={unassigned}
          color={unassigned > 0 ? C.red : C.green}
          icon={<AlertTriangle className="w-5 h-5" />}
          loading={loading}
          onClick={() => setActiveTab('users')}
          sub={unassigned > 0 ? 'Needs attention' : 'All assigned'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          className="lg:col-span-2 rounded-2xl p-5"
          style={{ background: C.surface2, border: `1px solid ${C.border}` }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <div
                className="text-sm font-bold"
                style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
              >
                User Growth
              </div>
              <div className="text-xs" style={{ color: C.textSub }}>
                Last 6 months
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span
                className="flex items-center gap-1.5"
                style={{ color: C.textSub }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: C.green }}
                />
                Farmers
              </span>
              <span
                className="flex items-center gap-1.5"
                style={{ color: C.textSub }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: C.amber }}
                />
                Buyers
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="gFarmer" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.green} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={C.green} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gBuyer" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.amber} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={C.amber} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis
                dataKey="month"
                tick={{ fill: C.textSub, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: C.textSub, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="farmers"
                name="Farmers"
                stroke={C.green}
                strokeWidth={2}
                fill="url(#gFarmer)"
              />
              <Area
                type="monotone"
                dataKey="buyers"
                name="Buyers"
                stroke={C.amber}
                strokeWidth={2}
                fill="url(#gBuyer)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{ background: C.surface2, border: `1px solid ${C.border}` }}
        >
          <div
            className="text-sm font-bold mb-1"
            style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
          >
            User Distribution
          </div>
          <div className="text-xs mb-4" style={{ color: C.textSub }}>
            By role
          </div>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {pieData.map((d) => (
                  <div
                    key={d.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <span
                      className="flex items-center gap-2"
                      style={{ color: C.textSub }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: d.color }}
                      />
                      {d.name}
                    </span>
                    <span className="font-bold" style={{ color: C.text }}>
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div
              className="flex items-center justify-center h-32 text-xs"
              style={{ color: C.textMuted }}
            >
              No data yet
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="rounded-2xl p-5"
          style={{ background: C.surface2, border: `1px solid ${C.border}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className="text-sm font-bold"
              style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
            >
              Recent Registrations
            </div>
            <button
              onClick={() => setActiveTab('users')}
              className="text-xs flex items-center gap-1 transition-colors"
              style={{ color: C.green }}
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center gap-2 py-4">
                <Loader2
                  className="w-4 h-4 animate-spin"
                  style={{ color: C.green }}
                />
                <span className="text-xs" style={{ color: C.textSub }}>
                  Loading…
                </span>
              </div>
            ) : recentUsers.length === 0 ? (
              <div
                className="text-xs text-center py-4"
                style={{ color: C.textMuted }}
              >
                No users yet
              </div>
            ) : (
              recentUsers.map((u) => {
                const role = getRoleKey(u.labels)
                const name = u.name || u.email?.split('@')[0] || 'Unknown'
                return (
                  <div key={u.id} className="flex items-center gap-3">
                    <Avatar name={name} email={u.email} role={role} size={8} />
                    <div className="flex flex-col">
                      <div
                        className="text-sm font-semibold truncate"
                        style={{ color: C.text }}
                      >
                        {name}
                      </div>
                      <div
                        className="text-xs truncate"
                        style={{ color: C.textSub }}
                      >
                        {u.email}
                      </div>
                      <div className="text-[10px] mt-0.5" style={{ color: C.textMuted }}>
                        Joined {formatDate(u.registration)}
                      </div>
                    </div>
                    <RoleBadge role={role} />
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{ background: C.surface2, border: `1px solid ${C.border}` }}
        >
          <div
            className="text-sm font-bold mb-4"
            style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
          >
            Quick Actions
          </div>
          <div className="space-y-2.5">
            {[
              {
                label: 'Manage All Users',
                icon: <Users className="w-4 h-4" />,
                color: C.blue,
                tab: 'users' as TabType,
              },
              {
                label: 'Review Farmer Applications',
                icon: <ArrowUpCircle className="w-4 h-4" />,
                color: C.green,
                tab: 'applications' as TabType,
              },
              {
                label: 'View Analytics',
                icon: <BarChart3 className="w-4 h-4" />,
                color: C.violet,
                tab: 'analytics' as TabType,
              },
              {
                label: 'Platform Settings',
                icon: <Settings className="w-4 h-4" />,
                color: C.amber,
                tab: 'settings' as TabType,
              },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => setActiveTab(a.tab)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all group"
                style={{
                  background: C.surface3,
                  border: `1px solid ${C.border}`,
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    `${a.color}40`
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = C.border
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${a.color}15`, color: a.color }}
                >
                  {a.icon}
                </div>
                <span style={{ color: C.text }}>{a.label}</span>
                <ArrowRight
                  className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: a.color }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: <Activity className="w-5 h-5" />,
            label: 'Platform Status',
            value: 'Online',
            color: C.green,
            sub: 'All systems operational',
          },
          {
            icon: <TrendingUp className="w-5 h-5" />,
            label: 'Farmer / Buyer Ratio',
            value: buyers > 0 ? `${farmers}:${buyers}` : `${farmers}:0`,
            color: C.amber,
            sub: 'Farmers to Buyers',
          },
          {
            icon: <Zap className="w-5 h-5" />,
            label: 'Unassigned Users',
            value: String(unassigned),
            color: unassigned > 0 ? C.red : C.green,
            sub:
              unassigned > 0 ? 'Needs role assignment' : 'All roles assigned',
          },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: C.surface2, border: `1px solid ${C.border}` }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${m.color}18`, color: m.color }}
            >
              {m.icon}
            </div>
            <div>
              <div className="text-xs" style={{ color: C.textSub }}>
                {m.label}
              </div>
              <div
                className="text-lg font-black"
                style={{ color: m.color, fontFamily: "'Syne', sans-serif" }}
              >
                {m.value}
              </div>
              <div className="text-xs" style={{ color: C.textMuted }}>
                {m.sub}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function UsersTab({
  allUsers,
  loading,
  onRole,
  onDelete,
  refetch,
}: {
  allUsers: UserRow[]
  loading: boolean
  onRole: (userId: string, role: UserRole) => void
  onDelete: (userId: string) => void
  refetch: () => void
}) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [viewUser, setViewUser] = useState<UserRow | null>(null)

  const filtered = allUsers.filter((u) => {
    const matchSearch =
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    const matchRole =
      roleFilter === 'all' || getRoleKey(u.labels) === roleFilter
    return matchSearch && matchRole
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2
            className="text-xl font-black"
            style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
          >
            All Users{' '}
            <span
              className="text-sm font-normal ml-2"
              style={{ color: C.textSub }}
            >
              ({filtered.length})
            </span>
          </h2>
          <p className="text-xs mt-0.5" style={{ color: C.textSub }}>
            Manage roles, view profiles, and remove accounts
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={refetch}
            className="p-2 rounded-xl transition-colors"
            title="Refresh"
            style={{
              background: C.surface2,
              color: C.textSub,
              border: `1px solid ${C.border}`,
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.color = C.green
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.color = C.textSub
            }}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <div
            className="flex gap-1 p-1 rounded-xl"
            style={{ background: C.surface2, border: `1px solid ${C.border}` }}
          >
            {[
              { key: 'all', label: 'All' },
              { key: 'farmer', label: 'Farmers' },
              { key: 'buyer', label: 'Buyers' },
              { key: 'admin', label: 'Admins' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setRoleFilter(f.key)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: roleFilter === f.key ? C.surface3 : 'transparent',
                  color: roleFilter === f.key ? C.text : C.textSub,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
              style={{ color: C.textMuted }}
            />
            <input
              type="text"
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none w-44 sm:w-56"
              style={{
                background: C.surface2,
                border: `1px solid ${C.border}`,
                color: C.text,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = `${C.green}60`
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = C.border
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: C.surface2, border: `1px solid ${C.border}` }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <Loader2
              className="w-5 h-5 animate-spin"
              style={{ color: C.green }}
            />
            <span className="text-sm" style={{ color: C.textSub }}>
              Loading users…
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {['User', 'Role', 'Status', 'Joined', 'Actions'].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${i === 1 ? 'hidden sm:table-cell' : i === 2 ? 'hidden md:table-cell' : i === 3 ? 'hidden lg:table-cell' : ''}`}
                        style={{ color: C.textMuted }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <UserRowItem
                    key={user.id}
                    user={user}
                    onView={setViewUser}
                    onRole={onRole}
                    onDelete={onDelete}
                    roleLoading={false}
                  />
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <Users
                  className="w-8 h-8 mx-auto mb-2 opacity-30"
                  style={{ color: C.textMuted }}
                />
                <p className="text-sm" style={{ color: C.textMuted }}>
                  {search ? `No users matching "${search}"` : 'No users found'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {viewUser && (
          <UserDetailModal
            user={viewUser}
            onClose={() => setViewUser(null)}
            onRole={onRole}
            onDelete={onDelete}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ApplicationsTab({
  buyers,
  loading,
  onPromote,
  promoting,
}: {
  buyers: UserRow[]
  loading: boolean
  onPromote: (userId: string) => void
  promoting: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2
            className="text-xl font-black"
            style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
          >
            Farmer Applications
          </h2>
          <p className="text-xs mt-0.5" style={{ color: C.textSub }}>
            Promote eligible buyers to Farmer accounts
          </p>
        </div>
        <a
          href="mailto:harvesthub.helpdesk@gmail.com"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: C.greenGlow,
            color: C.green,
            border: `1px solid ${C.borderGlow}`,
          }}
        >
          <Mail className="w-3.5 h-3.5" />
          Help Desk Email
        </a>
      </div>

      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.03))',
          border: `1px solid ${C.borderGlow}`,
        }}
      >
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
          style={{
            background: C.green,
            opacity: 0.04,
            filter: 'blur(30px)',
            transform: 'translate(20%,-20%)',
          }}
        />
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: C.greenGlow,
              border: `1px solid ${C.borderGlow}`,
            }}
          >
            <ArrowUpCircle className="w-5 h-5" style={{ color: C.green }} />
          </div>
          <div>
            <div className="text-sm font-bold mb-1" style={{ color: C.text }}>
              Promotion Queue
            </div>
            <p className="text-xs leading-relaxed" style={{ color: C.textSub }}>
              After reviewing a farmer's application email, click{' '}
              <strong style={{ color: C.green }}>Promote to Farmer</strong> to
              upgrade their account.
            </p>
          </div>
          <div
            className="ml-auto text-2xl font-black shrink-0"
            style={{ color: C.green, fontFamily: "'Syne', sans-serif" }}
          >
            {buyers.length}
          </div>
        </div>
      </div>

      <div
        className="rounded-2xl p-5"
        style={{ background: C.surface2, border: `1px solid ${C.border}` }}
      >
        <div
          className="text-sm font-bold mb-4"
          style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
        >
          Workflow
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            {
              step: 1,
              text: 'User visits Join as Farmer and submits application',
              icon: <Users className="w-4 h-4" />,
            },
            {
              step: 2,
              text: 'Application email sent to help desk for review',
              icon: <Mail className="w-4 h-4" />,
            },
            {
              step: 3,
              text: 'Admin reviews application and promotes user below',
              icon: <UserCheck className="w-4 h-4" />,
            },
            {
              step: 4,
              text: 'User re-logs in and accesses Farmer Dashboard',
              icon: <CheckCircle className="w-4 h-4" />,
            },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-black"
                style={{
                  background: C.greenGlow,
                  color: C.green,
                  border: `1px solid ${C.borderGlow}`,
                }}
              >
                {s.step}
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: C.textSub }}
              >
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: C.surface2, border: `1px solid ${C.border}` }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          <span
            className="text-sm font-bold"
            style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
          >
            Eligible Buyers
          </span>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{
              background: C.greenGlow,
              color: C.green,
              border: `1px solid ${C.borderGlow}`,
            }}
          >
            {buyers.length} total
          </span>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 p-6">
            <Loader2
              className="w-4 h-4 animate-spin"
              style={{ color: C.green }}
            />
            <span className="text-xs" style={{ color: C.textSub }}>
              Loading…
            </span>
          </div>
        ) : buyers.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle
              className="w-8 h-8 mx-auto mb-2"
              style={{ color: C.green, opacity: 0.5 }}
            />
            <p className="text-sm font-semibold" style={{ color: C.text }}>
              All caught up!
            </p>
            <p className="text-xs mt-1" style={{ color: C.textMuted }}>
              No buyers pending promotion.
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: C.border }}>
            {buyers.map((u, i) => {
              const name = u.name || u.email?.split('@')[0] || 'Unknown'
              return (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <Avatar name={name} email={u.email} role="buyer" size={10} />
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm font-semibold truncate"
                      style={{ color: C.text }}
                    >
                      {name}
                    </div>
                    <div
                      className="text-xs truncate"
                      style={{ color: C.textSub }}
                    >
                      {u.email}
                    </div>
                    <div className="text-xs" style={{ color: C.textMuted }}>
                      Joined {formatDate(u.registration)}
                    </div>
                  </div>
                  <button
                    onClick={() => onPromote(u.id)}
                    disabled={promoting}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 shrink-0"
                    style={{
                      background: 'linear-gradient(135deg,#22c55e,#16a34a)',
                      color: '#fff',
                    }}
                  >
                    {promoting ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <>
                        <Leaf className="w-3 h-3" />
                        Promote
                      </>
                    )}
                  </button>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function AnalyticsTab({
  allUsers,
  farmers,
  buyers,
  admins,
  unassigned,
  loading,
}: {
  allUsers: UserRow[]
  farmers: number
  buyers: number
  admins: number
  unassigned: number
  loading: boolean
}) {
  const barData = (() => {
    const months: Record<string, { month: string; registrations: number }> = {}
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = d.toLocaleString('default', { month: 'short' })
      months[key] = { month: key, registrations: 0 }
    }
    allUsers.forEach((u) => {
      const d = new Date(u.registration)
      const diff =
        (now.getFullYear() - d.getFullYear()) * 12 +
        now.getMonth() -
        d.getMonth()
      if (diff >= 0 && diff <= 5) {
        const key = d.toLocaleString('default', { month: 'short' })
        if (months[key]) months[key].registrations++
      }
    })
    return Object.values(months)
  })()

  const activeCount = allUsers.filter((u) => u.status).length
  const inactiveCount = allUsers.length - activeCount
  const metrics = [
    { label: 'Total Users', value: allUsers.length, color: C.blue },
    { label: 'Active', value: activeCount, color: C.green },
    { label: 'Inactive', value: inactiveCount, color: C.red },
    { label: 'Unassigned', value: unassigned, color: C.amber },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div>
        <h2
          className="text-xl font-black"
          style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
        >
          Analytics
        </h2>
        <p className="text-xs mt-0.5" style={{ color: C.textSub }}>
          Platform-wide metrics and trends
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-2xl p-4 text-center"
            style={{ background: C.surface2, border: `1px solid ${C.border}` }}
          >
            <div
              className="text-3xl font-black mb-1"
              style={{ color: m.color, fontFamily: "'Syne', sans-serif" }}
            >
              {loading ? '…' : <AnimatedNumber value={m.value} />}
            </div>
            <div className="text-xs" style={{ color: C.textSub }}>
              {m.label}
            </div>
            <div
              className="mt-2 h-1 rounded-full overflow-hidden"
              style={{ background: C.surface3 }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${allUsers.length ? (m.value / allUsers.length) * 100 : 0}%`,
                  background: m.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl p-5"
        style={{ background: C.surface2, border: `1px solid ${C.border}` }}
      >
        <div
          className="text-sm font-bold mb-1"
          style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
        >
          Monthly Registrations
        </div>
        <div className="text-xs mb-5" style={{ color: C.textSub }}>
          New users per month over the last 6 months
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} barSize={28}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.green} stopOpacity={0.9} />
                <stop offset="100%" stopColor={C.greenDark} stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis
              dataKey="month"
              tick={{ fill: C.textSub, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: C.textSub, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar
              dataKey="registrations"
              name="Registrations"
              fill="url(#barGrad)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Farmers',
            value: farmers,
            total: allUsers.length,
            color: C.green,
            icon: <Leaf className="w-5 h-5" />,
          },
          {
            label: 'Buyers',
            value: buyers,
            total: allUsers.length,
            color: C.amber,
            icon: <ShoppingCart className="w-5 h-5" />,
          },
          {
            label: 'Admins',
            value: admins,
            total: allUsers.length,
            color: C.violet,
            icon: <Shield className="w-5 h-5" />,
          },
        ].map((r) => {
          const pct = r.total > 0 ? Math.round((r.value / r.total) * 100) : 0
          return (
            <div
              key={r.label}
              className="rounded-2xl p-5"
              style={{
                background: C.surface2,
                border: `1px solid ${C.border}`,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${r.color}18`, color: r.color }}
                >
                  {r.icon}
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: C.text }}>
                    {r.label}
                  </div>
                  <div className="text-xs" style={{ color: r.color }}>
                    {r.value} users
                  </div>
                </div>
                <div
                  className="ml-auto text-2xl font-black"
                  style={{ color: r.color, fontFamily: "'Syne', sans-serif" }}
                >
                  {pct}%
                </div>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: C.surface3 }}
              >
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{ background: r.color }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div
        className="rounded-2xl p-5"
        style={{ background: C.surface2, border: `1px solid ${C.border}` }}
      >
        <div
          className="text-sm font-bold mb-4"
          style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
        >
          Account Health
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Active Accounts', value: activeCount, color: C.green },
            { label: 'Inactive Accounts', value: inactiveCount, color: C.red },
          ].map((h) => (
            <div key={h.label}>
              <div className="flex justify-between mb-2">
                <span className="text-xs" style={{ color: C.textSub }}>
                  {h.label}
                </span>
                <span className="text-xs font-bold" style={{ color: h.color }}>
                  {h.value} (
                  {allUsers.length
                    ? Math.round((h.value / allUsers.length) * 100)
                    : 0}
                  %)
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: C.surface3 }}
              >
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${allUsers.length ? (h.value / allUsers.length) * 100 : 0}%`,
                  }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{ background: h.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function SettingsTab({
  displayName,
  email,
  handleSignOut,
}: {
  displayName: string
  email: string
  handleSignOut: () => void
}) {
  const policies = [
    'All new users are registered as Buyers by default',
    'Only Admins can promote Buyers to Farmers',
    'Admin accounts are protected from modification',
    'Farmer applications are reviewed via email',
    'Users must re-login after role changes to get updated access',
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 max-w-2xl"
    >
      <div>
        <h2
          className="text-xl font-black"
          style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
        >
          Platform Settings
        </h2>
        <p className="text-xs mt-0.5" style={{ color: C.textSub }}>
          Configuration and policies for HarvestHub
        </p>
      </div>

      <div
        className="rounded-2xl p-5"
        style={{ background: C.surface2, border: `1px solid ${C.border}` }}
      >
        <div
          className="text-sm font-bold mb-4"
          style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
        >
          Admin Account
        </div>
        <div
          className="flex items-center gap-4 mb-5 p-4 rounded-xl"
          style={{ background: C.surface3, border: `1px solid ${C.border}` }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-base font-black"
            style={{
              background: C.violetGlow,
              color: C.violet,
              border: '1px solid rgba(167,139,250,0.3)',
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {getInitials(displayName, email)}
          </div>
          <div>
            <div className="text-base font-bold" style={{ color: C.text }}>
              {displayName}
            </div>
            <div className="text-xs" style={{ color: C.textSub }}>
              {email}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Shield className="w-3 h-3" style={{ color: C.violet }} />
              <span
                className="text-xs font-semibold"
                style={{ color: C.violet }}
              >
                Platform Administrator
              </span>
            </div>
          </div>
        </div>
        {[
          { label: 'Display Name', value: displayName },
          { label: 'Email Address', value: email },
          { label: 'Account Type', value: '🛡️ Platform Administrator' },
        ].map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between py-3"
            style={{ borderBottom: `1px solid ${C.border}` }}
          >
            <span className="text-xs" style={{ color: C.textSub }}>
              {row.label}
            </span>
            <span className="text-xs font-medium" style={{ color: C.text }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl p-5"
        style={{ background: C.surface2, border: `1px solid ${C.border}` }}
      >
        <div
          className="text-sm font-bold mb-4"
          style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
        >
          Platform Contacts
        </div>
        <div
          className="flex items-center justify-between p-3 rounded-xl"
          style={{ background: C.surface3, border: `1px solid ${C.border}` }}
        >
          <div>
            <div className="text-xs font-semibold" style={{ color: C.text }}>
              Help Desk
            </div>
            <div className="text-xs" style={{ color: C.textSub }}>
              Primary support & application reviews
            </div>
          </div>
          <a
            href="mailto:harvesthub.helpdesk@gmail.com"
            className="text-xs font-semibold transition-colors"
            style={{ color: C.green }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.textDecoration =
                'underline'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.textDecoration = 'none'
            }}
          >
            harvesthub.helpdesk@gmail.com
          </a>
        </div>
      </div>

      <div
        className="rounded-2xl p-5"
        style={{ background: C.surface2, border: `1px solid ${C.border}` }}
      >
        <div
          className="text-sm font-bold mb-4"
          style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
        >
          Platform Policies
        </div>
        <div className="space-y-3">
          {policies.map((p, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold"
                style={{
                  background: C.greenGlow,
                  color: C.green,
                  border: `1px solid ${C.borderGlow}`,
                }}
              >
                {i + 1}
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: C.textSub }}
              >
                {p}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-2xl p-5"
        style={{ background: C.surface2, border: `1px solid ${C.border}` }}
      >
        <div
          className="text-sm font-bold mb-4"
          style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
        >
          Quick Links
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            {
              label: 'View Join Farmer Form',
              href: '/join-farmer',
              color: C.green,
            },
            { label: 'Go to Homepage', href: '/', color: C.blue },
          ].map((l) => (
            <Link
              key={l.href}
              to={l.href as '/join-farmer' | '/'}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: C.surface3,
                color: l.color,
                border: `1px solid ${C.border}`,
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor =
                  `${l.color}40`
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = C.border
              }}
            >
              <ArrowRight className="w-4 h-4" />
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      <div
        className="rounded-2xl p-5"
        style={{
          background: C.surface2,
          border: '1px solid rgba(248,113,113,0.2)',
        }}
      >
        <div
          className="text-sm font-bold mb-1"
          style={{ color: C.red, fontFamily: "'Syne', sans-serif" }}
        >
          Danger Zone
        </div>
        <p className="text-xs mb-4" style={{ color: C.textSub }}>
          Signing out will end your current admin session.
        </p>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: C.redGlow,
            color: C.red,
            border: '1px solid rgba(248,113,113,0.25)',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.background =
              'rgba(248,113,113,0.18)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.background = C.redGlow
          }}
        >
          <LogOut className="w-4 h-4" /> Sign Out of Admin Account
        </button>
      </div>
    </motion.div>
  )
}

export function AdminDashboard() {
  const { currentUser, signOut } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const listUsers = useServerFn(listAllUsersFn)
  const updateRole = useServerFn(updateUserRoleFn)
  const deleteUser = useServerFn(deleteUserFn)
  const getStats = useServerFn(getPlatformStatsFn)

  const displayName =
    currentUser?.name || currentUser?.email?.split('@')[0] || 'Admin'
  const initials = getInitials(displayName, currentUser?.email)

  const {
    data: usersData,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => listUsers(),
    refetchInterval: 30000,
  })

  const {
    data: platformStats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => getStats(),
    refetchInterval: 30000,
  })

  const refetch = () => {
    void refetchUsers()
    void refetchStats()
  }

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) => {
      // @ts-expect-error - TanStack inferring undefined for data due to missing validator
      return updateRole({ data: { userId, role } })
    },
    onSuccess: () => {
      toast.success('Role updated successfully')
      void qc.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => toast.error('Failed to update role'),
  })

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => {
      // @ts-expect-error - TanStack inferring undefined for data due to missing validator
      return deleteUser({ data: { userId } })
    },
    onSuccess: () => {
      toast.success('User deleted')
      void qc.invalidateQueries({ queryKey: ['admin-users'] })
      setConfirmDelete(null)
    },
    onError: () => toast.error('Failed to delete user'),
  })

  const handleSignOut = async () => {
    await signOut()
    await navigate({ to: '/' })
  }

  const allUsers: UserRow[] = usersData?.users ?? []
  const farmers = allUsers.filter((u) => u.labels.includes('farmer')).length
  const buyers = allUsers.filter((u) => u.labels.includes('buyer')).length
  const admins = allUsers.filter((u) => u.labels.includes('admin')).length
  const unassigned = allUsers.filter((u) => u.labels.length === 0).length
  const buyersList = allUsers.filter((u) => u.labels.includes('buyer'))

  const NAV_ITEMS: {
    id: TabType
    icon: React.ReactNode
    label: string
    badge?: number
  }[] = [
    { id: 'overview', icon: <Home className="w-4 h-4" />, label: 'Overview' },
    {
      id: 'users',
      icon: <Users className="w-4 h-4" />,
      label: 'Users',
      badge: allUsers.length,
    },
    {
      id: 'applications',
      icon: <ArrowUpCircle className="w-4 h-4" />,
      label: 'Applications',
      badge: buyersList.length,
    },
    {
      id: 'analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      label: 'Analytics',
    },
    {
      id: 'settings',
      icon: <Settings className="w-4 h-4" />,
      label: 'Settings',
    },
  ]

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setSidebarOpen(false)
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: C.bg, fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap');`}</style>
      <div className="flex h-screen overflow-hidden">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(4px)',
              }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col lg:hidden"
              style={{
                background: C.surface,
                borderRight: `1px solid ${C.border}`,
              }}
            >
              <SidebarContent
                displayName={displayName}
                initials={initials}
                activeTab={activeTab}
                navItems={NAV_ITEMS}
                onTabChange={handleTabChange}
                onSignOut={handleSignOut}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        <aside
          className="w-60 shrink-0 hidden lg:flex flex-col"
          style={{
            background: C.surface,
            borderRight: `1px solid ${C.border}`,
          }}
        >
          <SidebarContent
            displayName={displayName}
            initials={initials}
            activeTab={activeTab}
            navItems={NAV_ITEMS}
            onTabChange={handleTabChange}
            onSignOut={handleSignOut}
          />
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header
            className="h-14 shrink-0 flex items-center justify-between px-4 sm:px-6"
            style={{
              background: C.surface,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl transition-colors"
                style={{
                  background: C.surface2,
                  color: C.textSub,
                  border: `1px solid ${C.border}`,
                }}
              >
                <Menu className="w-4 h-4" />
              </button>
              <div>
                <h1
                  className="text-sm font-black leading-none"
                  style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
                >
                  {NAV_ITEMS.find((n) => n.id === activeTab)?.label ??
                    'Dashboard'}
                </h1>
                <p className="text-xs mt-0.5" style={{ color: C.textSub }}>
                  HarvestHub Admin
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => void refetch()}
                className="p-2 rounded-xl transition-all"
                style={{
                  background: C.surface2,
                  color: C.textSub,
                  border: `1px solid ${C.border}`,
                }}
                title="Refresh data"
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color = C.green
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color = C.textSub
                }}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                className="relative p-2 rounded-xl transition-all"
                style={{
                  background: C.surface2,
                  color: C.textSub,
                  border: `1px solid ${C.border}`,
                }}
                title="Notifications"
                onClick={() => setActiveTab('users')}
              >
                <Bell className="w-3.5 h-3.5" />
                {unassigned > 0 && (
                  <span
                    className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                    style={{ background: C.red }}
                  />
                )}
              </button>
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{
                  background: C.surface2,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                  style={{
                    background: C.violetGlow,
                    color: C.violet,
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  {initials}
                </div>
                <span
                  className="text-xs font-medium hidden sm:block"
                  style={{ color: C.text }}
                >
                  {displayName}
                </span>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <OverviewTab
                  key="overview"
                  allUsers={allUsers}
                  farmers={farmers}
                  buyers={buyers}
                  admins={admins}
                  unassigned={unassigned}
                  listings={platformStats?.listings ?? 0}
                  orders={platformStats?.orders ?? 0}
                  loading={usersLoading || statsLoading}
                  setActiveTab={setActiveTab}
                />
              )}
              {activeTab === 'users' && (
                <UsersTab
                  key="users"
                  allUsers={allUsers}
                  loading={usersLoading}
                  onRole={(uid, r) =>
                    updateRoleMutation.mutate({ userId: uid, role: r })
                  }
                  onDelete={(uid) => setConfirmDelete(uid)}
                  refetch={() => void refetch()}
                />
              )}
              {activeTab === 'applications' && (
                <ApplicationsTab
                  key="applications"
                  buyers={buyersList}
                  loading={usersLoading}
                  onPromote={(uid) =>
                    updateRoleMutation.mutate({ userId: uid, role: 'farmer' })
                  }
                  promoting={updateRoleMutation.isPending}
                />
              )}
              {activeTab === 'analytics' && (
                <AnalyticsTab
                  key="analytics"
                  allUsers={allUsers}
                  farmers={farmers}
                  buyers={buyers}
                  admins={admins}
                  unassigned={unassigned}
                  loading={usersLoading}
                />
              )}
              {activeTab === 'settings' && (
                <SettingsTab
                  key="settings"
                  displayName={displayName}
                  email={currentUser?.email ?? ''}
                  handleSignOut={handleSignOut}
                />
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {confirmDelete && (
          <DeleteModal
            onConfirm={() => deleteMutation.mutate(confirmDelete)}
            onCancel={() => setConfirmDelete(null)}
            loading={deleteMutation.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function SidebarContent({
  displayName,
  initials,
  activeTab,
  navItems,
  onTabChange,
  onSignOut,
}: {
  displayName: string
  initials: string
  activeTab: TabType
  navItems: {
    id: TabType
    icon: React.ReactNode
    label: string
    badge?: number
  }[]
  onTabChange: (t: TabType) => void
  onSignOut: () => void
}) {
  return (
    <>
      <Link
        to="/"
        className="h-14 flex items-center gap-2.5 px-4 shrink-0 transition-colors group"
        style={{ borderBottom: `1px solid ${C.border}` }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.background = C.surface2
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.background = 'transparent'
        }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg,#d97706,#92400e)' }}
        >
          <Sprout className="w-4 h-4 text-white" />
        </div>
        <div>
          <div
            className="text-sm font-black leading-none"
            style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
          >
            Harvest<span style={{ color: '#f59e0b' }}>Hub</span>
          </div>
          <div className="text-xs" style={{ color: C.textMuted }}>
            Admin Console
          </div>
        </div>
      </Link>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div
          className="text-xs font-semibold uppercase tracking-wider px-3 mb-3"
          style={{ color: C.textMuted }}
        >
          Navigation
        </div>
        {navItems.map((item) => {
          const active = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm"
              style={{
                background: active ? `${C.green}12` : 'transparent',
                color: active ? C.green : C.textSub,
                border: active
                  ? `1px solid ${C.green}25`
                  : '1px solid transparent',
                fontWeight: active ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (!active)
                  (e.currentTarget as HTMLElement).style.background = C.surface2
              }}
              onMouseLeave={(e) => {
                if (!active)
                  (e.currentTarget as HTMLElement).style.background =
                    'transparent'
              }}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: active ? `${C.green}25` : C.surface3,
                    color: active ? C.green : C.textMuted,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div
        className="px-3 py-4 shrink-0"
        style={{ borderTop: `1px solid ${C.border}` }}
      >
        <div
          className="flex items-center gap-3 px-3 py-3 rounded-xl mb-2"
          style={{ background: C.surface2, border: `1px solid ${C.border}` }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0"
            style={{
              background: C.violetGlow,
              color: C.violet,
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div
              className="text-xs font-semibold truncate"
              style={{ color: C.text }}
            >
              {displayName}
            </div>
            <div className="text-xs truncate" style={{ color: C.violet }}>
              🛡️ Administrator
            </div>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all"
          style={{ color: C.red }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.background =
              'rgba(248,113,113,0.08)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.background = 'transparent'
          }}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </>
  )
}
