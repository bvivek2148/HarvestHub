'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate, Link } from '@tanstack/react-router'
import {
  BarChart3,
  Package,
  TrendingUp,
  MessageSquare,
  LogOut,
  Settings,
  Bell,
  Menu,
  LayoutDashboard,
  Sprout,
} from 'lucide-react'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFarmerListingsFn, createListingFn, updateListingFn, deleteListingFn } from '@/server/functions/listings'
import { getFarmerOrdersFn, updateOrderStatusFn } from '@/server/functions/orders'
import { getCurrentUserProfileFn } from '@/server/functions/users'

import {
  C,
  type Listing,
  type Order,
  type OrderStatus,
} from './farmer/FarmerTypes'
import { FarmerOverviewTab } from './farmer/FarmerOverviewTab'
import { FarmerListingsTab } from './farmer/FarmerListingsTab'
import { FarmerOrdersTab } from './farmer/FarmerOrdersTab'
import { FarmerAnalyticsTab } from './farmer/FarmerAnalyticsTab'
import { FarmerChatTab } from './farmer/FarmerChatTab'
import { FarmerSettingsModal } from './farmer/FarmerSettingsModal'
import { FarmerNotificationsPanel } from './farmer/FarmerNotificationsPanel'

type Tab = 'overview' | 'listings' | 'orders' | 'analytics' | 'chat'

import { useNotifications } from '@/hooks/use-notifications'
import { useChatThreads } from '@/hooks/use-firestore-chat'

