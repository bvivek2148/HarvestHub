import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate, Link, useSearch } from '@tanstack/react-router'
import {
  BarChart3,
  Package,
  Heart,
  Search,
  Bell,
  Settings,
  LogOut,
  Sprout,
  Menu,
  X,
  MessageSquare,
  ShoppingCart,
} from 'lucide-react'
import { toast } from 'sonner'

import {
  C,
} from './buyer/BuyerTypes'
import { BuyerOverviewTab } from './buyer/BuyerOverviewTab'
import { BuyerOrdersTab } from './buyer/BuyerOrdersTab'
import { BuyerSavedTab } from './buyer/BuyerSavedTab'
import { BuyerExploreTab } from './buyer/BuyerExploreTab'
import { BuyerNotificationsPanel } from './buyer/BuyerNotificationsPanel'
import { BuyerSettingsModal } from './buyer/BuyerSettingsModal'
import { BuyerChatTab } from './buyer/BuyerChatTab'
import { BuyerCartTab } from './buyer/BuyerCartTab'
import { useQuery } from '@tanstack/react-query'
import { getBuyerOrdersFn } from '@/server/functions/orders'
import { getWishlistFn } from '@/server/functions/listings'
import { getCurrentUserProfileFn } from '@/server/functions/users'
import { useNotifications } from '@/hooks/use-notifications'
import { useChatThreads } from '@/hooks/use-firestore-chat'
import { ChatPanel } from './common/ChatPanel'

import { useCart } from '@/context/CartContext'

type TabId = 'overview' | 'orders' | 'saved' | 'explore' | 'chat' | 'cart'

const NAV_ITEMS: Array<{ id: TabId; icon: React.ReactNode; label: string }> = [
  {
    id: 'overview',
    icon: <BarChart3 className="w-4 h-4" />,
    label: 'Overview',
  },
  { id: 'orders', icon: <Package className="w-4 h-4" />, label: 'My Orders' },
  { id: 'saved', icon: <Heart className="w-4 h-4" />, label: 'Wishlist' },
  { id: 'explore', icon: <Search className="w-4 h-4" />, label: 'Explore' },
  { id: 'chat', icon: <MessageSquare className="w-4 h-4" />, label: 'Messages' },
  { id: 'cart', icon: <ShoppingCart className="w-4 h-4" />, label: 'Cart' },
]

