import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  Heart,
  GitCompare,
  X,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
} from 'lucide-react'
import { ProduceCard, type ProduceItem } from './ProduceCard'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllListingsFn, toggleWishlistFn, getWishlistFn } from '@/server/functions/listings'
import { getOrCreateThreadFn } from '@/server/functions/messages'
import { useCart } from '@/context/CartContext'
import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'


// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: 'var(--fd-bg)',
  bg2: 'var(--fd-bg-2)',
  surface: 'var(--fd-surface)',
  surface2: 'var(--fd-surface-2)',
  border: 'var(--fd-border)',
  borderGlow: 'var(--fd-border-mid)',
  text: 'var(--fd-text)',
  textSub: 'var(--fd-text-2)',
  textMuted: 'var(--fd-text-muted)',
  green: 'var(--fd-green)',
  greenDark: 'var(--fd-green-dark)',
  greenGlow: 'var(--fd-green-bg)',
  amber: 'var(--fd-gold)',
  amberGlow: 'var(--fd-gold-bg)',
  red: 'var(--fd-red)',
  redGlow: 'var(--fd-red-bg)',
  blue: 'var(--fd-blue)',
  blueGlow: 'var(--fd-blue-bg)',
  hover: 'var(--fd-hover-bg)',
  active: 'var(--fd-active-bg)',
}



const CATEGORIES = [
  'All',
  'Vegetables',
  'Fruits',
  'Greens',
  'Root Veg',
  'Citrus',
  'Eggs',
]
const SORT_OPTIONS = [
  'Most Popular',
  'Price: Low–High',
  'Price: High–Low',
  'Freshest First',
  'Nearest First',
]

type ViewMode = 'card' | 'favourite' | 'compare'


interface ViewToggleProps {
  mode: ViewMode
  active: ViewMode
  label: string
  icon: React.ReactNode
  count?: number
  onClick: () => void
}

