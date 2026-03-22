// Shared Types & Constants

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'dispatched'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  id: string
  product: string
  farmer: string
  qty: string
  total: string
  status: OrderStatus
  date: string
  emoji: string
  rating?: number
  category: string
  estimatedDelivery?: string
}

export interface SavedItem {
  id: string
  name: string
  farmer: string
  price: string
  unit: string
  emoji: string
  practice: string
  location: string
  category: string
  inStock: boolean
  rating: number
  reviews: number
}

export interface FarmerProfile {
  id: string
  name: string
  location: string
  specialty: string
  emoji: string
  rating: number
  reviews: number
  distance: string
  badge: string
  products: string[]
}

export interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'order' | 'promo' | 'system'
}

export const C = {
  bg: 'var(--fd-bg)',
  navBg: 'var(--fd-nav-bg)',
  surface: 'var(--fd-surface)',
  surface2: 'var(--fd-surface-2)',
  border: 'var(--fd-border)',
  border2: 'var(--fd-border-mid)',
  text: 'var(--fd-text)',
  muted: 'var(--fd-text-muted)',
  green: 'var(--fd-green)',
  greenLight: 'var(--fd-green-light)',
  greenDark: 'var(--fd-green-dark)',
  gold: 'var(--fd-gold)',
  amber: 'var(--fd-gold-light)',
  blue: 'var(--fd-blue)',
  purple: 'var(--fd-purple)',
  red: 'var(--fd-red)',
  hover: 'var(--fd-hover-bg)',
  active: 'var(--fd-active-bg)',
} as const

export const STATUS_CONFIG: Record<
  OrderStatus,
  { color: string; bg: string; label: string; icon: string }
> = {
  pending: {
    color: 'var(--fd-gold)',
    bg: 'var(--fd-gold-bg)',
    label: 'Pending',
    icon: '⏳',
  },
  confirmed: {
    color: 'var(--fd-blue)',
    bg: 'var(--fd-blue-bg)',
    label: 'Confirmed',
    icon: '✅',
  },
  dispatched: {
    color: 'var(--fd-purple)',
    bg: 'var(--fd-purple-bg)',
    label: 'Dispatched',
    icon: '🚚',
  },
  delivered: {
    color: 'var(--fd-green)',
    bg: 'var(--fd-green-bg)',
    label: 'Delivered',
    icon: '📦',
  },
  cancelled: {
    color: 'var(--fd-red)',
    bg: 'var(--fd-red-bg)',
    label: 'Cancelled',
    icon: '❌',
  },
}


export const getSpendingTrend = (orders: OrderItem[]) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const trend: Record<string, number> = {}
  
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    trend[months[d.getMonth()]] = 0
  }

  orders.filter(o => o.status === 'delivered').forEach(o => {
    const d = new Date(o.date)
    const m = months[d.getMonth()]
    if (trend[m] !== undefined) {
      trend[m] += parseFloat(o.total.replace(/[₹$]/, ''))
    }
  })

  return Object.entries(trend).map(([month, amount]) => ({ month, amount }))
}

export const getCategoryStats = (orders: OrderItem[]) => {
  const stats: Record<string, number> = {}
  orders.forEach(o => {
    stats[o.category] = (stats[o.category] || 0) + 1
  })
  
  const total = Object.values(stats).reduce((a, b) => a + b, 0)
  if (total === 0) return []

  const colors: Record<string, string> = {
    Vegetables: '#4ade80',
    Fruits: '#f87171',
    Grains: '#fbbf24',
    Dairy: '#60a5fa',
    Other: '#a78bfa'
  }

  return Object.entries(stats).map(([name, val]) => ({
    name,
    value: Math.round((val / total) * 100),
    color: colors[name] || '#94a3b8'
  }))
}
