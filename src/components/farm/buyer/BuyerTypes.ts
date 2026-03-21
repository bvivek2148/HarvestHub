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
  bg: '#060f06',
  navBg: '#080f08',
  surface: '#0c1a0c',
  surface2: '#101f10',
  border: 'rgba(40,72,40,0.45)',
  border2: 'rgba(60,100,60,0.3)',
  text: '#eef4ee',
  muted: '#6b8f6b',
  green: '#4ade80',
  green2: '#22c55e',
  gold: '#f0b429',
  amber: '#f59e0b',
  blue: '#60a5fa',
  purple: '#a78bfa',
  red: '#f87171',
} as const

export const STATUS_CONFIG: Record<
  OrderStatus,
  { color: string; bg: string; label: string; icon: string }
> = {
  pending: {
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.12)',
    label: 'Pending',
    icon: '⏳',
  },
  confirmed: {
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.12)',
    label: 'Confirmed',
    icon: '✅',
  },
  dispatched: {
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.12)',
    label: 'Dispatched',
    icon: '🚚',
  },
  delivered: {
    color: '#4ade80',
    bg: 'rgba(74,222,128,0.12)',
    label: 'Delivered',
    icon: '📦',
  },
  cancelled: {
    color: '#f87171',
    bg: 'rgba(248,113,113,0.12)',
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
