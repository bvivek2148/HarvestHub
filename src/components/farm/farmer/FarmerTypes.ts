// Shared Types & Constants for Farmer Dashboard

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'dispatched'
  | 'delivered'
  | 'cancelled'

export type ListingStatus = 'active' | 'low' | 'sold_out' | 'paused'

export interface Listing {
  id: string
  name: string
  emoji: string
  price: string
  priceUnit: string
  stock: string
  stockUnit: string
  status: ListingStatus
  category: string
  imageUrl?: string
  orders: number
  freshness: string
  practice: string
  delivery: string
  description: string
  views?: number
  revenue?: number
}

export interface Order {
  id: string
  buyer: string
  product: string
  qty: string | number
  total: string | number
  status: OrderStatus
  date: string
  emoji: string
  address?: string
  notes?: string
}

export interface Message {
  id: string
  buyer: string
  product: string
  lastMsg: string
  time: string
  unread: number
  emoji: string
  online?: boolean
}

export interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'order' | 'review' | 'system' | 'promo'
}

// Design tokens
export const C = {
  bg: 'var(--fd-bg)',
  navBg: 'var(--fd-nav-bg)',
  surface: 'var(--fd-surface)',
  surface2: 'var(--fd-surface-2)',
  surface3: 'var(--fd-bg-3)',
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
  teal: '#2dd4bf',
  hover: 'var(--fd-hover-bg)',
  active: 'var(--fd-active-bg)',
} as const

export const ORDER_STATUS: Record<
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

export const LISTING_STATUS: Record<
  ListingStatus,
  { color: string; bg: string; label: string }
> = {
  active: {
    color: 'var(--fd-green)',
    bg: 'var(--fd-green-bg)',
    label: 'Active',
  },
  low: {
    color: 'var(--fd-gold)',
    bg: 'var(--fd-gold-bg)',
    label: 'Low Stock',
  },
  sold_out: {
    color: 'var(--fd-red)',
    bg: 'var(--fd-red-bg)',
    label: 'Sold Out',
  },
  paused: {
    color: 'var(--fd-text-muted)',
    bg: 'var(--fd-hover-bg)',
    label: 'Paused',
  },
}


export const getRevenueTrend = (orders: Order[]) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const trend: Record<string, number> = {}
  
  // Initialize last 6 months
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    trend[months[d.getMonth()]] = 0
  }

  orders.filter(o => o.status === 'delivered').forEach(o => {
    const d = new Date(o.date)
    const m = months[d.getMonth()]
    if (trend[m] !== undefined) {
      trend[m] += parseFloat(String(o.total).replace(/[₹]/, '') || '0')
    }
  })

  return Object.entries(trend).map(([month, revenue]) => ({ month, revenue }))
}

export const getCategoryStats = (listings: Listing[]) => {
  const stats: Record<string, number> = {}
  listings.forEach(l => {
    stats[l.category] = (stats[l.category] || 0) + (l.orders || 0)
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
