import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Filter,
  ChevronDown,
  Search,
  RotateCcw,
  Star,
  XCircle,
} from 'lucide-react'
import {
  C,
  STATUS_CONFIG,
  type OrderItem,
  type OrderStatus,
} from './BuyerTypes'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import { getBuyerOrdersFn } from '@/server/functions/orders'
import { Loader2 } from 'lucide-react'

type FilterVal = OrderStatus | 'all'

const FILTER_OPTIONS: { label: string; value: FilterVal }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Dispatched', value: 'dispatched' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
]

function TrackingTimeline({ status }: { status: OrderStatus }) {
  const steps: OrderStatus[] = [
    'pending',
    'confirmed',
    'dispatched',
    'delivered',
  ]
  const currentIndex = steps.indexOf(status)
  if (status === 'cancelled')
    return (
      <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: C.red }}
        >
          <XCircle className="w-4 h-4" />
          This order was cancelled
        </div>
      </div>
    )

  return (
    <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
      <p className="text-xs mb-3" style={{ color: C.muted }}>
        Order Progress
      </p>
      <div className="flex items-center justify-between relative">
        <div
          className="absolute top-3 left-0 right-0 h-0.5"
          style={{ background: C.border }}
        />
        <div
          className="absolute top-3 left-0 h-0.5 transition-all duration-700"
          style={{
            background: `linear-gradient(90deg, ${C.green}, ${C.greenLight || C.green})`,
            width: `${(currentIndex / (steps.length - 1)) * 100}%`,
          }}
        />
        {steps.map((step, i) => {
          const done = i <= currentIndex
          const sc = STATUS_CONFIG[step]
          return (
            <div
              key={step}
              className="flex flex-col items-center gap-1.5 relative z-10"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300"
                style={{
                  background: done ? C.green : C.surface2,
                  border: done ? 'none' : `1px solid ${C.border}`,
                  color: done ? '#051005' : C.muted,
                }}
              >
                {done ? '✓' : i + 1}
              </div>
              <span
                className="text-[9px] capitalize font-medium"
                style={{ color: done ? C.green : C.muted }}
              >
                {sc.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function OrderCard({ order, index }: { order: OrderItem; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const sc = STATUS_CONFIG[order.status]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}
    >
      <div
        className="p-5 cursor-pointer transition-colors"
        style={{ background: 'transparent' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = C.hover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: C.surface2, border: `1px solid ${C.border}` }}
          >
            {order.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-xs font-mono font-bold"
                style={{ color: C.muted }}
              >
                {order.id}
              </span>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: sc.bg,
                  color: sc.color,
                  border: `1px solid color-mix(in srgb, ${sc.color}, transparent 80%)`,
                }}
              >
                {sc.icon} {sc.label}
              </span>
            </div>
            <div className="text-sm font-bold mt-1" style={{ color: C.text }}>
              {order.product}
            </div>
            <div className="text-xs mt-0.5" style={{ color: C.muted }}>
              {order.farmer} · {order.qty} · {order.date}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-lg font-bold" style={{ color: C.gold }}>
              ₹{parseFloat(String(order.total).replace(/[₹$]/, '')).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: C.muted }}>
              ₹{(parseFloat(String(order.total).replace(/[₹$]/, '')) / parseFloat(String(order.qty))).toFixed(2)}/item
            </div>
            <ChevronDown
              className="w-4 h-4 transition-transform duration-300"
              style={{
                color: C.muted,
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="px-5 pb-5"
              style={{ borderTop: `1px solid ${C.border}` }}
            >
              <TrackingTimeline status={order.status} />

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div
                  className="p-3 rounded-xl"
                  style={{ background: C.surface2 }}
                >
                  <div className="text-xs" style={{ color: C.muted }}>
                    Category
                  </div>
                  <div
                    className="text-sm font-semibold mt-0.5"
                    style={{ color: C.text }}
                  >
                    {order.category}
                  </div>
                </div>
                <div
                  className="p-3 rounded-xl"
                  style={{ background: C.surface2 }}
                >
                  <div className="text-xs" style={{ color: C.muted }}>
                    Est. Delivery
                  </div>
                  <div
                    className="text-sm font-semibold mt-0.5"
                    style={{ color: C.text }}
                  >
                    {order.estimatedDelivery ?? '—'}
                  </div>
                </div>
              </div>

              {order.status === 'delivered' && (
                <div className="mt-3">
                  <div className="text-xs mb-2" style={{ color: C.muted }}>
                    Your Rating
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 cursor-pointer transition-transform hover:scale-125"
                        fill={i < (order.rating ?? 0) ? C.gold : 'transparent'}
                        style={{ color: C.gold }}
                        onClick={() => toast.success('Rating saved!')}
                      />
                    ))}
                    {order.rating && (
                      <span className="text-xs ml-1" style={{ color: C.muted }}>
                        ({order.rating}/5)
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-4 flex-wrap">
                {order.status === 'delivered' && (
                  <button
                    onClick={() => toast.success('Reorder placed!')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105"
                    style={{
                      background: `color-mix(in srgb, ${C.green}, transparent 88%)`,
                      color: C.green,
                      border: `1px solid color-mix(in srgb, ${C.green}, transparent 70%)`,
                    }}
                  >
                    <RotateCcw className="w-3 h-3" /> Reorder
                  </button>
                )}
                {['pending', 'confirmed'].includes(order.status) && (
                  <button
                    onClick={() => toast.error('Cancellation requested')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105"
                    style={{
                      background: `color-mix(in srgb, ${C.red}, transparent 90%)`,
                      color: C.red,
                      border: `1px solid color-mix(in srgb, ${C.red}, transparent 75%)`,
                    }}
                  >
                    <XCircle className="w-3 h-3" /> Cancel
                  </button>
                )}
                <button
                  onClick={() => toast.info('Support contacted')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105"
                  style={{
                    background: `color-mix(in srgb, ${C.blue}, transparent 90%)`,
                    color: C.blue,
                    border: `1px solid color-mix(in srgb, ${C.blue}, transparent 75%)`,
                  }}
                >
                  Help
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function BuyerOrdersTab() {
  const [filter, setFilter] = useState<FilterVal>('all')
  const [search, setSearch] = useState('')
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['buyerOrders'],
    queryFn: () => getBuyerOrdersFn()
  })

  // Map backend orders to UI OrderItem
  const mappedOrders: OrderItem[] = (orders as any[]).map(o => ({
    id: o.id.slice(0, 8).toUpperCase(),
    product: o.listingName || 'Fresh Produce',
    farmer: o.farmerName || 'Local Farmer',
    qty: `${o.qty} units`,
    total: `₹${o.total}`,
    status: o.status === 'shipped' ? 'dispatched' : (o.status as OrderStatus),
    date: new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    emoji: o.emoji || '📦',
    category: o.category || 'Vegetables',
    rating: o.rating
  }))

  const filtered = mappedOrders.filter((o) => {
    const matchStatus = filter === 'all' || o.status === filter
    const matchSearch =
      o.product.toLowerCase().includes(search.toLowerCase()) ||
      o.farmer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const counts: Record<string, number> = {}
  FILTER_OPTIONS.forEach((opt) => {
    counts[opt.value] =
      opt.value === 'all'
        ? mappedOrders.length
        : mappedOrders.filter((o) => o.status === opt.value).length
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3" style={{ color: C.muted }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.green }} />
        <p className="text-sm">Fetching your orders…</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2
          className="font-bold"
          style={{
            color: C.text,
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
          }}
        >
          My Orders
          <span className="text-sm font-normal ml-2" style={{ color: C.muted }}>
            ({orders.length})
          </span>
        </h2>
        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: C.muted }}
        >
          <Filter className="w-3.5 h-3.5" />
          {filter !== 'all' ? `Filtered: ${filter}` : 'All orders'}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: C.muted }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product, farmer, or order ID…"
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            color: C.text,
          }}
        />
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: filter === opt.value ? `color-mix(in srgb, ${C.green}, transparent 88%)` : C.surface2,
              color: filter === opt.value ? C.green : C.muted,
              border:
                filter === opt.value
                  ? `1px solid color-mix(in srgb, ${C.green}, transparent 75%)`
                  : `1px solid ${C.border}`,
            }}
          >
            {opt.value !== 'all' &&
              STATUS_CONFIG[opt.value as OrderStatus].icon}
            {opt.label}
            {counts[opt.value] > 0 && (
              <span
                className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                style={{
                  background:
                    filter === opt.value
                      ? `color-mix(in srgb, ${C.green}, transparent 82%)`
                      : `color-mix(in srgb, ${C.text}, transparent 94%)`,
                  color: filter === opt.value ? C.green : C.muted,
                }}
              >
                {counts[opt.value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Order Cards */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="text-5xl mb-4">📦</div>
            <h3
              className="text-base font-bold mb-2"
              style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
            >
              No orders found
            </h3>
            <p className="text-sm" style={{ color: C.muted }}>
              Try adjusting your filter or search term.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order, i) => (
              <OrderCard key={order.id} order={order} index={i} />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
