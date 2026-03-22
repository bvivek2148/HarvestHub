import { motion } from 'motion/react'
import {
  Package,
  TrendingUp,
  IndianRupee,
  Eye,
  Plus,
  ChevronRight,
  AlertTriangle,
  BarChart3,
  MessageSquare,
  Zap,
  Users,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  C,
  ORDER_STATUS,
  LISTING_STATUS,
  type Listing,
  type Order,
  type Message,
  getRevenueTrend,
  getCategoryStats
} from './FarmerTypes'

interface Props {
  displayName: string
  listings: Listing[]
  orders: Order[]
  messages: Message[]
  onTabChange: (tab: string) => void
  onAddListing: () => void
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
  delay,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
  color: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="fd-card-premium rounded-2xl p-5 relative overflow-hidden group cursor-default"
      style={{ border: `1px solid ${C.border}` }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 80% 20%, color-mix(in srgb, ${color}, transparent 96%), transparent 60%)`,
        }}
      />
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ 
          background: `color-mix(in srgb, ${color}, transparent 90%)`, 
          color 
        }}
      >
        {icon}
      </div>
      <div
        className="text-2xl font-bold mb-0.5"
        style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
      >
        {value}
      </div>
      <div className="text-xs font-medium" style={{ color: C.muted }}>
        {label}
      </div>
      <div className="text-xs mt-1.5 font-semibold" style={{ color }}>
        {sub}
      </div>
    </motion.div>
  )
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (active && payload?.length) {
    return (
      <div
        className="px-3 py-2 rounded-lg text-xs"
        style={{
          background: C.surface2,
          border: `1px solid ${C.border2}`,
          color: C.text,
        }}
      >
        <div className="font-semibold">{label}</div>
        <div style={{ color: C.green }}>₹{payload[0].value.toLocaleString('en-IN')}</div>
      </div>
    )
  }
  return null
}

export function FarmerOverviewTab({
  displayName,
  listings,
  orders,
  messages,
  onTabChange,
  onAddListing,
}: Props) {
  const revenue = orders
    .filter((o) => o.status === 'delivered')
    .reduce((s, o) => s + parseFloat(String(o.total).replace(/[₹$]/, '')), 0)
  const pendingOrders = orders.filter((o) => o.status === 'pending').length
  const activeListings = listings.filter((l) => l.status === 'active').length
  const totalViews = listings.reduce((s, l) => s + (l.views ?? 0), 0)
  const lowStock = listings.filter(
    (l) => l.status === 'low' || l.status === 'sold_out',
  ).length

  const stats = [
    {
      icon: <IndianRupee className="w-5 h-5" />,
      label: 'Total Revenue',
      value: `₹${revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      sub: `${orders.filter((o) => o.status === 'delivered').length} fulfilled`,
      color: C.green,
    },
    {
      icon: <Package className="w-5 h-5" />,
      label: 'Active Listings',
      value: String(activeListings),
      sub: `${listings.length} total`,
      color: C.blue,
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Pending Orders',
      value: String(pendingOrders),
      sub: `${orders.length} total orders`,
      color: C.gold,
    },
    {
      icon: <Eye className="w-5 h-5" />,
      label: 'Listing Views',
      value: String(totalViews),
      sub: 'this month',
      color: C.purple,
    },
  ]

  const revenueData = getRevenueTrend(orders)
  const categoryData = getCategoryStats(listings)

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, var(--fd-green-dark), var(--fd-green))`,
          border: `1px solid color-mix(in srgb, var(--fd-green), transparent 60%)`,
          boxShadow: `0 12px 40px color-mix(in srgb, var(--fd-green), transparent 85%)`,
        }}
      >
        <div
          className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%)',
            transform: 'translate(25%,-35%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-32 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse, rgba(240,180,41,0.05) 0%, transparent 70%)',
          }}
        />
        <div className="relative">
          <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
            <div>
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-1"
                style={{ color: C.green }}
              >
                Farmer Dashboard
              </p>
              <h2
                className="font-bold text-white mb-1"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                }}
              >
                Welcome back, {displayName}! 🌾
              </h2>
              <p className="text-sm text-white/80">
                Manage listings, track orders, and grow your farm business.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {lowStock > 0 && (
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{
                    background: 'rgba(251,191,36,0.1)',
                    border: '1px solid rgba(251,191,36,0.25)',
                  }}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-[#fbbf24]" />
                  <span className="text-xs font-semibold text-[#fbbf24]">
                    {lowStock} stock alert{lowStock > 1 ? 's' : ''}
                  </span>
                </div>
              )}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  background: 'rgba(74,222,128,0.08)',
                  border: '1px solid rgba(74,222,128,0.2)',
                }}
              >
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: C.green }}
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: C.green }}
                >
                  Verified Farmer
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onAddListing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-[#051005] transition-all hover:scale-105 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #4ade80, #16a34a)',
                boxShadow: '0 4px 20px rgba(74,222,128,0.25)',
              }}
            >
              <Plus className="w-4 h-4" /> Add New Listing
            </button>
            <button
              onClick={() => onTabChange('orders')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: C.text,
              }}
            >
              <Package className="w-4 h-4" />
              View Orders{' '}
              {pendingOrders > 0 && (
                <span style={{ color: C.gold }}>({pendingOrders})</span>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.07} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          className="lg:col-span-2 fd-card-premium rounded-2xl p-5"
          style={{ border: `1px solid ${C.border}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3
                className="text-sm font-bold"
                style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
              >
                Revenue Overview
              </h3>
              <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                Last 6 months
              </p>
            </div>
            <div
              className="flex items-center gap-1.5 text-xs font-semibold"
              style={{ color: C.green }}
            >
              <TrendingUp className="w-3.5 h-3.5" /> 0% vs last period
            </div>
          </div>
          <div className="h-44 relative">
            {revenueData.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-30">
                <BarChart3 className="w-8 h-8 mb-2" />
                <p className="text-[10px] font-medium">Waiting for your first sales...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.green} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={C.green} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={C.green}
                    strokeWidth={2}
                    fill="url(#revGrad)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div
          className="fd-card-premium rounded-2xl p-5"
          style={{ border: `1px solid ${C.border}` }}
        >
          <h3
            className="text-sm font-bold mb-1"
            style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
          >
            Sales by Category
          </h3>
          <p className="text-xs mb-3" style={{ color: C.muted }}>
            Revenue breakdown
          </p>
          <div className="flex justify-center mb-3">
            {categoryData.length === 0 ? (
              <div className="w-28 h-28 rounded-full border-2 border-dashed border-white/5 flex items-center justify-center text-center p-4">
                <span className="text-[8px] font-medium opacity-20">No category data</span>
              </div>
            ) : (
              <div className="relative w-28 h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={54}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {categoryData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold" style={{ color: C.text }}>
                    100%
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2">
            {categoryData.length === 0 ? (
              <p className="text-[10px] text-center" style={{ color: C.muted }}>Listings will appear here after sales</p>
            ) : (
              categoryData.map((c) => (
                <div key={c.name} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: c.color }}
                  />
                  <span className="text-xs flex-1" style={{ color: C.muted }}>
                    {c.name}
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: C.text }}
                  >
                    {c.value}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Listings + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="rounded-2xl p-5"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-sm font-bold"
              style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
            >
              My Listings
            </h3>
            <button
              onClick={() => onTabChange('listings')}
              className="flex items-center gap-1 text-xs font-medium hover:underline"
              style={{ color: C.green }}
            >
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {listings.length === 0 ? (
              <div className="py-6 text-center" style={{ color: C.muted }}>
                <Package className="w-6 h-6 mx-auto mb-2 opacity-10" />
                <p className="text-[10px]">No listings created yet.</p>
              </div>
            ) : (
              listings.slice(0, 4).map((item, i) => {
                const st = LISTING_STATUS[item.status]
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ x: 3 }}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{
                      background: C.surface2,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <span className="text-xl shrink-0">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-semibold truncate"
                        style={{ color: C.text }}
                      >
                        {item.name}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: C.muted }}>
                        ₹{item.price}/{item.priceUnit} · {item.stock}{' '}
                        {item.stockUnit}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: st.bg, color: st.color }}
                      >
                        {st.label}
                      </span>
                      <div
                        className="text-[10px] mt-1"
                        style={{ color: C.muted }}
                      >
                        <Eye className="w-2.5 h-2.5 inline mr-0.5" />
                        {item.views ?? 0}
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-sm font-bold"
              style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
            >
              Recent Orders
            </h3>
            <button
              onClick={() => onTabChange('orders')}
              className="flex items-center gap-1 text-xs font-medium hover:underline"
              style={{ color: C.green }}
            >
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {orders.length === 0 ? (
              <div className="py-6 text-center" style={{ color: C.muted }}>
                <TrendingUp className="w-6 h-6 mx-auto mb-2 opacity-10" />
                <p className="text-[10px]">No orders received yet.</p>
              </div>
            ) : (
              orders.slice(0, 4).map((order, i) => {
                const sc = ORDER_STATUS[order.status]
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ x: -2 }}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{
                      background: C.surface2,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <span className="text-xl shrink-0">{order.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-semibold truncate"
                        style={{ color: C.text }}
                      >
                        {order.id}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: C.muted }}>
                        {order.buyer} · {order.qty}
                      </div>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <div
                        className="text-sm font-bold"
                        style={{ color: C.gold }}
                      >
                        {order.total}
                      </div>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        {sc.icon} {sc.label}
                      </span>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>
      </div>

        {/* Recent Messages */}
        <div
          className="rounded-2xl p-5"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-sm font-bold"
              style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
            >
              Recent Messages
            </h3>
            <button
              onClick={() => onTabChange('chat')}
              className="flex items-center gap-1 text-xs font-medium hover:underline"
              style={{ color: C.green }}
            >
              Inbox <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="py-6 text-center" style={{ color: C.muted }}>
                <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-10" />
                <p className="text-[10px]">No messages yet.</p>
              </div>
            ) : (
              messages.slice(0, 3).map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ x: -2 }}
                  onClick={() => onTabChange('chat')}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200"
                  style={{
                    background: C.surface2,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: 'rgba(74,222,128,0.08)' }}
                  >
                    {msg.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-semibold truncate"
                        style={{ color: C.text }}
                      >
                        {msg.buyer}
                      </span>
                      <span className="text-[10px]" style={{ color: C.muted }}>
                        {msg.time}
                      </span>
                    </div>
                    <div
                      className="text-xs truncate"
                      style={{ color: C.muted }}
                    >
                      {msg.lastMsg}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: <Plus className="w-5 h-5" />,
            label: 'Add Listing',
            color: C.green,
            onClick: onAddListing,
          },
          {
            icon: <BarChart3 className="w-5 h-5" />,
            label: 'Analytics',
            color: C.blue,
            onClick: () => onTabChange('analytics'),
          },
          {
            icon: <Users className="w-5 h-5" />,
            label: 'Messages',
            color: C.purple,
            onClick: () => onTabChange('chat'),
          },
          {
            icon: <Zap className="w-5 h-5" />,
            label: 'Boost Listing',
            color: C.gold,
            onClick: () => onTabChange('listings'),
          },
        ].map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.06 }}
            onClick={action.onClick}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="fd-card-premium rounded-2xl p-4 flex flex-col items-center gap-2 text-center transition-all"
            style={{ border: `1px solid ${C.border}` }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: action.color + '18', color: action.color }}
            >
              {action.icon}
            </div>
            <span className="text-xs font-semibold" style={{ color: C.text }}>
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Farm tips banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl p-5 flex items-center gap-4"
        style={{
          background: 'rgba(240,180,41,0.06)',
          border: '1px solid rgba(240,180,41,0.2)',
        }}
      >
        <div className="text-3xl">💡</div>
        <div className="flex-1">
          <div
            className="text-sm font-bold"
            style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
          >
            Tip: Photos boost sales by 3×
          </div>
          <p className="text-xs mt-0.5" style={{ color: C.muted }}>
            Add high-quality photos to your listings to attract more buyers.
          </p>
        </div>
        <button
          onClick={() => onTabChange('listings')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #f0b429, #f59e0b)',
            color: '#0d1a0d',
          }}
        >
          Update Listings
        </button>
      </motion.div>
    </div>
  )
}
