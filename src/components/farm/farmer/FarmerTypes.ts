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
  qty: string
  total: string
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
  bg: '#050e05',
  navBg: '#070e07',
  surface: '#0b180b',
  surface2: '#0f1f0f',
  surface3: '#131f13',
  border: 'rgba(38,70,38,0.5)',
  border2: 'rgba(55,95,55,0.35)',
  text: '#eef5ee',
  muted: '#688568',
  green: '#4ade80',
  green2: '#22c55e',
  gold: '#f0b429',
  amber: '#f59e0b',
  blue: '#60a5fa',
  purple: '#a78bfa',
  red: '#f87171',
  teal: '#2dd4bf',
} as const

export const ORDER_STATUS: Record<
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

export const LISTING_STATUS: Record<
  ListingStatus,
  { color: string; bg: string; label: string }
> = {
  active: { color: '#4ade80', bg: 'rgba(74,222,128,0.12)', label: 'Active' },
  low: { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', label: 'Low Stock' },
  sold_out: {
    color: '#f87171',
    bg: 'rgba(248,113,113,0.12)',
    label: 'Sold Out',
  },
  paused: { color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', label: 'Paused' },
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
      trend[m] += parseFloat(o.total.replace(/[₹]/, ''))
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