function ViewToggle({
  mode,
  active,
  label,
  icon,
  count,
  onClick,
}: ViewToggleProps) {
  const isActive = mode === active
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.93 }}
      className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: isActive
          ? mode === 'favourite'
            ? C.redGlow
            : mode === 'compare'
              ? C.blueGlow
              : C.amberGlow
          : C.surface,
        border: isActive
          ? mode === 'favourite'
            ? `1px solid color-mix(in srgb, ${C.red}, transparent 60%)`
            : mode === 'compare'
              ? `1px solid color-mix(in srgb, ${C.blue}, transparent 60%)`
              : `1px solid color-mix(in srgb, ${C.amber}, transparent 60%)`
          : `1px solid ${C.border}`,
        color: isActive
          ? mode === 'favourite'
            ? C.red
            : mode === 'compare'
              ? C.blue
              : C.amber
          : C.textMuted,
      }}
    >
      {icon}
      <span className="hidden xs:inline">{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className="ml-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
          style={{
            background: isActive
              ? mode === 'favourite'
                ? C.red
                : mode === 'compare'
                  ? C.blue
                  : C.amber
              : 'var(--fd-bg-2)',
            color: isActive ? '#fff' : C.textMuted,
          }}
        >
          {count}
        </span>
      )}
    </motion.button>
  )
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────
function CartDrawer({
  cartItems,
  onClose,
  onUpdateQty,
  onRemove,
}: {
  cartItems: any[]
  onClose: () => void
  onUpdateQty: (id: string, qty: number) => void
  onRemove: (id: string) => void
}) {
  const subtotal = cartItems.reduce((s, e) => s + e.price * e.quantity, 0)
  const platformFee = subtotal * 0.05
  const total = subtotal + platformFee

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex justify-end"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        className="w-full max-w-sm h-full flex flex-col shadow-2xl"
        style={{
          background: 'var(--fd-surface)',
          borderLeft: '1px solid var(--fd-border)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 sm:p-5"
          style={{
            background: 'var(--fd-section-bg)',
            borderBottom: '1px solid var(--fd-border)',
          }}
        >
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" style={{ color: C.amber }} />
            <span
              className="text-base font-bold"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: 'var(--fd-text)',
              }}
            >
              Your Cart
            </span>
            {cartItems.length > 0 && (
              <span
                className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                style={{ background: C.amber, color: '#ffffff' }}
              >
                {cartItems.reduce((s, e) => s + e.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg"
            style={{ color: 'var(--fd-text-muted)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full pb-20 text-center">
              <div className="text-5xl mb-4">🛒</div>
              <p
                className="font-semibold mb-1"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: 'var(--fd-text-2)',
                }}
              >
                Your cart is empty
              </p>
              <p
                className="text-sm"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: 'var(--fd-text-muted)',
                }}
              >
                Add fresh produce from the marketplace to get started.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 40 }}
                className="flex gap-3 p-3 rounded-2xl"
                style={{
                  background: 'var(--fd-surface-2)',
                  border: '1px solid var(--fd-border)',
                }}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: 'var(--fd-text)',
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    className="text-xs mb-2"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: 'var(--fd-text-muted)',
                    }}
                  >
                    {item.farmerName} · ₹{item.price.toFixed(2)}/
                    {item.unit}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          item.quantity <= 1
                            ? onRemove(item.id)
                            : onUpdateQty(item.id, item.quantity - 1)
                        }
                        className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
                        style={{
                          border: '1px solid var(--fd-border)',
                          color: 'var(--fd-text-2)',
                          background: 'var(--fd-surface)',
                        }}
                      >
                        {item.quantity <= 1 ? (
                          <Trash2 className="w-3 h-3" style={{ color: C.red }} />
                        ) : (
                          <Minus className="w-3 h-3" />
                        )}
                      </button>
                      <span
                        className="w-6 text-center text-sm font-bold"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          color: 'var(--fd-text)',
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQty(
                            item.id,
                            item.quantity + 1,
                          )
                        }
                        className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
                        style={{
                          border: '1px solid var(--fd-border)',
                          color: 'var(--fd-text-2)',
                          background: 'var(--fd-surface)',
                        }}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span
                      className="text-sm font-bold"
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          color: C.amber,
                        }}
                    >
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div
            className="p-3 sm:p-4"
            style={{
              background: 'var(--fd-section-bg)',
              borderTop: '1px solid var(--fd-border)',
            }}
          >
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between text-xs">
                <span
                  style={{
                    color: 'var(--fd-text-muted)',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Subtotal
                </span>
                <span
                  style={{
                    color: 'var(--fd-text-2)',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span
                  style={{
                    color: 'var(--fd-text-muted)',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Platform fee (5%)
                </span>
                <span
                  style={{
                    color: C.amber,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  ₹{platformFee.toFixed(2)}
                </span>
              </div>
              <div
                className="h-px my-2"
                style={{ background: 'var(--fd-border)' }}
              />
              <div className="flex justify-between">
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: 'var(--fd-text)',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Total (Escrow)
                </span>
                <span
                  className="text-base font-bold"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: C.green,
                  }}
                >
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>
            <button
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold hover:shadow-lg transition-all"
              style={{
                background: `linear-gradient(135deg, ${C.amber}, ${C.amberGlow})`,
                color: '#ffffff',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export function MarketGrid() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('Most Popular')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [favourites, setFavourites] = useState<Set<string>>(new Set())
  const [compareList, setCompareList] = useState<Set<string>>(new Set())
  const [showCart, setShowCart] = useState(false)
  const { items: cartItems, addToCart, updateQuantity, removeFromCart, itemCount: totalCartQty } = useCart()

  const { data: wishlistData = [] } = useQuery({
    queryKey: ['buyerWishlist'],
    queryFn: () => getWishlistFn()
  })

  // Sync favourites with wishlistData
  useEffect(() => {
    if (wishlistData.length > 0) {
      setFavourites(new Set(wishlistData.map((l: any) => l.id)))
    }
  }, [wishlistData])


  const queryClient = useQueryClient()
  const toggleWishlist = useMutation({
    mutationFn: (id: string) => (toggleWishlistFn as any)({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyerWishlist'] })
    }
  })

  const handleToggleFavourite = (id: string) => {
    toggleWishlist.mutate(id)
    setFavourites((prev) => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  const handleToggleCompare = (id: string) =>
    setCompareList((prev) => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.size < 4 && n.add(id)
      return n
    })

  const handleAddToCart = (item: ProduceItem, qty: number) => {
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        emoji: item.practiceIcon,
        imageUrl: item.image,
        farmerId: '', // Ideally we have this
        farmerName: item.farmer,
        unit: item.unit
      })
    }
  }

  const handleUpdateCartQty = (id: string, qty: number) => {
    // Delta needed for updateQuantity
    const item = cartItems.find(i => i.id === id)
    if (item) {
      updateQuantity(id, qty - item.quantity)
    }
  }

  const handleRemoveFromCart = (id: string) => removeFromCart(id)

  const router = useRouter()
  const startChatMutation = useMutation({
    mutationFn: (data: any) => getOrCreateThreadFn({ data }),
    onSuccess: (res: any) => {
      toast.success('Chat initiated!')
      router.navigate({ to: '/buyer', search: { tab: 'chat', threadId: res.id } as any })
    },
    onError: () => toast.error('Please sign in to chat with farmers')
  })

  const handleStartChat = (item: any) => {
    if (!item.farmerId) {
      toast.error('Cannot chat: Farmer information missing')
      return
    }
    startChatMutation.mutate({
      farmerId: item.farmerId,
      listingId: item.id,
      farmerName: item.farmer,
      productName: item.name,
      productEmoji: item.emoji || '📦'
    })
  }

  const { data: serverListings } = useQuery({
    queryKey: ['allListings'],
    queryFn: () => getAllListingsFn()
  })

  const getCategoryPlaceholder = (category: string, name: string) => {
    const n = name.toLowerCase()
    if (n.includes('tomato')) return 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=600&q=75'
    if (n.includes('carrot')) return 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&q=75'
    if (n.includes('corn')) return 'https://images.unsplash.com/photo-1634467524884-897d0af5e104?w=600&q=75'
    if (n.includes('spinach') || n.includes('green')) return 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=75'
    if (n.includes('apple')) return 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?w=600&q=75'
    if (n.includes('lemon') || n.includes('citrus')) return 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=600&q=75'
    if (n.includes('potato')) return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=75'
    if (n.includes('egg')) return 'https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?w=600&q=75'
    if (n.includes('pepper')) return 'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?w=600&q=75'
    if (n.includes('blueberry') || n.includes('berry')) return 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=600&q=75'
    
    switch (category) {
      case 'Vegetables': return 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&q=75'
      case 'Fruits': return 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&q=75'
      case 'Greens': return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=75'
      case 'Root Veg': return 'https://images.unsplash.com/photo-1444858291040-589716cc504c?w=600&q=75'
      case 'Eggs': return 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=600&q=75'
      default: return 'https://images.unsplash.com/photo-1595351298020-038700609878?w=600&q=75'
    }
  }

  const mergedProduce: ProduceItem[] = [
    ...(serverListings || []).map((l: any) => ({
      id: l.id,
      name: l.name,
      farmer: l.farmerName || 'Verified Farmer',
      farm: l.practice === 'Organic' ? 'Certified Organic' : (l.practice || 'Local Harvest'),
      location: l.delivery || 'Local Delivery',
      price: parseFloat(l.price) || 0,
      unit: l.priceUnit || 'item',
      image: l.imageUrl || getCategoryPlaceholder(l.category || '', l.name),
      category: l.category || 'Vegetables',
      farmerId: l.farmerId || '',
      practice: l.practice || 'Sustainable',
      practiceIcon: l.emoji || '🌱',
      freshnessHours: 24,
      deliveryDays: 1,
      rating: 5.0,
      reviews: l.orders || 0,
      inStock: parseInt(l.stock) || 0,
      isOrganic: l.practice === 'Organic',
    }))
  ]



  const allSorted = [...mergedProduce].sort((a, b) => {
    if (sortBy === 'Price: Low–High') return a.price - b.price
    if (sortBy === 'Price: High–Low') return b.price - a.price
    if (sortBy === 'Freshest First') return a.freshnessHours - b.freshnessHours
    if (sortBy === 'Most Popular') return b.reviews - a.reviews
    return 0
  })

  const cardFiltered = allSorted.filter((item) => {
    const matchCat =
      activeCategory === 'All' || item.category === activeCategory
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  const favouriteFiltered = allSorted.filter((item) => favourites.has(item.id))
  const compareFiltered = allSorted.filter((item) => compareList.has(item.id))

  const filtered =
    viewMode === 'favourite'
      ? favouriteFiltered
      : viewMode === 'compare'
        ? compareFiltered
        : cardFiltered

  const emptyStateConfig = {
    card: {
      icon: '🌱',
      title: 'No produce found',
      subtitle: 'Try a different filter or search term.',
      action: null,
    },
    favourite: {
      icon: '❤️',
      title: 'No favourites yet',
      subtitle: 'Tap the heart on any product card to save it here.',
      action: {
        label: 'Browse All Products',
        onClick: () => setViewMode('card'),
      },
    },
    compare: {
      icon: '🔀',
      title: 'No items in compare list',
      subtitle: 'Tap the Compare button on any product card to add items here.',
      action: {
        label: 'Browse All Products',
        onClick: () => setViewMode('card'),
      },
    },
  }

  const emptyState = emptyStateConfig[viewMode]

  return (
    <section
      id="market"
      className="py-16 sm:py-24 relative overflow-hidden"
      style={{ background: 'var(--fd-bg-2)' }}
    >
      {/* Top border accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            `linear-gradient(to right, transparent, ${C.amber}, transparent)`,
          opacity: 0.4,
        }}
      />

      {/* Soft emerald tint patch */}
      <div
        className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background:
            `radial-gradient(ellipse at 50% 0%, color-mix(in srgb, ${C.green}, transparent 96%) 0%, transparent 70%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              border: `1px solid color-mix(in srgb, ${C.green}, transparent 75%)`,
              background: C.greenGlow,
              color: C.green,
            }}
          >
            🌾 Live Marketplace
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-black mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.75rem, 5vw, 3rem)',
              color: 'var(--fd-text)',
            }}
          >
            Today's Fresh Harvest
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto text-sm sm:text-base"
            style={{
              color: 'var(--fd-text-muted)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Sourced within 250 kms · Updated hourly · Chat directly with
            farmers
          </motion.p>
        </div>

        {/* Search + Sort + Cart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-8"
        >
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: C.green }}
            />
            <input
              type="text"
              placeholder="Search produce, farmer, or mandi location…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: 'var(--fd-input-bg)',
                border: '1px solid var(--fd-input-border)',
                color: 'var(--fd-text)',
              }}
            />
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1 sm:flex-none">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="w-full sm:w-auto flex items-center gap-2 px-3 sm:px-4 py-3 rounded-xl text-sm transition-colors"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: 'var(--fd-input-bg)',
                  border: '1px solid var(--fd-input-border)',
                  color: 'var(--fd-text-2)',
                }}
              >
                <SlidersHorizontal
                  className="w-4 h-4 shrink-0"
                  style={{ color: C.green }}
                />
                <span className="truncate text-left">{sortBy}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 shrink-0 transition-transform ${showSortMenu ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {showSortMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-2 w-52 rounded-xl shadow-2xl z-30 overflow-hidden"
                    style={{
                      background: 'var(--fd-modal-bg)',
                      border: '1px solid var(--fd-border)',
                      boxShadow: `0 8px 32px color-mix(in srgb, ${C.green}, transparent 88%)`,
                    }}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSortBy(opt)
                          setShowSortMenu(false)
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[var(--fd-section-bg)]"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          color:
                            sortBy === opt ? C.amber : 'var(--fd-text-2)',
                          background:
                            sortBy === opt
                              ? `color-mix(in srgb, ${C.amber}, transparent 94%)`
                              : 'transparent',
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart button */}
            <motion.button
              onClick={() => setShowCart(true)}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shrink-0"
              style={{
                background:
                  totalCartQty > 0
                    ? `linear-gradient(135deg, ${C.amber}, ${C.amberGlow})`
                    : 'var(--fd-input-bg)',
                border:
                  totalCartQty > 0
                    ? '1px solid transparent'
                    : '1px solid var(--fd-input-border)',
                color: totalCartQty > 0 ? '#ffffff' : 'var(--fd-text-2)',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              {totalCartQty > 0 ? (
                <span className="hidden xs:inline">Cart ({totalCartQty})</span>
              ) : (
                <span className="hidden xs:inline">Cart</span>
              )}
              {totalCartQty > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-lg"
                  style={{ background: '#16a34a' }}
                >
                  {totalCartQty}
                </motion.span>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Category pills + View toggles */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-between gap-3 mb-8 sm:mb-10 flex-wrap"
        >
          <div className="flex gap-1.5 sm:gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  setViewMode('card')
                }}
                whileTap={{ scale: 0.95 }}
                className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background:
                    activeCategory === cat && viewMode === 'card'
                      ? '#16a34a'
                      : 'var(--fd-surface)',
                  color:
                    activeCategory === cat && viewMode === 'card'
                      ? '#ffffff'
                      : 'var(--fd-text-muted)',
                  border:
                    activeCategory === cat && viewMode === 'card'
                      ? '1px solid #16a34a'
                      : '1px solid var(--fd-border)',
                  boxShadow:
                    activeCategory === cat && viewMode === 'card'
                      ? '0 4px 12px rgba(16,163,74,0.25)'
                      : 'none',
                }}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <ViewToggle
              mode="card"
              active={viewMode}
              label="Card"
              icon={<LayoutGrid className="w-3 h-3" />}
              onClick={() => setViewMode('card')}
            />
            <ViewToggle
              mode="favourite"
              active={viewMode}
              label="Saved"
              icon={
                <Heart
                  className="w-3 h-3"
                  fill={viewMode === 'favourite' ? '#ef4444' : 'none'}
                />
              }
              count={favourites.size}
              onClick={() => setViewMode('favourite')}
            />
            <ViewToggle
              mode="compare"
              active={viewMode}
              label="Compare"
              icon={<GitCompare className="w-3 h-3" />}
              count={compareList.size}
              onClick={() => setViewMode('compare')}
            />
          </div>
        </motion.div>

        {/* View mode banners */}
        <AnimatePresence mode="wait">
          {viewMode === 'favourite' && (
            <motion.div
              key="fav-banner"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 p-3 sm:p-4 rounded-2xl flex items-center justify-between gap-3 flex-wrap"
              style={{
                background: 'rgba(239,68,68,0.05)',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              <div className="flex items-center gap-2">
                <Heart
                  className="w-4 h-4"
                  fill="#ef4444"
                  style={{ color: '#ef4444' }}
                />
                <span
                  className="text-sm"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: 'var(--fd-text-2)',
                  }}
                >
                  {favourites.size === 0
                    ? 'Heart any product to save it here'
                    : `${favourites.size} item${favourites.size > 1 ? 's' : ''} saved`}
                </span>
              </div>
              {favourites.size > 0 && (
                <button
                  onClick={() => setFavourites(new Set())}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </motion.div>
          )}
          {viewMode === 'compare' && (
            <motion.div
              key="cmp-banner"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 p-3 sm:p-4 rounded-2xl flex items-center justify-between gap-3 flex-wrap"
              style={{
                background: 'rgba(59,130,246,0.05)',
                border: '1px solid rgba(59,130,246,0.2)',
              }}
            >
              <div className="flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-blue-400" />
                <span
                  className="text-sm"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: 'var(--fd-text-2)',
                  }}
                >
                  {compareList.size === 0
                    ? 'Use the Compare button on cards to add items (max 4)'
                    : `${compareList.size} item${compareList.size > 1 ? 's' : ''} in compare`}
                </span>
              </div>
              {compareList.size > 0 && (
                <button
                  onClick={() => setCompareList(new Set())}
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-600 transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={`${activeCategory}-${searchQuery}-${viewMode}-${favourites.size}-${compareList.size}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
            >
              {filtered.map((item, i) => (
                <ProduceCard
                  key={item.id}
                  item={item}
                  index={i}
                  isFavourite={favourites.has(item.id)}
                  isInCompare={compareList.has(item.id)}
                  compareMode={false}
                  cartQty={
                    cartItems.find((e) => e.id === item.id)?.quantity ?? 0
                  }
                  onToggleFavourite={() => handleToggleFavourite(item.id)}
                  onToggleCompare={() => handleToggleCompare(item.id)}
                  onAddToCart={(qty) => handleAddToCart(item, qty)}
                  onChat={() => handleStartChat(item)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={`empty-${viewMode}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 sm:py-20"
            >
              <div className="text-6xl mb-4">{emptyState.icon}</div>
              <p
                className="text-lg font-semibold mb-2"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: 'var(--fd-text-2)',
                }}
              >
                {emptyState.title}
              </p>
              <p
                className="text-sm mb-6"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: 'var(--fd-text-muted)',
                }}
              >
                {emptyState.subtitle}
              </p>
              {emptyState.action && (
                <button
                  onClick={emptyState.action.onClick}
                  className="px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    border: '1px solid var(--fd-border-mid)',
                    color: '#16a34a',
                    background: '#dcfce7',
                  }}
                >
                  {emptyState.action.label}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load more */}
        {viewMode === 'card' && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10 sm:mt-12"
          >
            <button
              className="px-6 sm:px-8 py-3 rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                border: '1px solid rgba(16,163,74,0.3)',
                color: '#16a34a',
                background: '#f0fdf4',
              }}
            >
              Load More Produce
            </button>
          </motion.div>
        )}
      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {showCart && (
          <CartDrawer
            cartItems={cartItems}
            onClose={() => setShowCart(false)}
            onUpdateQty={handleUpdateCartQty}
            onRemove={handleRemoveFromCart}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
