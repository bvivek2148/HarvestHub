import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ListingImageUpload } from './ListingImageUpload'
import {
  Plus,
  Edit2,
  Trash2,
  Leaf,
  Truck,
  Clock,
  Eye,
  ShoppingBag,
  Search,
  PauseCircle,
  PlayCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  C,
  LISTING_STATUS,
  type Listing,
  type ListingStatus,
} from './FarmerTypes'

const INPUT_CLS =
  'w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all'
const INPUT_STYLE = {
  background: 'rgba(15,31,15,0.8)',
  border: '1px solid rgba(55,95,55,0.4)',
  color: '#eef5ee',
}
const LABEL_CLS = 'block text-xs font-semibold uppercase tracking-wider mb-1.5'
const EMOJIS = [
  '🍅',
  '🌽',
  '🥕',
  '🥬',
  '🧅',
  '🥔',
  '🍆',
  '🥦',
  '🌿',
  '🫑',
  '🍋',
  '🧄',
  '🥑',
  '🫐',
  '🍓',
]

function ListingModal({
  listing,
  onSave,
  onClose,
}: {
  listing: Partial<Listing> | null
  onSave: (l: Listing) => void
  onClose: () => void
}) {
  const isEdit = !!listing?.id
  const [form, setForm] = useState<Partial<Listing>>(
    listing ?? {
      name: '',
      emoji: '🌿',
      category: 'Vegetables',
      imageUrl: '',
      price: '',
      priceUnit: 'kg',
      stock: '',
      stockUnit: 'kg',
      status: 'active',
      orders: 0,
      freshness: '1 day',
      practice: 'Organic',
      delivery: 'Both',
      description: '',
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    
    if (!form.name) { toast.error('Name is required'); return; }
    if (!form.price) { toast.error('Price is required'); return; }
    if (!form.stock) { toast.error('Stock is required'); return; }
    if (!form.category) { toast.error('Category is required'); return; }

    onSave({
      id: listing?.id ?? `new-${Date.now()}`,
      name: form.name!,
      emoji: form.emoji!,
      category: form.category || 'Vegetables',
      imageUrl: form.imageUrl,
      price: form.price!,
      priceUnit: form.priceUnit ?? 'kg',
      stock: form.stock!,
      stockUnit: form.stockUnit ?? 'kg',
      status: form.status ?? 'active',
      orders: form.orders ?? 0,
      freshness: form.freshness ?? '1 day',
      practice: form.practice ?? 'Organic',
      delivery: form.delivery ?? 'Both',
      description: form.description ?? '',
      views: form.views ?? 0,
      revenue: form.revenue ?? 0,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 20 }}
        className="rounded-2xl w-full max-w-lg overflow-hidden"
        style={{
          background: '#080f08',
          border: '1px solid rgba(74,222,128,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          <h3
            className="text-base font-bold"
            style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
          >
            {isEdit ? '✏️ Edit Listing' : '✨ New Listing'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-xl transition-colors"
            style={{ color: C.muted }}
          >
            ✕
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[75vh] overflow-y-auto"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS} style={{ color: C.muted }}>
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                required
                className={INPUT_CLS}
                style={INPUT_STYLE}
              >
                {['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Pantry', 'Meat', 'Other'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL_CLS} style={{ color: C.muted }}>
                Emoji Icon
              </label>
              <div className="flex flex-wrap gap-1 mt-1">
                {EMOJIS.slice(0, 8).map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, emoji: e }))}
                    className="w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all"
                    style={{
                      background: form.emoji === e ? 'rgba(74,222,128,0.1)' : 'rgba(15,31,15,0.6)',
                      border: form.emoji === e ? '1px solid rgba(74,222,128,0.4)' : '1px solid rgba(55,95,55,0.2)',
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className={LABEL_CLS} style={{ color: C.muted }}>
              Produce Name *
            </label>
            <input
              value={form.name ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Organic Tomatoes"
              required
              className={INPUT_CLS}
              style={INPUT_STYLE}
            />
          </div>

          <ListingImageUpload 
            initialUrl={form.imageUrl}
            onUpload={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS} style={{ color: C.muted }}>
                Price *
              </label>
              <div className="flex gap-2">
                <input
                  value={form.price ?? ''}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="50"
                  type="number"
                  step="0.01"
                  required
                  className={`${INPUT_CLS} flex-1`}
                  style={INPUT_STYLE}
                />
                <select
                  value={form.priceUnit}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, priceUnit: e.target.value }))
                  }
                  className={`${INPUT_CLS} w-20`}
                  style={INPUT_STYLE}
                >
                  {['kg', 'dozen', 'bunch', 'piece', 'litre', 'bag'].map(
                    (u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
            <div>
              <label className={LABEL_CLS} style={{ color: C.muted }}>
                Stock *
              </label>
              <div className="flex gap-2">
                <input
                  value={form.stock ?? ''}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, stock: e.target.value }))
                  }
                  placeholder="25"
                  type="number"
                  required
                  className={`${INPUT_CLS} flex-1`}
                  style={INPUT_STYLE}
                />
                <select
                  value={form.stockUnit}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, stockUnit: e.target.value }))
                  }
                  className={`${INPUT_CLS} w-20`}
                  style={INPUT_STYLE}
                >
                  {['kg', 'dozen', 'bunch', 'piece', 'litre', 'bag'].map(
                    (u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS} style={{ color: C.muted }}>
                Freshness
              </label>
              <select
                value={form.freshness}
                onChange={(e) =>
                  setForm((f) => ({ ...f, freshness: e.target.value }))
                }
                className={INPUT_CLS}
                style={INPUT_STYLE}
              >
                {[
                  'Harvested today',
                  '1 day',
                  '2 days',
                  '3 days',
                  '5 days',
                  '1 week',
                ].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL_CLS} style={{ color: C.muted }}>
                Practice
              </label>
              <select
                value={form.practice}
                onChange={(e) =>
                  setForm((f) => ({ ...f, practice: e.target.value }))
                }
                className={INPUT_CLS}
                style={INPUT_STYLE}
              >
                {[
                  'Organic',
                  'Natural',
                  'Conventional',
                  'Biodynamic',
                  'Regenerative',
                ].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS} style={{ color: C.muted }}>
                Delivery
              </label>
              <select
                value={form.delivery}
                onChange={(e) =>
                  setForm((f) => ({ ...f, delivery: e.target.value }))
                }
                className={INPUT_CLS}
                style={INPUT_STYLE}
              >
                {['Both', 'Delivery only', 'Pickup only'].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL_CLS} style={{ color: C.muted }}>
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value as ListingStatus,
                  }))
                }
                className={INPUT_CLS}
                style={INPUT_STYLE}
              >
                {(
                  ['active', 'low', 'sold_out', 'paused'] as ListingStatus[]
                ).map((v) => (
                  <option key={v} value={v}>
                    {v === 'sold_out'
                      ? 'Sold Out'
                      : v.charAt(0).toUpperCase() + v.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={LABEL_CLS} style={{ color: C.muted }}>
              Description
            </label>
            <textarea
              value={form.description ?? ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Describe your produce… freshness, farming practices, flavour notes…"
              rows={3}
              className={`${INPUT_CLS} resize-none`}
              style={INPUT_STYLE}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg,#4ade80,#16a34a)',
              color: '#051005',
            }}
          >
            {isEdit ? 'Save Changes' : '+ Add Listing'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

function DeleteModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="rounded-2xl p-7 max-w-xs w-full text-center"
        style={{
          background: '#080f08',
          border: '1px solid rgba(248,113,113,0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-4xl mb-3">🗑️</div>
        <h3
          className="text-base font-bold mb-2"
          style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
        >
          Remove Listing?
        </h3>
        <p className="text-sm mb-5" style={{ color: C.muted }}>
          This listing will be permanently removed from your store.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-full text-sm font-semibold"
            style={{
              background: C.surface2,
              border: `1px solid ${C.border}`,
              color: C.text,
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-full text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            Remove
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

interface Props {
  listings: Listing[]
  onSave: (l: Listing) => void
  onDelete: (id: string) => void
}

export function FarmerListingsTab({ listings, onSave, onDelete }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [editListing, setEditListing] = useState<Listing | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<ListingStatus | 'all'>('all')

  const filtered = listings.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || l.status === filterStatus
    return matchSearch && matchStatus
  })

  const statusCounts = listings.reduce(
    (acc, l) => {
      acc[l.status] = (acc[l.status] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2
              className="text-xl font-bold"
              style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
            >
              My Listings{' '}
              <span
                className="text-sm font-normal ml-1"
                style={{ color: C.muted }}
              >
                ({listings.length})
              </span>
            </h2>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>
              Manage your produce catalogue
            </p>
          </div>
          <button
            onClick={() => {
              setEditListing(null)
              setShowModal(true)
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold text-[#051005] transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg,#4ade80,#16a34a)',
              boxShadow: '0 4px 16px rgba(74,222,128,0.2)',
            }}
          >
            <Plus className="w-4 h-4" /> Add Listing
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'active', 'low', 'sold_out', 'paused'] as const).map(
            (s) => {
              const stConfig = s !== 'all' ? LISTING_STATUS[s] : null
              const isActive = filterStatus === s
              return (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: isActive
                      ? (stConfig?.color ?? C.green) + '18'
                      : C.surface2,
                    color: isActive ? (stConfig?.color ?? C.green) : C.muted,
                    border: `1px solid ${isActive ? (stConfig?.color ?? C.green) + '44' : C.border}`,
                  }}
                >
                  {s === 'all'
                    ? `All (${listings.length})`
                    : s === 'sold_out'
                      ? `Sold Out (${statusCounts[s] ?? 0})`
                      : `${s.charAt(0).toUpperCase() + s.slice(1)} (${statusCounts[s] ?? 0})`}
                </button>
              )
            },
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: C.muted }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search listings…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
            style={{
              background: C.surface2,
              border: `1px solid ${C.border}`,
              color: C.text,
            }}
          />
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🌱</div>
            <h3
              className="text-lg font-bold mb-2"
              style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}
            >
              No listings found
            </h3>
            <p className="text-sm mb-5" style={{ color: C.muted }}>
              {search
                ? 'No listings match your search.'
                : 'Start selling by adding your first listing.'}
            </p>
            {!search && (
              <button
                onClick={() => {
                  setEditListing(null)
                  setShowModal(true)
                }}
                className="px-5 py-2.5 rounded-full text-sm font-bold text-[#051005]"
                style={{
                  background: 'linear-gradient(135deg,#4ade80,#16a34a)',
                }}
              >
                + Add First Listing
              </button>
            )}
          </div>
        )}

        <div className="space-y-3">
          {filtered.map((item) => {
            const st = LISTING_STATUS[item.status]
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div className="flex items-center gap-4 p-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    {item.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-base font-bold"
                        style={{ color: C.text }}
                      >
                        {item.name}
                      </span>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: st.bg, color: st.color }}
                      >
                        {st.label}
                      </span>
                    </div>
                    <div className="text-sm font-bold" style={{ color: C.green }}>
                      ₹{parseFloat(item.price).toLocaleString('en-IN')}/{item.priceUnit}
                    </div>
                    <div className="text-sm mt-0.5" style={{ color: C.muted }}>
                      Stock: {item.stock} {item.stockUnit}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span
                        className="flex items-center gap-1 text-xs"
                        style={{ color: C.muted }}
                      >
                        <Leaf className="w-3 h-3" />
                        {item.practice}
                      </span>
                      <span
                        className="flex items-center gap-1 text-xs"
                        style={{ color: C.muted }}
                      >
                        <Truck className="w-3 h-3" />
                        {item.delivery}
                      </span>
                      <span
                        className="flex items-center gap-1 text-xs"
                        style={{ color: C.muted }}
                      >
                        <Clock className="w-3 h-3" />
                        {item.freshness}
                      </span>
                      <span
                        className="flex items-center gap-1 text-xs"
                        style={{ color: C.muted }}
                      >
                        <Eye className="w-3 h-3" />
                        {item.views ?? 0} views
                      </span>
                      <span
                        className="flex items-center gap-1 text-xs"
                        style={{ color: C.muted }}
                      >
                        <ShoppingBag className="w-3 h-3" />
                        {item.orders} orders
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div
                      className="text-base font-bold"
                      style={{ color: C.green }}
                    >
                      ₹{(item.revenue ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-[10px]" style={{ color: C.muted }}>
                      revenue
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <button
                        onClick={() => {
                          setEditListing(item)
                          setShowModal(true)
                        }}
                        className="p-1.5 rounded-lg transition-all hover:scale-110"
                        style={{
                          background: 'rgba(96,165,250,0.1)',
                          color: C.blue,
                        }}
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          onSave({
                            ...item,
                            status:
                              item.status === 'paused' ? 'active' : 'paused',
                          })
                        }
                        className="p-1.5 rounded-lg transition-all hover:scale-110"
                        style={{
                          background: 'rgba(148,163,184,0.1)',
                          color: '#94a3b8',
                        }}
                        title={item.status === 'paused' ? 'Resume' : 'Pause'}
                      >
                        {item.status === 'paused' ? (
                          <PlayCircle className="w-3.5 h-3.5" />
                        ) : (
                          <PauseCircle className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="p-1.5 rounded-lg transition-all hover:scale-110"
                        style={{
                          background: 'rgba(248,113,113,0.1)',
                          color: C.red,
                        }}
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {item.status !== 'sold_out' && (
                  <div className="px-5 pb-4">
                    <div
                      className="flex items-center justify-between text-[10px] mb-1"
                      style={{ color: C.muted }}
                    >
                      <span>Stock level</span>
                      <span>
                        {item.stock} {item.stockUnit}
                      </span>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (Number(item.stock) / 100) * 100)}%`,
                          background: item.status === 'low' ? C.gold : C.green,
                        }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {(showModal || editListing) && (
          <ListingModal
            listing={editListing}
            onSave={(l) => {
              onSave(l)
              setShowModal(false)
              setEditListing(null)
            }}
            onClose={() => {
              setShowModal(false)
              setEditListing(null)
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <DeleteModal
            onConfirm={() => {
              onDelete(deleteId)
              setDeleteId(null)
            }}
            onCancel={() => setDeleteId(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