export function FarmerDashboard() {
  const { currentUser, signOut } = useAuth()
  const navigate = useNavigate()
  const { notifications, unreadCount: unreadNotifs, markAsRead, markAllAsRead } = useNotifications()

  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const queryClient = useQueryClient()

  const { data: listingsData = [] } = useQuery({
    queryKey: ['farmerListings'],
    queryFn: () => getFarmerListingsFn(),
  })
  
  useEffect(() => {

  }, [listingsData]);
  const { data: ordersData } = useQuery({
    queryKey: ['farmerOrders'],
    queryFn: () => getFarmerOrdersFn()
  })
  const { data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => getCurrentUserProfileFn()
  })

  // Fallback to initial if empty array? No, just use empty array if undefined.
  // Data initialization - start with empty array if no data from DB
  const listings = (listingsData as Listing[]) || []
  const orders = (ordersData as Order[]) || []
  const [showSettings, setShowSettings] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [localDisplayName, setLocalDisplayName] = useState<string | null>(null)

  const notifRef = useRef<HTMLDivElement>(null)

  const displayName =
    (localDisplayName ?? currentUser?.name) ||
    currentUser?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ||
    'Farmer'
  const initials = displayName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const { threads } = useChatThreads()
  const unreadMsgs = threads.reduce((s, t) => s + (t.unreadCount?.[currentUser?.id || ''] || 0), 0)
  const pendingOrders = orders.filter((o) => o.status === 'pending').length

  const handleSignOut = async () => {
    await signOut()
    await navigate({ to: '/' })
  }

  const createListing = useMutation({
    mutationFn: (data: any) => createListingFn({ data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['farmerListings'] })
  })

  const updateListing = useMutation({
    mutationFn: (data: any) => updateListingFn({ data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['farmerListings'] })
  })

  const deleteListing = useMutation({
    mutationFn: (data: any) => deleteListingFn({ data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['farmerListings'] })
  })

  const updateOrder = useMutation({
    mutationFn: (data: any) => updateOrderStatusFn({ data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['farmerOrders'] })
  })

  const handleSaveListing = async (l: Listing) => {
    try {
      if (!l.id || l.id.startsWith('new-') || l.id.startsWith('l')) {
        await createListing.mutateAsync({
          name: l.name,
          description: l.description || '',
          price: l.price,
          priceUnit: l.priceUnit,
          stock: l.stock,
          stockUnit: l.stockUnit,
          emoji: l.emoji,
          category: l.category,
          status: l.status,
          freshness: l.freshness,
          practice: l.practice,
          delivery: l.delivery,
          imageUrl: l.imageUrl,
          farmerName: displayName,
        })
        toast.success('Listing created!')
      } else {
        await updateListing.mutateAsync({ ...l, farmerName: displayName })
        toast.success('Listing updated!')
      }
    } catch (error: any) {
      console.error('Failed to save listing:', error)
      toast.error(`Error: ${error.message || 'Could not save listing'}`)
    }
  }

  const handleDeleteListing = async (id: string) => {
    await deleteListing.mutateAsync({ id })
    toast.success('Listing removed.')
  }

  const handleUpdateOrderStatus = async (id: string, status: OrderStatus) => {
    await updateOrder.mutateAsync({ id, status })
    toast.success(`Order marked as ${status}`)
  }

  const handleMarkNotifRead = (id: string) => markAsRead(id)
  const handleClearNotifs = () => markAllAsRead()

  const NAV_ITEMS: {
    id: Tab
    icon: React.ReactNode
    label: string
    badge?: number
  }[] = [
    {
      id: 'overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
      label: 'Overview',
    },
    {
      id: 'listings',
      icon: <Package className="w-4 h-4" />,
      label: 'My Listings',
      badge: listings.length,
    },
    {
      id: 'orders',
      icon: <TrendingUp className="w-4 h-4" />,
      label: 'Orders',
      badge: pendingOrders,
    },
    {
      id: 'analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      label: 'Analytics',
    },
    {
      id: 'chat',
      icon: <MessageSquare className="w-4 h-4" />,
      label: 'Messages',
      badge: unreadMsgs,
    },
  ]

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <Link
        to="/"
        className="h-16 flex items-center gap-2.5 px-5 hover:opacity-80 transition-opacity group"
        style={{ borderBottom: `1px solid ${C.border}` }}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="relative w-8 h-8">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: 'linear-gradient(135deg, #d4a017, #8a6310)' }}
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

      {/* Farmer Info */}
      <div
        className="px-4 py-4"
        style={{ borderBottom: `1px solid ${C.border}` }}
      >
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: C.surface2, border: `1px solid ${C.border}` }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(74,222,128,0.3), rgba(74,222,128,0.08))',
              color: C.green,
              border: '2px solid rgba(74,222,128,0.3)',
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="text-sm font-bold truncate"
              style={{ color: C.text }}
            >
              {displayName}
            </div>
            <div className="text-xs" style={{ color: C.green }}>
              🌾 Verified Farmer
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id)
              setSidebarOpen(false)
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm"
            style={{
              background:
                activeTab === item.id ? 'rgba(74,222,128,0.1)' : 'transparent',
              color: activeTab === item.id ? C.green : C.muted,
              border: `1px solid ${activeTab === item.id ? 'rgba(74,222,128,0.25)' : 'transparent'}`,
              fontWeight: activeTab === item.id ? 600 : 400,
            }}
          >
            {item.icon}
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && item.badge > 0 ? (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background:
                    activeTab === item.id
                      ? C.green + '30'
                      : 'rgba(255,255,255,0.08)',
                  color: activeTab === item.id ? C.green : C.muted,
                }}
              >
                {item.badge}
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div
        className="px-3 py-4 space-y-1"
        style={{ borderTop: `1px solid ${C.border}` }}
      >
        <button
          onClick={() => {
            setShowSettings(true)
            setSidebarOpen(false)
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-white/[0.04]"
          style={{ color: C.muted }}
        >
          <Settings className="w-4 h-4" />
          Settings & Profile
        </button>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-red-950/30"
          style={{ color: C.red }}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </>
  )

  return (
    <div
      className="min-h-screen"
      style={{ background: C.bg, fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          className="w-64 shrink-0 hidden lg:flex flex-col"
          style={{ background: C.navBg, borderRight: `1px solid ${C.border}` }}
        >
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 lg:hidden"
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(4px)',
                }}
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed left-0 top-0 bottom-0 w-64 z-50 flex flex-col lg:hidden"
                style={{
                  background: C.navBg,
                  borderRight: `1px solid ${C.border}`,
                }}
              >
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header
            className="h-16 flex items-center justify-between px-4 lg:px-6 shrink-0"
            style={{
              background: C.navBg,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 rounded-xl transition-colors"
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
                <p
                  className="text-xs hidden sm:block"
                  style={{ color: C.green }}
                >
                  🌾 {displayName} · Verified Farmer
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifications((v) => !v)}
                  className="relative p-2 rounded-xl transition-all"
                  style={{
                    color: C.muted,
                    background: showNotifications
                      ? 'rgba(74,222,128,0.08)'
                      : 'transparent',
                  }}
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifs > 0 && (
                    <span
                      className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                      style={{ background: C.green, color: '#051005' }}
                    >
                      {unreadNotifs}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {showNotifications && (
                    <FarmerNotificationsPanel
                      notifications={notifications.map(n => ({
                        ...n,
                        time: n.createdAt?.toDate ? n.createdAt.toDate().toLocaleTimeString() : 'Just now'
                      })) as any}
                      onMarkRead={handleMarkNotifRead}
                      onClearAll={handleClearNotifs}
                      onClose={() => setShowNotifications(false)}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Avatar / Settings */}
              <button
                onClick={() => setShowSettings(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-transform hover:scale-105"
                style={{
                  background:
                    'linear-gradient(135deg,rgba(74,222,128,0.3),rgba(74,222,128,0.1))',
                  color: C.green,
                  border: '1px solid rgba(74,222,128,0.4)',
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {initials}
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <FarmerOverviewTab
                    displayName={displayName}
                    listings={listings}
                    orders={orders}
                    messages={threads.map(t => ({
                      id: t.id,
                      buyer: t.buyerName,
                      product: t.productName || 'General Inquiry',
                      lastMsg: t.lastMessage,
                      time: t.updatedAt?.toDate ? t.updatedAt.toDate().toLocaleTimeString() : 'Just now',
                      unread: t.unreadCount?.[currentUser?.id || ''] || 0,
                      emoji: t.productEmoji || '💬'
                    }))}
                    onTabChange={(t) => setActiveTab(t as Tab)}
                    onAddListing={() => setActiveTab('listings')}
                  />
                </motion.div>
              )}
              {activeTab === 'listings' && (
                <motion.div
                  key="listings"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <FarmerListingsTab
                    listings={listings}
                    onSave={handleSaveListing}
                    onDelete={handleDeleteListing}
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
                  <FarmerOrdersTab
                    orders={orders}
                    onUpdateStatus={handleUpdateOrderStatus}
                  />
                </motion.div>
              )}
              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <FarmerAnalyticsTab listings={listings} orders={orders} />
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
                  <FarmerChatTab />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Bottom Nav */}
          <nav
            className="lg:hidden flex items-center justify-around py-2 shrink-0"
            style={{ background: C.navBg, borderTop: `1px solid ${C.border}` }}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all relative"
                style={{ color: activeTab === item.id ? C.green : C.muted }}
              >
                {item.icon}
                <span className="text-[9px] font-semibold">{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span
                    className="absolute top-0 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold"
                    style={{ background: C.green, color: '#051005' }}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showSettings && (
          <FarmerSettingsModal
            user={{ 
              name: displayName, 
              email: currentUser?.emailAddresses?.[0]?.emailAddress || '',
              ...profile 
            }}
            onClose={() => setShowSettings(false)}
            onNameUpdated={(n) => {
              setLocalDisplayName(n)
              queryClient.invalidateQueries({ queryKey: ['userProfile'] })
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