export function BuyerDashboard() {
  const { currentUser, signOut } = useAuth()
  const navigate = useNavigate()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const { itemCount } = useCart()
  const search = useSearch({ from: '/_protected/buyer' })

  const [activeTab, setActiveTab] = useState<TabId>('explore')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const { data: ordersData = [] } = useQuery({
    queryKey: ['buyerOrders'],
    queryFn: () => getBuyerOrdersFn()
  })
  const { data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => getCurrentUserProfileFn()
  })

  const { data: wishlistData = [] } = useQuery({
    queryKey: ['buyerWishlist'],
    queryFn: () => getWishlistFn()
  })

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [localDisplayName, setLocalDisplayName] = useState<string | null>(null)

  useEffect(() => {
    if ((profile as any)?.name) setLocalDisplayName((profile as any).name)
  }, [profile])

  useEffect(() => {
    if (search.tab) {
      setActiveTab(search.tab as TabId)
    }
    if (search.threadId) {
      setActiveThreadId(search.threadId)
    }
  }, [search])

  const { threads } = useChatThreads()
  const activeThread = threads.find(t => t.id === activeThreadId)
  const unreadMsgs = threads.reduce((acc, t) => acc + (t.unreadCount?.[currentUser?.id || ''] || 0), 0)

  const displayName = localDisplayName || currentUser?.name || currentUser?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Buyer'
  const initials = String(displayName || 'Buyer').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  const handleSignOut = async () => {
    await signOut()
    await navigate({ to: '/' })
  }

  const handleMarkRead = (id: string) => markAsRead(id)

  const handleClearAll = () => {
    markAllAsRead()
    toast.success('All notifications cleared')
  }

  const changeTab = (tab: string) => {
    setActiveTab(tab as TabId)
    setSidebarOpen(false)
  }

  // Reusable sidebar nav content
  const SidebarContent = () => (
    <>
      <Link
        to="/"
        className="h-16 flex items-center gap-2.5 px-5 transition-colors group shrink-0"
        style={{ borderBottom: `1px solid ${C.border}`, background: 'transparent' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = C.hover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="relative w-8 h-8">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: 'linear-gradient(135deg, #f0b429, #7a5c00)' }}
          />
          <Sprout className="absolute inset-0 m-auto w-4 h-4 text-[#0d1a0d]" />
        </div>
        <span
          className="text-base font-bold"
          style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
        >
          Harvest<span style={{ color: C.gold }}>Hub</span>
        </span>
      </Link>

      {/* User pill */}
      <div className="px-3 py-4 shrink-0">
        <div
          className="flex items-center gap-3 p-3 rounded-2xl"
          style={{ background: C.surface2, border: `1px solid ${C.border}` }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
            style={{
              background:
                `linear-gradient(135deg, color-mix(in srgb, ${C.green}, transparent 75%), color-mix(in srgb, ${C.green}, transparent 90%))`,
              color: C.green,
              border: `1px solid color-mix(in srgb, ${C.green}, transparent 75%)`,
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="text-xs font-bold truncate"
              style={{ color: C.text }}
            >
              {displayName}
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: C.green }}>
              🛒 Buyer
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => changeTab(item.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm"
            style={{
              background:
                activeTab === item.id ? C.hover : 'transparent',
              color: activeTab === item.id ? C.green : C.muted,
              border:
                activeTab === item.id
                  ? `1px solid ${C.border2}`
                  : '1px solid transparent',
              fontWeight: activeTab === item.id ? 600 : 400,
            }}
          >
            {item.icon}
            <span className="flex-1 text-left">{item.label}</span>
            {item.id === 'chat' && unreadMsgs > 0 && (
              <span 
                className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: C.green, color: '#051005' }}
              >
                {unreadMsgs}
              </span>
            )}
            {item.id === 'cart' && itemCount > 0 && (
              <span 
                className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: C.gold, color: '#051005' }}
              >
                {itemCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div
        className="px-3 py-4 space-y-1 shrink-0"
        style={{ borderTop: `1px solid ${C.border}` }}
      >
        <button
          onClick={() => {
            setShowSettings(true)
            setSidebarOpen(false)
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors"
          style={{ color: C.muted, background: 'transparent' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = C.hover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Settings className="w-4 h-4" /> Settings
        </button>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors"
          style={{ color: C.red, background: 'transparent' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </>
  )

  return (
    <div
      className="min-h-screen"
      style={{ background: C.bg, fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 lg:hidden"
            style={{
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(2px)',
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          className="w-60 shrink-0 hidden lg:flex flex-col"
          style={{ background: C.navBg, borderRight: `1px solid ${C.border}` }}
        >
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="fixed top-0 left-0 h-full w-60 z-40 flex flex-col lg:hidden"
              style={{
                background: C.navBg,
                borderRight: `1px solid ${C.border}`,
              }}
            >
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg"
                  style={{ color: C.muted }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Header */}
          <header
            className="h-16 flex items-center justify-between px-4 sm:px-6 shrink-0"
            style={{
              background: C.navBg,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 rounded-xl transition-colors hover:bg-white/[0.05]"
                style={{ color: C.muted }}
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1
                  className="text-base font-bold"
                  style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
                >
                  {NAV_ITEMS.find((n) => n.id === activeTab)?.label ??
                    'Dashboard'}
                </h1>
                <p className="text-xs" style={{ color: C.green }}>
                  🛒 {displayName} · Buyer
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications bell */}
              <button
                onClick={() => setShowNotifications((v) => !v)}
                className="relative p-2 rounded-xl transition-colors"
                style={{ color: C.muted, background: showNotifications ? C.hover : 'transparent' }}
                onMouseEnter={(e) => !showNotifications && (e.currentTarget.style.background = C.hover)}
                onMouseLeave={(e) => !showNotifications && (e.currentTarget.style.background = 'transparent')}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ background: C.green, color: '#051005' }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
              {/* Avatar */}
              <button
                onClick={() => setShowSettings(true)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all hover:scale-105"
                  style={{
                    background:
                      `linear-gradient(135deg, color-mix(in srgb, ${C.green}, transparent 75%), color-mix(in srgb, ${C.green}, transparent 90%))`,
                    color: C.green,
                    border: `1px solid color-mix(in srgb, ${C.green}, transparent 65%)`,
                    fontFamily: "'Syne', sans-serif",
                  }}
              >
                {initials}
              </button>
            </div>
          </header>

          {/* Mobile Bottom Nav */}
          <div
            className="lg:hidden fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around px-2 py-2"
            style={{ background: C.navBg, borderTop: `1px solid ${C.border}` }}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => changeTab(item.id)}
                className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all"
                style={{
                  color: activeTab === item.id ? C.green : C.muted,
                  background:
                    activeTab === item.id
                      ? C.hover
                      : 'transparent',
                }}
              >
                {item.icon}
                <span className="text-[10px] font-medium">{item.label}</span>
                {item.id === 'chat' && unreadMsgs > 0 && (
                  <span 
                    className="absolute top-1 right-2 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ background: C.green, color: '#051005' }}
                  >
                    {unreadMsgs}
                  </span>
                )}
                {item.id === 'cart' && itemCount > 0 && (
                  <span 
                    className="absolute top-1 right-2 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ background: C.gold, color: '#051005' }}
                  >
                    {itemCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <BuyerOverviewTab
                    displayName={displayName}
                    onTabChange={changeTab}
                    orders={ordersData as any[]}
                    wishlist={wishlistData as any[]}
                  />
                </motion.div>
              )}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <BuyerOrdersTab />
                </motion.div>
              )}
              {activeTab === 'saved' && (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <BuyerSavedTab />
                </motion.div>
              )}
               {activeTab === 'explore' && (
                <motion.div
                  key="explore"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <BuyerExploreTab onChat={(id) => {
                    setActiveThreadId(id)
                    setActiveTab('chat')
                  }} />
                </motion.div>
              )}
               {activeTab === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <BuyerChatTab activeThreadId={activeThreadId} />
                </motion.div>
              )}
              {activeTab === 'cart' && (
                <motion.div
                  key="cart"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <BuyerCartTab />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <BuyerNotificationsPanel
            onClose={() => setShowNotifications(false)}
            notifications={notifications.map(n => ({
              ...n,
              time: n.createdAt?.toDate ? n.createdAt.toDate().toLocaleTimeString() : 'Just now'
            })) as any}
            onMarkRead={handleMarkRead}
            onClearAll={handleClearAll}
          />
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <BuyerSettingsModal
            onClose={() => setShowSettings(false)}
            displayName={displayName}
            email={currentUser?.emailAddresses?.[0]?.emailAddress || ''}
            initials={initials}
            onSignOut={handleSignOut}
            ordersCount={ordersData?.length || 0}
            savedCount={wishlistData?.length || 0}
            profile={profile}
          />
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {activeThread && currentUser && (
          <ChatPanel
            thread={activeThread}
            currentUserId={currentUser.id}
            onClose={() => setActiveThreadId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
