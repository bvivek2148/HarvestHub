import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Link } from '@tanstack/react-router'
import { Search, MapPin, Star, ShoppingCart, ArrowRight, Loader2, MessageSquare } from 'lucide-react'
import { C, type FarmerProfile } from './BuyerTypes'
import { toast } from 'sonner'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getAllListingsFn } from '@/server/functions/listings'
import { getOrCreateThreadFn } from '@/server/functions/messages'

function FarmerCard({
  farmer,
  index,
}: {
  farmer: FarmerProfile
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="rounded-2xl p-5 cursor-pointer group"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform"
          style={{ background: 'rgba(74,222,128,0.08)' }}
        >
          {farmer.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="text-sm font-bold"
            style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
          >
            {farmer.name}
          </div>
          <div
            className="flex items-center gap-1 mt-0.5 text-xs"
            style={{ color: C.muted }}
          >
            <MapPin className="w-3 h-3" />
            {farmer.location} · {farmer.distance}
          </div>
          <span
            className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(74,222,128,0.1)',
              color: C.green,
              border: '1px solid rgba(74,222,128,0.2)',
            }}
          >
            {farmer.badge}
          </span>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-0.5 text-xs">
            <Star
              className="w-3.5 h-3.5"
              fill={C.gold}
              style={{ color: C.gold }}
            />
            <span className="font-bold" style={{ color: C.text }}>
              {farmer.rating}
            </span>
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: C.muted }}>
            {farmer.reviews} reviews
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {farmer.products.map((p) => (
          <span
            key={p}
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{
              background: C.surface2,
              color: C.muted,
              border: `1px solid ${C.border}`,
            }}
          >
            {p}
          </span>
        ))}
      </div>
      <button
        onClick={() => toast.success(`Viewing ${farmer.name}'s shop!`)}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]"
        style={{
          background: 'rgba(74,222,128,0.1)',
          color: C.green,
          border: '1px solid rgba(74,222,128,0.25)',
        }}
      >
        Visit Farm Shop <ArrowRight className="w-3 h-3" />
      </button>
    </motion.div>
  )
}

interface Props {
  onChat: (threadId: string) => void
}

