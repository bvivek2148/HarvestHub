import { motion } from 'motion/react'
import { Link } from '@tanstack/react-router'
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Heart,
  ArrowRight,
  Search,
  Leaf,
  MapPin,
  ChevronRight,
  Star,
  Zap,
  BarChart3,
  Truck,
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
  STATUS_CONFIG,
  type OrderItem,
  getSpendingTrend,
  getCategoryStats
} from './BuyerTypes'

interface Props {
  displayName: string
  onTabChange: (tab: string) => void
  orders: OrderItem[]
  wishlist: any[]
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
      whileHover={{ scale: 1.02, y: -2 }}
      className="rounded-2xl p-5 relative overflow-hidden group cursor-default"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 80% 20%, ${color}08, transparent 60%)`,
        }}
      />
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ background: color + '18', color }}
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
      <div className="text-xs mt-1.5 font-medium" style={{ color }}>
        {sub}
      </div>
    </motion.div>
  )
}

function OrderRow({ order, index }: { order: OrderItem; index: number }) {
  const sc = STATUS_CONFIG[order.status]
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ x: 3 }}
      className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200"
      style={{ background: C.surface2, border: `1px solid ${C.border}` }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      >
        {order.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="text-sm font-semibold truncate"
          style={{ color: C.text }}
        >
          {order.product}
        </div>
        <div className="text-xs mt-0.5" style={{ color: C.muted }}>
          {order.farmer} · {order.qty}
        </div>
      </div>
      <div className="text-right shrink-0 space-y-1">
        <div className="text-sm font-bold" style={{ color: C.gold }}>
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
        <div style={{ color: C.green }}>₹{payload[0].value}</div>
      </div>
    )
  }
  return null
}

export function BuyerOverviewTab({
  displayName,
  onTabChange,
  orders = [],
  wishlist = [],
}: Props) {
  const totalSpent = orders
    .filter((o) => o.status === 'delivered')
    .reduce((s, o) => s + parseFloat(o.total.replace(/[₹$]/, '')), 0)

  const savedCount = wishlist.length
  const activeOrders = orders.filter((o) => ['pending', 'confirmed', 'dispatched'].includes(o.status)).length

  const farmers = Array.from(new Set(orders.map(o => o.farmer))).map(name => ({
    id: name,
    name,
    specialty: 'Local Produce',
    emoji: '👨‍🌾',
    rating: 4.9,
    distance: '2.4 km',
    badge: 'Verified'
  })).slice(0, 3)

  const spendingData = getSpendingTrend(orders)
  const categoryData = getCategoryStats(orders)

  const delivered = orders.filter((o) => o.status === 'delivered').length
  // The original `active` calculation is replaced by `activeOrders`
  // const active = orders.filter(
  //   (o) => !['delivered', 'cancelled'].includes(o.status),
  // ).length
  // The original `totalSpent` calculation is now at the top
  // const totalSpent = orders.filter(
  //   (o) => o.status === 'delivered',
  // ).reduce((s, o) => s + parseFloat(o.total.replace('$', '')), 0)

  const stats = [
    {
      icon: <Package className="w-5 h-5" />,
      label: 'Total Orders',
      value: String(orders.length),
      sub: `${delivered} delivered`,
      color: C.blue,
    },
    {
      icon: <ShoppingCart className="w-5 h-5" />,
      label: 'Active Orders',
      value: String(activeOrders),
      sub: 'in progress',
      color: C.purple,
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Total Spent',
      value: `₹${totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      sub: 'on fresh produce',
      color: C.gold,
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: 'Saved Items',
      value: String(savedCount),
      sub: 'wishlisted',
      color: C.red,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #061a0c 0%, #0d3320 50%, #071a10 100%)',
          border: '1px solid rgba(74,222,128,0.2)',
        }}
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)',
            transform: 'translate(20%,-30%)',
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-96 h-32 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse, rgba(240,180,41,0.06) 0%, transparent 70%)',
          }}
        />
        <div className="relative">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-1"
                style={{ color: C.green }}
              >
                Good morning
              </p>
              <h2
                className="font-bold text-[#f5f0e8] mb-1"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                }}
              >
                Welcome back, {displayName}! 👋
              </h2>
              <p className="text-sm" style={{ color: C.muted }}>
                Your fresh produce is just a click away.
              </p>
            </div>
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl shrink-0"
              style={{
                background: 'rgba(74,222,128,0.08)',
                border: '1px solid rgba(74,222,128,0.2)',
              }}
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: C.green }}
              />
              <span className="text-xs font-medium" style={{ color: C.green }}>
                Farm Fresh Available
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-[#051005] transition-all hover:scale-105 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #4ade80, #16a34a)',
                boxShadow: '0 4px 20px rgba(74,222,128,0.25)',
              }}
            >
              <Search className="w-4 h-4" />
              Browse Marketplace
            </Link>
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
              My Orders
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.07} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Spending Chart */}
        <div
          className="lg:col-span-2 rounded-2xl p-5"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3
                className="text-sm font-bold"
                style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
              >
                Spending Overview
              </h3>
              <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                Last 6 months
              </p>
            </div>
            <div
              className="flex items-center gap-1.5 text-xs font-semibold"
              style={{ color: C.green }}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              0% vs last period
            </div>
          </div>
          <div className="h-40 relative">
            {spendingData.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-30">
                <BarChart3 className="w-8 h-8 mb-2" />
                <p className="text-[10px] font-medium">Your spending history will appear here</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={spendingData}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.green} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={C.green} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke={C.green}
                    strokeWidth={2}
                    fill="url(#spendGrad)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div
          className="rounded-2xl p-5"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          <h3
            className="text-sm font-bold mb-1"
            style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
          >
            By Category
          </h3>
          <p className="text-xs mb-3" style={{ color: C.muted }}>
            Spend distribution
          </p>
          <div className="flex justify-center mb-3">
            {categoryData.length === 0 ? (
              <div className="w-28 h-28 rounded-full border-2 border-dashed border-white/5 flex items-center justify-center text-center p-4">
                <span className="text-[8px] font-medium opacity-20">No shopping history yet</span>
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
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {categoryData.map((entry: any, i: number) => (
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
          <div className="space-y-1.5">
            {categoryData.length === 0 ? (
              <p className="text-[10px] text-center" style={{ color: C.muted }}>Order categories will show here</p>
            ) : (
              categoryData.map((c: any) => (
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

      {/* Recent Orders + Nearby Farmers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
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
                <Package className="w-6 h-6 mx-auto mb-2 opacity-10" />
                <p className="text-[10px]">No orders placed yet.</p>
              </div>
            ) : (
              orders.slice(0, 3).map((order, i) => (
                <OrderRow key={order.id} order={order} index={i} />
              ))
            )}
          </div>
        </div>

        {/* Top Farmers */}
        <div
          className="rounded-2xl p-5"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-sm font-bold"
              style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
            >
              Nearby Farmers
            </h3>
            <button
              onClick={() => onTabChange('explore')}
              className="flex items-center gap-1 text-xs font-medium hover:underline"
              style={{ color: C.green }}
            >
              Explore <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {farmers.length === 0 ? (
              <div className="py-6 text-center" style={{ color: C.muted }}>
                <MapPin className="w-6 h-6 mx-auto mb-2 opacity-10" />
                <p className="text-[10px]">No nearby farmers found.</p>
              </div>
            ) : (
              farmers.slice(0, 3).map((farmer, i) => (
                <motion.div
                  key={farmer.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ x: -2, scale: 1.01 }}
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
                    {farmer.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm font-semibold truncate"
                      style={{ color: C.text }}
                    >
                      {farmer.name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="flex items-center gap-0.5 text-xs"
                        style={{ color: C.gold }}
                      >
                        <Star className="w-3 h-3" fill={C.gold} />
                        {farmer.rating}
                      </span>
                      <span
                        className="flex items-center gap-0.5 text-xs"
                        style={{ color: C.muted }}
                      >
                        <MapPin className="w-3 h-3" />
                        {farmer.distance}
                      </span>
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      background: 'rgba(74,222,128,0.1)',
                      color: C.green,
                      border: '1px solid rgba(74,222,128,0.2)',
                    }}
                  >
                    {farmer.badge}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: <Truck className="w-5 h-5" />,
            label: 'Track Orders',
            color: C.purple,
            onClick: () => onTabChange('orders'),
          },
          {
            icon: <Heart className="w-5 h-5" />,
            label: 'My Wishlist',
            color: C.red,
            onClick: () => onTabChange('saved'),
          },
          {
            icon: <Leaf className="w-5 h-5" />,
            label: 'Explore Farms',
            color: C.green,
            onClick: () => onTabChange('explore'),
          },
          {
            icon: <Zap className="w-5 h-5" />,
            label: 'Flash Deals',
            color: C.gold,
            onClick: () => onTabChange('explore'),
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
            className="rounded-2xl p-4 flex flex-col items-center gap-2 text-center transition-all"
            style={{ background: C.surface2, border: `1px solid ${C.border}` }}
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

      {/* Farmer CTA Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl p-5 flex items-center gap-4"
        style={{
          background: 'rgba(240,180,41,0.07)',
          border: '1px solid rgba(240,180,41,0.2)',
        }}
      >
        <div className="text-3xl">🌾</div>
        <div className="flex-1">
          <div
            className="text-sm font-bold"
            style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
          >
            Want to sell on HarvestHub?
          </div>
          <p className="text-xs mt-0.5" style={{ color: C.muted }}>
            Join thousands of farmers selling fresh produce directly to buyers.
          </p>
        </div>
        <Link
          to="/join-farmer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all hover:scale-105 whitespace-nowrap"
          style={{
            background: 'linear-gradient(135deg, #f0b429, #f59e0b)',
            color: '#0d1a0d',
          }}
        >
          Apply <ArrowRight className="w-3 h-3" />
        </Link>
      </motion.div>
    </div>
  )
}
