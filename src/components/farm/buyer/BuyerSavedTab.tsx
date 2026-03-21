import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from '@tanstack/react-router'
import {
  Heart,
  ShoppingCart,
  X,
  Leaf,
  MapPin,
  Star,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import { C, type SavedItem } from './BuyerTypes'
import { toast } from 'sonner'

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Pantry']

function SavedCard({
  item,
  onRemove,
}: {
  item: SavedItem
  onRemove: (id: string) => void
}) {
  const [inCart, setInCart] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, y: -10 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl overflow-hidden group"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}
    >
      {/* Card Top */}
      <div
        className="relative p-5 flex items-center justify-between"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          {item.emoji}
        </div>
        <div className="flex items-center gap-2">
          {!item.inStock && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(248,113,113,0.12)', color: C.red }}
            >
              Out of Stock
            </span>
          )}
          <button
            onClick={() => onRemove(item.id)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(248,113,113,0.08)', color: C.red }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-5 pb-5 space-y-3">
        <div>
          <div
            className="text-base font-bold"
            style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
          >
            {item.name}
          </div>
          <div className="text-sm mt-0.5" style={{ color: C.muted }}>
            {item.farmer}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xl font-bold" style={{ color: C.gold }}>
            ₹{item.price}
            <span
              className="text-xs font-normal ml-1"
              style={{ color: C.muted }}
            >
              /{item.unit}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star
              className="w-3.5 h-3.5"
              fill={C.gold}
              style={{ color: C.gold }}
            />
            <span className="text-xs font-semibold" style={{ color: C.text }}>
              {item.rating}
            </span>
            <span className="text-xs" style={{ color: C.muted }}>
              ({item.reviews})
            </span>
          </div>
        </div>

        <div
          className="flex items-center gap-3 text-xs flex-wrap"
          style={{ color: C.muted }}
        >
          <span className="flex items-center gap-1">
            <Leaf className="w-3 h-3" style={{ color: C.green }} />
            {item.practice}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {item.location}
          </span>
        </div>

        <button
          onClick={() => {
            if (!item.inStock) return
            setInCart((v) => !v)
            toast.success(
              inCart ? 'Removed from cart' : `${item.name} added to cart!`,
            )
          }}
          disabled={!item.inStock}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: inCart
              ? 'rgba(248,113,113,0.12)'
              : item.inStock
                ? 'rgba(74,222,128,0.12)'
                : 'rgba(255,255,255,0.04)',
            color: inCart ? C.red : item.inStock ? C.green : C.muted,
            border: `1px solid ${inCart ? C.red + '40' : item.inStock ? C.green + '40' : C.border}`,
          }}
        >
          {inCart ? (
            <>
              <Heart className="w-4 h-4" fill={C.red} /> In Cart
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />{' '}
              {item.inStock ? 'Add to Cart' : 'Out of Stock'}
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}

export function BuyerSavedTab() {
  const [items, setItems] = useState<SavedItem[]>([])
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = items.filter((item) => {
    const matchCat = category === 'All' || item.category === category
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.farmer.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
    toast.success('Removed from wishlist')
  }

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
          Wishlist
          <span className="text-sm font-normal ml-2" style={{ color: C.muted }}>
            ({items.length} items)
          </span>
        </h2>
        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: C.muted }}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {items.filter((i) => i.inStock).length} in stock
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
          placeholder="Search saved items…"
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            color: C.text,
          }}
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: category === cat ? C.green + '20' : C.surface2,
              color: category === cat ? C.green : C.muted,
              border:
                category === cat
                  ? `1px solid ${C.green}40`
                  : `1px solid ${C.border}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">💚</div>
          <h3
            className="text-base font-bold mb-2"
            style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
          >
            Your wishlist is empty
          </h3>
          <p className="text-sm mb-5" style={{ color: C.muted }}>
            Heart any produce listing in the marketplace to save it here.
          </p>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-full text-sm font-bold text-[#051005]"
            style={{ background: 'linear-gradient(135deg, #4ade80, #16a34a)' }}
          >
            Browse Marketplace
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm" style={{ color: C.muted }}>
            No items match your search.
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <SavedCard key={item.id} item={item} onRemove={removeItem} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
