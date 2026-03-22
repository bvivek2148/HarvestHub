import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Link } from '@tanstack/react-router'
import { Search, MapPin, Star, ShoppingCart, ArrowRight, Loader2, MessageSquare, User, ArrowLeft, Award, Calendar } from 'lucide-react'
import { C } from './BuyerTypes'
import { toast } from 'sonner'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getAllListingsFn } from '@/server/functions/listings'
import { getOrCreateThreadFn } from '@/server/functions/messages'
import { getFarmersFn } from '@/server/functions/users'
import { useCart } from '@/context/CartContext'

function FarmerCard({
  farmer,
  index,
  onChat,
  onViewProfile
}: {
  farmer: any
  index: number
  onChat: (farmerId: string, farmerName: string) => void
  onViewProfile: (farmer: any) => void
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
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform relative overflow-hidden"
          style={{ background: `color-mix(in srgb, ${C.green}, transparent 92%)`, border: `1px solid ${C.border}` }}
        >
          {farmer.avatarUrl ? (
            <img src={farmer.avatarUrl} className="w-full h-full object-cover" />
          ) : (
            <User className="w-7 h-7 opacity-20" />
          )}
          <span className="absolute bottom-1 right-1 text-xs">🚜</span>
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="text-sm font-bold"
            style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
          >
            {farmer.name || farmer.fullName || 'Verified Farmer'}
          </div>
          <div
            className="flex items-center gap-1 mt-0.5 text-xs"
            style={{ color: C.muted }}
          >
            <MapPin className="w-3 h-3" />
            {farmer.location || 'Rural India'}
          </div>
          <span
            className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              background: `color-mix(in srgb, ${C.green}, transparent 90%)`,
              color: C.green,
              border: `1px solid color-mix(in srgb, ${C.green}, transparent 80%)`,
            }}
          >
            {farmer.specialty || 'Organic Specialist'}
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
              4.8
            </span>
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: C.muted }}>
            Verified
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onChat(farmer.id || farmer.userId, farmer.name || farmer.fullName)
            }}
            className="mt-2 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: `color-mix(in srgb, ${C.green}, transparent 90%)`,
              color: C.green,
              border: `1px solid color-mix(in srgb, ${C.green}, transparent 80%)`
            }}
            title="Chat with Farmer"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-[10px] mb-3 line-clamp-2" style={{ color: C.muted }}>
        {farmer.bio || 'Professional farmer dedicated to sustainable agriculture and high-quality produce delivery.'}
      </p>
      <button
        onClick={() => onViewProfile(farmer)}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]"
        style={{
          background: `color-mix(in srgb, ${C.green}, transparent 90%)`,
          color: C.green,
          border: `1px solid color-mix(in srgb, ${C.green}, transparent 75%)`,
        }}
      >
        View Profile <ArrowRight className="w-3 h-3" />
      </button>
    </motion.div>
  )
}

