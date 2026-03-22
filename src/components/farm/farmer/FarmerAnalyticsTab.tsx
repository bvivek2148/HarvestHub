import { motion } from 'motion/react'
import {
  TrendingUp,
  Eye,
  ShoppingBag,
  IndianRupee,
  Star,
  Users,
  ArrowUp,
  Award,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'
import { C, getRevenueTrend, type Listing, type Order } from './FarmerTypes'


function MetricCard({
  icon,
  label,
  value,
  change,
  color,
  delay,
}: {
  icon: React.ReactNode
  label: string
  value: string
  change: string
  color: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className="rounded-2xl p-5 relative overflow-hidden group"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(circle at 80% 20%, ${color}08, transparent 60%)`,
        }}
      />
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: color + '18', color }}
        >
          {icon}
        </div>
        <div
          className="flex items-center gap-1 text-xs font-semibold"
          style={{ color: C.green }}
        >
          <ArrowUp className="w-3 h-3" />
          {change}
        </div>
      </div>
      <div
        className="text-2xl font-bold"
        style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
      >
        {value}
      </div>
      <div className="text-xs mt-1" style={{ color: C.muted }}>
        {label}
      </div>
    </motion.div>
  )
}

function ChartTip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; name?: string }>
  label?: string
}) {
  if (active && payload?.length) {
    return (
      <div
        className="px-3 py-2 rounded-lg text-xs"
        style={{
          background: C.surface2,
          border: `1px solid ${C.border}`,
          color: C.text,
        }}
      >
        <div className="font-semibold mb-0.5">{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: C.green }}>
            {p.name === 'revenue' ? '₹' : ''}
            {p.value}
          </div>
        ))}
      </div>
    )
  }
  return null
}

interface Props {
  listings: Listing[]
  orders: Order[]
}

export function FarmerAnalyticsTab({ listings, orders }: Props) {
  const totalRevenue = orders
    .filter((o) => o.status === 'delivered')
    .reduce((s, o) => s + parseFloat(String(o.total).replace(/[₹$]/, '')), 0)
  const totalViews = listings.reduce((s, l) => s + (l.views ?? 0), 0)
  const totalOrders = orders.length
  const convRate =
    totalViews > 0 ? ((totalOrders / totalViews) * 100).toFixed(1) : '0.0'

  const revenueTrend = getRevenueTrend(orders)
  
  // Weekly views - synthetic daily distribution based on total views (time-series tracking pending)
  const weeklyViews = [
    { day: 'Mon', views: Math.floor(totalViews * 0.1) },
    { day: 'Tue', views: Math.floor(totalViews * 0.15) },
    { day: 'Wed', views: Math.floor(totalViews * 0.2) },
    { day: 'Thu', views: Math.floor(totalViews * 0.1) },
    { day: 'Fri', views: Math.floor(totalViews * 0.25) },
    { day: 'Sat', views: Math.floor(totalViews * 0.1) },
    { day: 'Sun', views: Math.floor(totalViews * 0.1) },
  ]

  const performanceData = listings.map(l => ({
    name: l.name,
    emoji: l.emoji,
    views: l.views || 0,
    orders: l.orders || 0,
    revenue: (l.orders || 0) * parseFloat(l.price),
    rating: 4.8 // Estimated average rating
  })).sort((a, b) => b.revenue - a.revenue)

  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-xl font-bold"
          style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
        >
          Analytics
        </h2>
        <p className="text-xs mt-0.5" style={{ color: C.muted }}>
          Farm performance insights at a glance
        </p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          icon={<IndianRupee className="w-5 h-5" />}
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          change="0%"
          color={C.green}
          delay={0}
        />
        <MetricCard
          icon={<Eye className="w-5 h-5" />}
          label="Listing Views"
          value={String(totalViews)}
          change="0%"
          color={C.blue}
          delay={0.07}
        />
        <MetricCard
          icon={<ShoppingBag className="w-5 h-5" />}
          label="Total Orders"
          value={String(totalOrders)}
          change="0%"
          color={C.purple}
          delay={0.14}
        />
        <MetricCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Conversion Rate"
          value={`${convRate}%`}
          change="0%"
          color={C.gold}
          delay={0.21}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="rounded-2xl p-5"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3
                className="text-sm font-bold"
                style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
              >
                Revenue Trend
              </h3>
              <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                Monthly earnings
              </p>
            </div>
            <div
              className="flex items-center gap-1 text-xs font-semibold"
              style={{ color: C.green }}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              +24% MoM
            </div>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueTrend}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revG2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.green} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={C.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: C.muted }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="revenue"
                  stroke={C.green}
                  strokeWidth={2}
                  fill="url(#revG2)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          <div className="mb-4">
            <h3
              className="text-sm font-bold"
              style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
            >
              Listing Views This Week
            </h3>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>
              Daily view counts
            </p>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyViews}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: C.muted }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTip />} />
                <Bar
                  dataKey="views"
                  fill={C.blue}
                  radius={[4, 4, 0, 0]}
                  opacity={0.8}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Performing Listings */}
      <div
        className="rounded-2xl p-5"
        style={{ background: C.surface, border: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4 h-4" style={{ color: C.gold }} />
          <h3
            className="text-sm font-bold"
            style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
          >
            Top Performing Listings
          </h3>
        </div>
        <div className="space-y-3">
          {performanceData.length === 0 ? (
            <div className="py-8 text-center" style={{ color: C.muted }}>
              <Award className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p className="text-xs">No listing data available yet.</p>
            </div>
          ) : (
            performanceData.slice(0, 5).map(
              (item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-4 p-3 rounded-xl"
                  style={{
                    background: C.surface2,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div className="flex items-center gap-1 shrink-0 w-5">
                    {i === 0 ? (
                      <span className="text-base">🥇</span>
                    ) : i === 1 ? (
                      <span className="text-base">🥈</span>
                    ) : i === 2 ? (
                      <span className="text-base">🥉</span>
                    ) : (
                      <span
                        className="text-sm font-bold"
                        style={{ color: C.muted }}
                      >
                        #{i + 1}
                      </span>
                    )}
                  </div>
                  <span className="text-xl shrink-0">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm font-semibold truncate"
                      style={{ color: C.text }}
                    >
                      {item.name}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs" style={{ color: C.muted }}>
                        <Eye className="w-2.5 h-2.5 inline mr-0.5" />
                        {item.views}
                      </span>
                      <span className="text-xs" style={{ color: C.muted }}>
                        <ShoppingBag className="w-2.5 h-2.5 inline mr-0.5" />
                        {item.orders}
                      </span>
                      <span
                        className="text-xs flex items-center gap-0.5"
                        style={{ color: C.gold }}
                      >
                        <Star className="w-2.5 h-2.5" fill={C.gold} />
                        {item.rating}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className="text-base font-bold"
                      style={{ color: C.green }}
                    >
                      ₹{item.revenue.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px]" style={{ color: C.muted }}>
                      revenue
                    </div>
                  </div>
                  <div className="w-20 hidden sm:block">
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(item.revenue / performanceData[0].revenue) * 100}%`,
                          background: i === 0 ? C.gold : C.green,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ),
            )
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Average Rating',
            value: '4.8',
            icon: <Star className="w-5 h-5" fill={C.gold} />,
            color: C.gold,
          },
          {
            label: 'Total Reviews',
            value: '87',
            icon: <Users className="w-5 h-5" />,
            color: C.blue,
          },
          {
            label: 'Repeat Buyers',
            value: '34%',
            icon: <TrendingUp className="w-5 h-5" />,
            color: C.purple,
          },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: m.color + '18', color: m.color }}
            >
              {m.icon}
            </div>
            <div>
              <div
                className="text-xl font-bold"
                style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
              >
                {m.value}
              </div>
              <div className="text-xs" style={{ color: C.muted }}>
                {m.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
