import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  CheckCircle,
  X,
  MapPin,
  StickyNote,
  Package,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { C, ORDER_STATUS, type Order, type OrderStatus } from './FarmerTypes'

const STATUS_STEPS: OrderStatus[] = [
  'pending',
  'confirmed',
  'dispatched',
  'delivered',
]

function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
}: {
  order: Order
  onClose: () => void
  onUpdateStatus: (id: string, status: OrderStatus) => void
}) {
  const sc = ORDER_STATUS[order.status]
  const stepIdx = STATUS_STEPS.indexOf(order.status)
  const nextStatus =
    order.status !== 'delivered' && order.status !== 'cancelled'
      ? STATUS_STEPS[stepIdx + 1]
      : null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="rounded-2xl w-full max-w-md overflow-hidden"
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
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
              Order Details
            </div>
            <div
              className="text-base font-bold"
              style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
            >
              {order.id}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: sc.bg, color: sc.color }}
            >
              {sc.icon} {sc.label}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg"
              style={{ color: C.muted }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: C.surface2, border: `1px solid ${C.border}` }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
              style={{
                background: `color-mix(in srgb, ${C.green}, transparent 88%)`,
                color: C.green,
                fontFamily: "'Syne', sans-serif",
              }}
            >
              {String(order.buyer || 'Buyer')
                .split(' ')
                .map((w) => w[0])
                .join('')
                .toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold" style={{ color: C.text }}>
                {order.buyer}
              </div>
              <div className="text-xs mt-0.5" style={{ color: C.muted }}>
                {order.date}
              </div>
            </div>
            <div className="text-xl">{order.emoji}</div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `color-mix(in srgb, ${C.green}, transparent 92%)`, color: C.green }}
              >
                <Package className="w-4 h-4" />
              </div>
              <div>
                <div
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: C.muted }}
                >
                  Product
                </div>
                <div className="text-sm" style={{ color: C.text }}>
                  {order.product} · {order.qty}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-base"
                style={{ background: `color-mix(in srgb, ${C.gold}, transparent 92%)` }}
              >
                💰
              </div>
              <div>
                <div
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: C.muted }}
                >
                  Total
                </div>
                <div className="text-sm font-bold" style={{ color: C.gold }}>
                  ₹{parseFloat(String(order.total).replace(/[₹$]/, '') || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
            {order.address && (
              <div className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `color-mix(in srgb, ${C.blue}, transparent 92%)`, color: C.blue }}
                >
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: C.muted }}
                  >
                    Delivery Address
                  </div>
                  <div className="text-sm" style={{ color: C.text }}>
                    {order.address}
                  </div>
                </div>
              </div>
            )}
            {order.notes && (
              <div className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background: `color-mix(in srgb, ${C.purple}, transparent 92%)`,
                    color: C.purple,
                  }}
                >
                  <StickyNote className="w-4 h-4" />
                </div>
                <div>
                  <div
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: C.muted }}
                  >
                    Notes
                  </div>
                  <div className="text-sm italic" style={{ color: C.muted }}>
                    "{order.notes}"
                  </div>
                </div>
              </div>
            )}
          </div>

          {order.status !== 'cancelled' && (
            <div>
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: C.muted }}
              >
                Progress
              </div>
              <div className="flex items-center">
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= stepIdx
                  const sc2 = ORDER_STATUS[step]
                  return (
                    <div
                      key={step}
                      className="flex items-center"
                      style={{ flex: i < STATUS_STEPS.length - 1 ? 1 : 'none' }}
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                          style={{
                            background: done
                              ? `color-mix(in srgb, ${sc2.color}, transparent 88%)`
                              : C.surface2,
                            border: `2px solid ${done ? sc2.color : C.border}`,
                            color: done ? sc2.color : C.muted,
                          }}
                        >
                          {done ? '✓' : i + 1}
                        </div>
                        <div
                          className="text-[9px] mt-1 text-center w-14"
                          style={{ color: done ? sc2.color : C.muted }}
                        >
                          {sc2.label}
                        </div>
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div
                          className="flex-1 h-0.5 mx-1 mb-4"
                          style={{
                            background:
                              i < stepIdx
                                ? `color-mix(in srgb, ${C.green}, transparent 60%)`
                                : C.border,
                          }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            {nextStatus && (
              <button
                onClick={() => {
                  onUpdateStatus(order.id, nextStatus)
                  onClose()
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #4ade80, #16a34a)',
                  color: '#051005',
                }}
              >
                <CheckCircle className="w-4 h-4" />
                Mark {ORDER_STATUS[nextStatus].label}
              </button>
            )}
            {order.status === 'delivered' && (
              <div
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  background: `color-mix(in srgb, ${C.green}, transparent 90%)`,
                  color: C.green,
                  border: `1px solid color-mix(in srgb, ${C.green}, transparent 70%)`,
                }}
              >
                <CheckCircle className="w-4 h-4" /> Delivered ✓
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

interface Props {
  orders: Order[]
  onUpdateStatus: (id: string, status: OrderStatus) => void
}

export function FarmerOrdersTab({ orders, onUpdateStatus }: Props) {
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered =
    filterStatus === 'all'
      ? orders
      : orders.filter((o) => o.status === filterStatus)

  const statusCounts = orders.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <>
      <div className="space-y-5">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
          >
            Orders{' '}
            <span
              className="text-sm font-normal ml-1"
              style={{ color: C.muted }}
            >
              ({orders.length})
            </span>
          </h2>
          <p className="text-xs mt-0.5" style={{ color: C.muted }}>
            Track and manage customer orders
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(
            ['pending', 'confirmed', 'dispatched', 'delivered'] as OrderStatus[]
          ).map((s) => {
            const sc = ORDER_STATUS[s]
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
                className="rounded-xl p-3 text-left transition-all hover:scale-[1.02]"
                style={{
                  background: filterStatus === s ? `color-mix(in srgb, ${sc.color}, transparent 92%)` : C.surface,
                  border: `1px solid ${filterStatus === s ? `color-mix(in srgb, ${sc.color}, transparent 75%)` : C.border}`,
                }}
              >
                <div
                  className="text-xl font-bold mb-0.5"
                  style={{ color: sc.color }}
                >
                  {statusCounts[s] ?? 0}
                </div>
                <div className="text-xs" style={{ color: C.muted }}>
                  {sc.label}
                </div>
              </button>
            )
          })}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {(
            [
              'all',
              'pending',
              'confirmed',
              'dispatched',
              'delivered',
              'cancelled',
            ] as const
          ).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background:
                  filterStatus === s
                    ? s === 'all'
                      ? `color-mix(in srgb, ${C.green}, transparent 90%)`
                      : `color-mix(in srgb, ${ORDER_STATUS[s].color}, transparent 90%)`
                    : C.surface2,
                color:
                  filterStatus === s
                    ? s === 'all'
                      ? C.green
                      : ORDER_STATUS[s].color
                    : C.muted,
                border: `1px solid ${filterStatus === s ? (s === 'all' ? `color-mix(in srgb, ${C.green}, transparent 70%)` : `color-mix(in srgb, ${ORDER_STATUS[s].color}, transparent 70%)`) : C.border}`,
              }}
            >
              {s === 'all'
                ? `All (${orders.length})`
                : `${ORDER_STATUS[s].icon} ${ORDER_STATUS[s].label} (${statusCounts[s] ?? 0})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">📦</div>
            <h3
              className="text-lg font-bold mb-2"
              style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
            >
              No orders here
            </h3>
            <p className="text-sm" style={{ color: C.muted }}>
              Orders from buyers will appear once your listings go live.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map((order, i) => {
            const sc = ORDER_STATUS[order.status]
            const isExpanded = expandedId === order.id
            const stepIdx = STATUS_STEPS.indexOf(order.status)
            const nextStatus =
              order.status !== 'delivered' && order.status !== 'cancelled'
                ? STATUS_STEPS[stepIdx + 1]
                : null

            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div className="flex items-center gap-4 p-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{
                      background: C.hover,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    {order.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-sm font-bold"
                        style={{ color: C.text }}
                      >
                        {order.id}
                      </span>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        {sc.icon} {sc.label}
                      </span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: C.muted }}>
                      <strong style={{ color: C.green }}>
                        {order.buyer}
                      </strong>{' '}
                      · {order.product} · {order.qty}
                    </div>
                    <div
                      className="text-[10px] mt-0.5"
                      style={{ color: C.muted }}
                    >
                      {order.date}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className="text-base font-bold"
                      style={{ color: C.gold }}
                    >
                      ₹{parseFloat(String(order.total).replace(/[₹$]/, '') || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : order.id)
                      }
                      className="mt-1 p-1 rounded-lg transition-colors"
                      style={{ color: C.muted }}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div
                        className="px-4 pb-4 pt-3 space-y-3"
                        style={{ borderTop: `1px solid ${C.border}` }}
                      >
                        {order.address && (
                          <div className="flex items-start gap-2">
                            <MapPin
                              className="w-4 h-4 shrink-0 mt-0.5"
                              style={{ color: C.muted }}
                            />
                            <span
                              className="text-xs"
                              style={{ color: C.muted }}
                            >
                              {order.address}
                            </span>
                          </div>
                        )}
                        {order.notes && (
                          <div className="flex items-start gap-2">
                            <StickyNote
                              className="w-4 h-4 shrink-0 mt-0.5"
                              style={{ color: C.muted }}
                            />
                            <span
                              className="text-xs italic"
                              style={{ color: C.muted }}
                            >
                              "{order.notes}"
                            </span>
                          </div>
                        )}
                        <div className="flex gap-2 flex-wrap">
                          {nextStatus && (
                            <button
                              onClick={() =>
                                onUpdateStatus(order.id, nextStatus)
                              }
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:opacity-90"
                              style={{
                                background:
                                  `color-mix(in srgb, ${ORDER_STATUS[nextStatus].color}, transparent 90%)`,
                                color: ORDER_STATUS[nextStatus].color,
                                border: `1px solid color-mix(in srgb, ${ORDER_STATUS[nextStatus].color}, transparent 75%)`,
                              }}
                            >
                              <CheckCircle className="w-3 h-3" /> Mark{' '}
                              {ORDER_STATUS[nextStatus].label}
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                            style={{
                              background: C.surface2,
                              border: `1px solid ${C.border}`,
                              color: C.muted,
                            }}
                          >
                            View Full Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdateStatus={onUpdateStatus}
          />
        )}
      </AnimatePresence>
    </>
  )
}