export function BuyerExploreTab({ onChat }: Props) {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [view, setView] = useState<'produce' | 'farmers'>('produce')

  const CATEGORIES = [
    'All',
    'Vegetables',
    'Fruits',
    'Grains',
    'Dairy',
    'Pantry',
    'Meat',
    'Other'
  ]

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['listings', activeCategory, debouncedSearch],
    queryFn: () => (getAllListingsFn as any)({ data: { category: activeCategory, searchTerm: debouncedSearch } }),
    enabled: view === 'produce'
  })

  const startChatMutation = useMutation({
    mutationFn: (data: any) => getOrCreateThreadFn({ data }),
    onSuccess: (res) => {
      onChat(res.id)
    }
  })

  const handleStartChat = (item: any) => {
    startChatMutation.mutate({
      farmerId: item.farmerId,
      farmerName: item.farmerName || 'Farmer',
      productName: item.name,
      productEmoji: item.emoji
    })
  }

  const farmers: FarmerProfile[] = []
  const filteredFarmers = farmers.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.specialty.toLowerCase().includes(search.toLowerCase()) ||
      f.location.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2
          className="font-bold"
          style={{
            color: C.text,
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
          }}
        >
          Explore
        </h2>
        <div
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{ background: C.surface2, border: `1px solid ${C.border}` }}
        >
          {(['produce', 'farmers'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
              style={{
                background: view === v ? C.green + '20' : 'transparent',
                color: view === v ? C.green : C.muted,
                border:
                  view === v
                    ? `1px solid ${C.green}40`
                    : '1px solid transparent',
              }}
            >
              {v}
            </button>
          ))}
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
          placeholder={
            view === 'produce'
              ? 'Search produce or farms…'
              : 'Search farmers or locations…'
          }
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            color: C.text,
          }}
        />
      </div>

      {/* Category Pills (produce view only) */}
      {view === 'produce' && (
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background:
                  activeCategory === cat ? C.green + '20' : C.surface2,
                color: activeCategory === cat ? C.green : C.muted,
                border:
                  activeCategory === cat
                    ? `1px solid ${C.green}40`
                    : `1px solid ${C.border}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Produce Grid */}
      {view === 'produce' && (
        <div className="min-h-[400px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ color: C.muted }}>
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.green }} />
              <p className="text-sm font-medium">Fetching fresh produce…</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">🚜</div>
              <h3 className="text-base font-bold mb-1" style={{ color: C.text }}>No produce found</h3>
              <p className="text-xs" style={{ color: C.muted }}>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {listings.map((item: any, i: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="rounded-2xl overflow-hidden cursor-pointer group"
                  style={{ background: C.surface, border: `1px solid ${C.border}` }}
                >
                  <div
                    className="h-28 flex items-center justify-center text-5xl relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(74,222,128,0.06), rgba(240,180,41,0.04))',
                    }}
                  >
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    ) : (
                      item.emoji
                    )}
                    
                    {item.status === 'sold_out' && (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: 'rgba(0,0,0,0.55)' }}
                      >
                        <span
                          className="text-xs font-bold px-2 py-1 rounded-full"
                          style={{
                            background: 'rgba(248,113,113,0.2)',
                            color: C.red,
                          }}
                        >
                          Sold Out
                        </span>
                      </div>
                    )}
                    <span
                      className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: 'rgba(74,222,128,0.15)',
                        color: C.green,
                        border: '1px solid rgba(74,222,128,0.3)',
                      }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <div>
                      <div className="text-sm font-bold truncate" style={{ color: C.text }}>
                        {item.name}
                      </div>
                      <div className="text-[10px] truncate" style={{ color: C.muted }}>
                        {item.practice} · {item.freshness || 'Fresh'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div
                        className="text-base font-bold"
                        style={{ color: C.gold }}
                      >
                        ₹{item.price}
                        <span
                          className="text-xs font-normal ml-0.5"
                          style={{ color: C.muted }}
                        >
                          /{item.priceUnit}
                        </span>
                      </div>
                      <div className="text-[10px] font-medium" style={{ color: C.muted }}>
                        {item.stock} {item.stockUnit} left
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartChat(item)}
                        disabled={startChatMutation.isPending}
                        className="p-2.5 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50"
                        style={{
                          background: 'rgba(96,165,250,0.1)',
                          color: '#60a5fa',
                          border: '1px solid rgba(96,165,250,0.2)',
                        }}
                        title="Chat with farmer"
                      >
                        {startChatMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                      </button>
                      <button
                        disabled={item.status === 'sold_out'}
                        onClick={() => toast.success(`${item.name} added to cart!`)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          background: item.status !== 'sold_out'
                            ? 'rgba(74,222,128,0.12)'
                            : 'rgba(255,255,255,0.04)',
                          color: item.status !== 'sold_out' ? C.green : C.muted,
                          border: `1px solid ${item.status !== 'sold_out' ? C.green + '40' : C.border}`,
                        }}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {item.status !== 'sold_out' ? 'Add to Cart' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Farmers Grid */}
      {view === 'farmers' && (
        <div className="min-h-[300px] relative">
          {filteredFarmers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">👩‍🌾</div>
              <h3 className="text-base font-bold mb-1" style={{ color: C.text }}>No farmers found</h3>
              <p className="text-xs" style={{ color: C.muted }}>Try searching for a different name or location.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredFarmers.map((farmer, i) => (
                <FarmerCard key={farmer.id} farmer={farmer} index={i} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <div
        className="rounded-2xl p-5 flex items-center gap-4"
        style={{
          background: 'rgba(74,222,128,0.05)',
          border: '1px solid rgba(74,222,128,0.15)',
        }}
      >
        <div className="text-3xl">🛒</div>
        <div className="flex-1">
          <div className="text-sm font-bold" style={{ color: C.text }}>
            See the full marketplace
          </div>
          <p className="text-xs mt-0.5" style={{ color: C.muted }}>
            Hundreds more listings from local farms near you.
          </p>
        </div>
        <Link
          to="/"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #4ade80, #16a34a)',
            color: '#051005',
          }}
        >
          Browse <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}