function FarmerProfileDetail({ farmer, onBack, onChat }: { farmer: any, onBack: () => void, onChat: (fid: string, fname: string) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold hover:opacity-70 transition-opacity"
        style={{ color: C.green }}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Explore
      </button>

      <div
        className="relative rounded-3xl overflow-hidden p-6 md:p-10"
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
        }}
      >
        <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div 
              className="w-24 h-24 md:w-32 md:h-32 rounded-3xl flex items-center justify-center text-4xl font-bold shrink-0 shadow-2xl"
              style={{ 
                background: `linear-gradient(135deg, ${C.surface2}, ${C.surface})`,
                border: `1px solid ${C.border}`,
                color: C.green,
                fontFamily: "'Syne', sans-serif"
              }}
            >
              {farmer.name ? farmer.name[0].toUpperCase() : '🚜'}
            </div>
            
            <div className="flex-1 space-y-3">
               <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl font-extrabold" style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}>
                    {farmer.farmName || farmer.name || 'Verified Farmer'}
                  </h2>
                  <div className="px-3 py-1 rounded-full bg-[#4ade80]/10 text-[#4ade80] text-[10px] font-bold border border-[#4ade80]/20 uppercase tracking-widest">
                    Verified Seller
                  </div>
               </div>
               
               <p className="text-base opacity-80 max-w-2xl leading-relaxed" style={{ color: C.muted }}>
                 {farmer.bio || "Growing fresh, sustainable produce for our local community with care and dedication."}
               </p>

               <div className="flex flex-wrap items-center gap-6 pt-2">
                  <div className="flex items-center gap-2">
                     <MapPin className="w-4 h-4" style={{ color: C.green }} />
                     <span className="text-sm" style={{ color: C.text }}>{farmer.location || 'Local Region'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Calendar className="w-4 h-4" style={{ color: C.green }} />
                     <span className="text-sm" style={{ color: C.text }}>{farmer.experience || 'Professional Farmer'}</span>
                  </div>
               </div>
            </div>

            <button
              onClick={() => onChat(farmer.id || farmer.userId, farmer.name || 'Farmer')}
              className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`, color: '#051005' }}
            >
              <MessageSquare className="w-4 h-4" /> Chat Now
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div
           className="p-6 rounded-3xl space-y-4"
           style={{ background: C.surface, border: `1px solid ${C.border}` }}
         >
            <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: C.text }}>
               <Award className="w-5 h-5 text-[#4ade80]" /> Farm Showcase
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <div
                  className="p-4 rounded-xl"
                  style={{ background: C.surface2, border: `1px solid ${C.border}` }}
                >
                   <div className="text-[10px] font-bold uppercase text-[#688568] mb-1">Farm Size</div>
                   <div className="text-sm font-bold">{farmer.farmSize || 'Standard'}</div>
                </div>
                <div
                  className="p-4 rounded-xl"
                  style={{ background: C.surface2, border: `1px solid ${C.border}` }}
                >
                   <div className="text-[10px] font-bold uppercase text-[#688568] mb-1">Specialties</div>
                   <div className="text-sm font-bold truncate">{farmer.specialties || 'Seasonal Crop'}</div>
                </div>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{ background: C.surface2, border: `1px solid ${C.border}` }}
            >
                <div className="text-[10px] font-bold uppercase text-[#688568] mb-1">Farming Methods</div>
                <div className="text-sm leading-relaxed">{farmer.methods || 'Sustainable and natural farming practices.'}</div>
            </div>
         </div>

          <div
            className="p-6 rounded-3xl flex flex-col justify-center text-center space-y-4"
            style={{
              background: `linear-gradient(135deg, ${C.surface2}, ${C.surface})`,
              border: `1px solid color-mix(in srgb, ${C.green}, transparent 80%)`
            }}
          >
            <div className="text-4xl">🌟</div>
            <div>
               <div className="text-2xl font-black text-[#4ade80]">Trust & Quality</div>
               <p className="text-xs mt-1" style={{ color: C.muted }}>Verified producer since 2024</p>
            </div>
            <div className="flex justify-center gap-8 pt-2">
               <div>
                  <div className="text-xl font-bold">4.9/5</div>
                  <div className="text-[9px] uppercase tracking-widest opacity-50">Rating</div>
               </div>
               <div>
                  <div className="text-xl font-bold">100%</div>
                  <div className="text-[9px] uppercase tracking-widest opacity-50">Freshness</div>
               </div>
            </div>
         </div>
      </div>
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
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null)
  const { addToCart } = useCart()

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
      listingId: item.id,
      farmerName: item.farmerName || 'Farmer',
      productName: item.name,
      productEmoji: item.emoji
    })
  }

  const { data: farmers = [] } = useQuery({
    queryKey: ['farmers'],
    queryFn: () => getFarmersFn(),
    enabled: view === 'farmers'
  })

  const filteredFarmers = farmers.filter(
    (f: any) =>
      (f.name || f.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (f.location || '').toLowerCase().includes(search.toLowerCase()),
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
                background: view === v ? `color-mix(in srgb, ${C.green}, transparent 88%)` : 'transparent',
                color: view === v ? C.green : C.muted,
                border:
                  view === v
                    ? `1px solid color-mix(in srgb, ${C.green}, transparent 75%)`
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
                  activeCategory === cat ? `color-mix(in srgb, ${C.green}, transparent 88%)` : C.surface2,
                color: activeCategory === cat ? C.green : C.muted,
                border:
                  activeCategory === cat
                    ? `1px solid color-mix(in srgb, ${C.green}, transparent 75%)`
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
                      background: `linear-gradient(135deg, color-mix(in srgb, ${C.green}, transparent 94%), color-mix(in srgb, ${C.gold}, transparent 96%))`,
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
                            background: `color-mix(in srgb, ${C.red}, transparent 80%)`,
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
                        background: `color-mix(in srgb, ${C.green}, transparent 85%)`,
                        color: C.green,
                        border: `1px solid color-mix(in srgb, ${C.green}, transparent 70%)`,
                      }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-bold truncate flex-1" style={{ color: C.text }}>
                          {item.name}
                        </div>
                        <button 
                          onClick={() => {
                            setView('farmers')
                            const f = farmers.find((farm: any) => farm.id === item.farmerId)
                            if (f) setSelectedFarmer(f)
                            else setSelectedFarmer({ id: item.farmerId, name: item.farmerName })
                          }}
                          className="text-[9px] font-bold uppercase tracking-wider hover:underline"
                          style={{ color: C.green }}
                        >
                          View Farm
                        </button>
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
                          background: `color-mix(in srgb, ${C.blue}, transparent 90%)`,
                          color: C.blue,
                          border: `1px solid color-mix(in srgb, ${C.blue}, transparent 80%)`,
                        }}
                        title="Chat with farmer"
                      >
                        {startChatMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                      </button>
                      <button
                        disabled={item.status === 'sold_out'}
                        onClick={() => {
                          addToCart({
                            id: item.id,
                            name: item.name,
                            price: parseFloat(item.price),
                            emoji: item.emoji,
                            imageUrl: item.imageUrl,
                            farmerId: item.farmerId,
                            farmerName: item.farmerName,
                            unit: item.priceUnit
                          })
                          toast.success(`${item.name} added to cart!`)
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          background: item.status !== 'sold_out'
                            ? `color-mix(in srgb, ${C.green}, transparent 88%)`
                            : C.surface2,
                          color: item.status !== 'sold_out' ? C.green : C.muted,
                          border: `1px solid ${item.status !== 'sold_out' ? `color-mix(in srgb, ${C.green}, transparent 75%)` : C.border}`,
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
          {selectedFarmer ? (
            <FarmerProfileDetail 
              farmer={selectedFarmer} 
              onBack={() => setSelectedFarmer(null)}
              onChat={(fid, fname) => startChatMutation.mutate({
                farmerId: fid,
                listingId: 'profile',
                farmerName: fname,
                productName: 'Farmer Profile',
                productEmoji: '👨‍🌾'
              })}
            />
          ) : filteredFarmers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">👩‍🌾</div>
              <h3 className="text-base font-bold mb-1" style={{ color: C.text }}>No farmers found</h3>
              <p className="text-xs" style={{ color: C.muted }}>Try searching for a different name or location.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredFarmers.map((farmer: any, i: number) => (
                <FarmerCard 
                  key={farmer.id} 
                  farmer={farmer} 
                  index={i} 
                  onChat={(fid, fname) => startChatMutation.mutate({
                    farmerId: fid,
                    listingId: 'profile',
                    farmerName: fname,
                    productName: 'Farmer Profile',
                    productEmoji: '👨‍🌾'
                  })}
                  onViewProfile={(f) => setSelectedFarmer(f)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <div
        className="rounded-2xl p-5 flex items-center gap-4"
        style={{
          background: `color-mix(in srgb, ${C.green}, transparent 95%)`,
          border: `1px solid color-mix(in srgb, ${C.green}, transparent 85%)`,
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
