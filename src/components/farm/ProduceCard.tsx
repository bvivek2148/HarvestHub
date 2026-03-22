import { useState, useRef } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'motion/react'
import {
  Leaf,
  MapPin,
  Clock,
  Star,
  ShoppingCart,
  MessageCircle,
  Zap,
  Heart,
  GitCompare,
  X,
  Send,
  CheckCircle,
  User,
} from 'lucide-react'

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: 'var(--fd-bg)',
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

export interface ProduceItem {
  id: string
  name: string
  farmer: string
  farm: string
  location: string
  price: number
  unit: string
  image: string
  category: string
  practice: string
  practiceIcon: string
  freshnessHours: number
  deliveryDays: number
  rating: number
  reviews: number
  inStock: number
  isFeatured?: boolean
  isOrganic?: boolean
}

interface ProduceCardProps {
  item: ProduceItem
  index: number
  isFavourite?: boolean
  isInCompare?: boolean
  compareMode?: boolean
  cartQty?: number
  onToggleFavourite?: () => void
  onToggleCompare?: () => void
  onAddToCart?: (qty: number) => void
  onChat?: () => void
}

type ChatMessage = { role: 'farmer' | 'buyer'; text: string }

const freshnessLabel = (hours: number) => {
  if (hours <= 24) return { label: 'Harvested Today', color: C.green }
  if (hours <= 48) return { label: 'Yesterday', color: `color-mix(in srgb, ${C.green}, ${C.amber})` }
  if (hours <= 72) return { label: '2-3 Days', color: C.amber }
  return { label: '3-5 Days', color: `color-mix(in srgb, ${C.amber}, ${C.red})` }
}

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.9 }}
          className="absolute top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap shadow-xl"
            style={{
              background: C.surface,
              border: `1px solid ${C.borderGlow}`,
              color: C.amber,
              fontFamily: "'DM Sans', sans-serif",
              backdropFilter: 'blur(12px)',
            }}
          >
            <CheckCircle className="w-3 h-3" style={{ color: C.green }} />
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ChatPanel({
  item,
  onClose,
}: {
  item: ProduceItem
  onClose: () => void
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'farmer',
      text: `Hi! I'm ${item.farmer} from ${item.farm}. How can I help you today?`,
    },
  ])
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    const msg = input.trim()
    setMessages((m) => [...m, { role: 'buyer', text: msg }])
    setInput('')
    
    // Generic response instead of simulated chat
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: 'farmer',
          text: `Thanks for your interest in ${item.name}! I've received your message and will get back to you directly through the dashboard chat soon.`,
        },
      ])
    }, 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'var(--fd-modal-bg)',
          border: '1px solid var(--fd-modal-border)',
        }}
      >
        {/* Chat header */}
        <div
          className="flex items-center gap-3 p-4"
          style={{
            background: 'var(--fd-section-bg)',
            borderBottom: '1px solid var(--fd-border)',
          }}
        >
          {/* Farmer avatar — simple initial circle, no 3D */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})` }}
          >
            {item.farmer.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="text-sm font-bold truncate"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: 'var(--fd-text)',
              }}
            >
              {item.farmer}
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: C.green }}
              />
              <span
                className="text-[10px]"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: C.green,
                }}
              >
                Online · {item.farm}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg"
            style={{ color: 'var(--fd-text-muted)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div
          className="mx-4 mt-3 p-3 rounded-xl flex items-center gap-3"
          style={{
            background: 'var(--fd-section-bg)',
            border: '1px solid var(--fd-border)',
          }}
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <div
              className="text-xs font-semibold"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: 'var(--fd-text)',
              }}
            >
              {item.name}
            </div>
            <div
              className="text-xs"
              style={{ fontFamily: "'DM Sans', sans-serif", color: C.amber }}
            >
              ₹{item.price.toFixed(2)} / {item.unit}
            </div>
          </div>
        </div>

        <div
          className="p-4 space-y-3 overflow-y-auto"
          style={{ maxHeight: '220px' }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === 'buyer' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className="max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background:
                    msg.role === 'buyer'
                      ? `linear-gradient(135deg, ${C.green}, ${C.greenDark})`
                      : 'var(--fd-section-bg)',
                  color: msg.role === 'buyer' ? '#ffffff' : 'var(--fd-text-2)',
                  border:
                    msg.role === 'farmer'
                      ? '1px solid var(--fd-border)'
                      : 'none',
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div
          className="p-3 flex gap-2"
          style={{ borderTop: '1px solid var(--fd-border)' }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask about quantity, delivery, price..."
            className="flex-1 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              background: 'var(--fd-input-bg)',
              border: '1px solid var(--fd-input-border)',
              color: 'var(--fd-text)',
            }}
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-40 transition-colors"
            style={{ background: C.green, color: '#ffffff' }}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function CartModal({
  item,
  onClose,
  onConfirm,
}: {
  item: ProduceItem
  onClose: () => void
  onConfirm: (qty: number) => void
}) {
  const [qty, setQty] = useState(1)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'var(--fd-modal-bg)',
          border: `1px solid color-mix(in srgb, ${C.amber}, transparent 70%)`,
        }}
      >
        <div className="relative h-28 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
            }}
          />
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <h3
                className="text-sm font-bold text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {item.name}
              </h3>
              <p
                className="text-xs text-white/70"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {item.farmer} · {item.farm}
              </p>
            </div>
            <span
              className="text-base font-bold"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: C.amber,
              }}
            >
              ₹{item.price.toFixed(2)}
              <span className="text-[10px] font-normal text-white/60">
                /{item.unit}
              </span>
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="mb-4">
            <label
              className="text-xs mb-2 block"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: 'var(--fd-text-muted)',
              }}
            >
              Quantity ({item.unit}s)
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold"
                style={{
                  border: '1px solid var(--fd-border)',
                  color: 'var(--fd-text)',
                  background: 'var(--fd-section-bg)',
                }}
              >
                -
              </button>
              <span
                className="flex-1 text-center font-bold text-lg"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: 'var(--fd-text)',
                }}
              >
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(item.inStock, q + 1))}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold"
                style={{
                  border: '1px solid var(--fd-border)',
                  color: 'var(--fd-text)',
                  background: 'var(--fd-section-bg)',
                }}
              >
                +
              </button>
            </div>
          </div>

          <div
            className="p-3 rounded-xl mb-4"
            style={{
              background: 'var(--fd-section-bg)',
              border: '1px solid var(--fd-border)',
            }}
          >
            <div className="flex justify-between text-xs mb-1">
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: 'var(--fd-text-muted)',
                }}
              >
                Subtotal
              </span>
              <span
                className="font-semibold"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: 'var(--fd-text)',
                }}
              >
                ₹{(item.price * qty).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-xs mb-1">
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: 'var(--fd-text-muted)',
                }}
              >
                Platform fee (5%)
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: C.amber,
                }}
              >
                ₹{(item.price * qty * 0.05).toFixed(2)}
              </span>
            </div>
            <div
              className="h-px my-2"
              style={{ background: 'var(--fd-border)' }}
            />
            <div className="flex justify-between text-sm">
              <span
                className="font-semibold"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: 'var(--fd-text)',
                }}
              >
                Total (Escrow)
              </span>
              <span
                className="font-bold"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: C.green,
                }}
              >
                ₹{(item.price * qty * 1.05).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm transition-colors"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                border: '1px solid var(--fd-border)',
                color: 'var(--fd-text-muted)',
                background: 'var(--fd-section-bg)',
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(qty)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg transition-all"
              style={{
                background: `linear-gradient(135deg, ${C.amber}, ${C.amberGlow})`,
                color: '#ffffff',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function CompareModal({
  item,
  onClose,
}: {
  item: ProduceItem
  onClose: () => void
}) {
  const alt: ProduceItem | null = null

  const rows: {
    label: string
    a: string
    b: string
    winner: 'a' | 'b' | 'tie'
  }[] = [
    {
      label: 'Price',
      a: `₹${item.price.toFixed(2)}/${item.unit}`,
      b: alt ? `₹${(alt as any).price.toFixed(2)}/${(alt as any).unit}` : '—',
      winner: alt && item.price <= (alt as any).price ? 'a' : (alt ? 'b' : 'tie'),
    },
    {
      label: 'Rating',
      a: `${item.rating} (${item.reviews})`,
      b: alt ? `${(alt as any).rating} (${(alt as any).reviews})` : '—',
      winner: alt && item.rating >= (alt as any).rating ? 'a' : (alt ? 'b' : 'tie'),
    },
    {
      label: 'Freshness',
      a: item.freshnessHours <= 24 ? 'Today' : `${item.freshnessHours}h`,
      b: alt ? ((alt as any).freshnessHours <= 24 ? 'Today' : `${(alt as any).freshnessHours}h`) : '—',
      winner: alt && item.freshnessHours <= (alt as any).freshnessHours ? 'a' : (alt ? 'b' : 'tie'),
    },
    {
      label: 'Delivery',
      a: item.deliveryDays === 0 ? 'Pickup' : `${item.deliveryDays}d`,
      b: alt ? ((alt as any).deliveryDays === 0 ? 'Pickup' : `${(alt as any).deliveryDays}d`) : '—',
      winner: alt && item.deliveryDays <= (alt as any).deliveryDays ? 'a' : (alt ? 'b' : 'tie'),
    },
    {
      label: 'Stock',
      a: `${item.inStock} ${item.unit}s`,
      b: alt ? `${(alt as any).inStock} ${(alt as any).unit}s` : '—',
      winner: alt && item.inStock >= (alt as any).inStock ? 'a' : (alt ? 'b' : 'tie'),
    },
    {
      label: 'Organic',
      a: item.isOrganic ? 'Yes' : 'No',
      b: alt ? ((alt as any).isOrganic ? 'Yes' : 'No') : '—',
      winner: alt ? (
        item.isOrganic && !(alt as any).isOrganic
          ? 'a'
          : !item.isOrganic && (alt as any).isOrganic
            ? 'b'
            : 'tie'
      ) : 'tie',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'var(--fd-modal-bg)',
          border: `1px solid color-mix(in srgb, ${C.blue}, transparent 70%)`,
        }}
      >
        <div
          className="p-8 text-center"
          style={{ background: 'var(--fd-section-bg)' }}
        >
          <div className="text-4xl mb-4">⚖️</div>
          <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--fd-text)' }}>Comparison Coming Soon</h3>
          <p className="text-sm px-4" style={{ fontFamily: "'DM Sans', sans-serif", color: 'var(--fd-text-muted)' }}>We're building our database of similar products. Soon you'll be able to compare prices and freshness across all local farms!</p>
          <button onClick={onClose} className="mt-6 px-6 py-2 rounded-xl text-sm font-bold" style={{ background: `linear-gradient(135deg, ${C.amber}, ${C.amberGlow})`, color: '#ffffff' }}>Close</button>
        </div>

        <div
          className="grid grid-cols-3 gap-0"
          style={{ borderBottom: '1px solid var(--fd-border)' }}
        >
          <div
            className="p-3 text-xs"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: 'var(--fd-text-muted)',
            }}
          >
            Attribute
          </div>
          {[item, alt].map((p, idx) => (
            <div
              key={idx}
              className="p-3 text-center"
              style={{
                background:
                  idx === 0 ? `color-mix(in srgb, ${C.amber}, transparent 94%)` : `color-mix(in srgb, ${C.blue}, transparent 96%)`,
              }}
            >
              {p ? (
                <>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-10 h-10 rounded-lg object-cover mx-auto mb-1"
                  />
                  <div
                    className="text-xs font-bold truncate"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: 'var(--fd-text)',
                    }}
                  >
                    {p.name}
                  </div>
                  <div
                    className="text-[10px] truncate"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: 'var(--fd-text-muted)',
                    }}
                  >
                    {p.farmer}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-20">
                  <div className="w-10 h-10 rounded-lg bg-current mb-1" />
                  <div className="w-12 h-2 bg-current rounded mb-1" />
                  <div className="w-8 h-2 bg-current rounded" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--fd-border)' }}>
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-3 gap-0">
              <div
                className="p-3 text-[10px] flex items-center"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: 'var(--fd-text-muted)',
                }}
              >
                {row.label}
              </div>
              <div
                className="p-3 text-center text-xs font-medium"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background:
                    row.winner === 'a' ? `color-mix(in srgb, ${C.amber}, transparent 92%)` : 'transparent',
                  color:
                    row.winner === 'a' ? C.amber : 'var(--fd-text-muted)',
                }}
              >
                {row.a}
                {row.winner === 'a' && (
                  <span
                    className="ml-1 text-[8px]"
                    style={{ color: '#16a34a' }}
                  >
                    Better
                  </span>
                )}
              </div>
              <div
                className="p-3 text-center text-xs font-medium"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background:
                    row.winner === 'b'
                      ? `color-mix(in srgb, ${C.blue}, transparent 92%)`
                      : 'transparent',
                  color:
                    row.winner === 'b' ? C.blue : 'var(--fd-text-muted)',
                }}
              >
                {row.b}
                {row.winner === 'b' && (
                  <span
                    className="ml-1 text-[8px]"
                    style={{ color: '#16a34a' }}
                  >
                    Better
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-bold"
            style={{
              background: `linear-gradient(135deg, ${C.amber}, ${C.amberGlow})`,
              color: '#ffffff',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Choose {item.name}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function ProduceCard({
  item,
  index,
  isFavourite = false,
  isInCompare = false,
  cartQty = 0,
  onToggleFavourite,
  onToggleCompare,
  onAddToCart,
  onChat,
}: ProduceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [showCartModal, setShowCartModal] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showCompareModal, setShowCompareModal] = useState(false)
  const [toast, setToast] = useState('')

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 200,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 200,
    damping: 30,
  })
  const glareX = useTransform(mouseX, [-0.5, 0.5], [0, 100])
  const glareY = useTransform(mouseY, [-0.5, 0.5], [0, 100])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setHovered(false)
  }

  const freshness = freshnessLabel(item.freshnessHours)

  const showToastMsg = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  const handleCartConfirm = (qty: number) => {
    setShowCartModal(false)
    onAddToCart?.(qty)
    showToastMsg(`${qty} x ${item.name} added!`)
  }
  const handleFavouriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFavourite?.()
    showToastMsg(isFavourite ? 'Removed from saved' : 'Saved to favourites')
  }
  const handleCompareToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleCompare?.()
    showToastMsg(isInCompare ? 'Removed from compare' : 'Added to compare')
  }
  const handleViewCompare = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowCompareModal(true)
  }

  const cardBorderStyle = isInCompare
    ? '1.5px solid rgba(59,130,246,0.55)'
    : isFavourite
      ? '1.5px solid rgba(239,68,68,0.4)'
      : '1px solid var(--fd-border)'

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{
          duration: 0.6,
          delay: index * 0.07,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ perspective: 1000 }}
      >
        <motion.div
          ref={cardRef}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
            background: 'var(--fd-card-bg)',
            border: cardBorderStyle,
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="relative group rounded-2xl overflow-hidden cursor-pointer"
          whileHover={{ boxShadow: 'var(--fd-card-shadow)' }}
        >
          <Toast message={toast} visible={!!toast} />

          {isInCompare && (
            <div className="absolute inset-0 z-10 rounded-2xl pointer-events-none ring-2 ring-blue-400/40" />
          )}

          {/* Glare */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(217,119,6,0.07) 0%, transparent 55%)`,
            }}
          />

          {/* Product image */}
          <div className="relative h-56 overflow-hidden">
            <motion.img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              style={{ scale: hovered ? 1.07 : 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              loading="lazy"
            />
            {/* Cinematic gradient over image */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(10,22,10,0.88) 0%, rgba(10,22,10,0.3) 50%, rgba(0,0,0,0.1) 100%)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 30%)',
              }}
            />

            {/* Badges top-left */}
            <div className="absolute top-3 left-3 flex gap-1.5 z-10">
              {item.isOrganic && (
                <span
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide"
                  style={{
                    background: 'rgba(22,163,74,0.9)',
                    color: '#fff',
                    backdropFilter: 'blur(4px)',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <Leaf className="w-2.5 h-2.5" /> Organic
                </span>
              )}
              {item.isFeatured && (
                <span
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide"
                  style={{
                    background: 'rgba(217,119,6,0.9)',
                    color: '#fff',
                    backdropFilter: 'blur(4px)',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <Zap className="w-2.5 h-2.5" /> Featured
                </span>
              )}
            </div>

            {/* Fav + Compare overlay buttons top-right */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
              <motion.button
                onClick={handleFavouriteClick}
                whileTap={{ scale: 0.82 }}
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-xl"
                style={{
                  background: isFavourite
                    ? 'rgba(239,68,68,0.92)'
                    : 'rgba(0,0,0,0.45)',
                  border: isFavourite
                    ? '1.5px solid rgba(239,68,68,0.6)'
                    : '1px solid rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Heart
                  className="w-3.5 h-3.5"
                  style={{ color: '#ffffff' }}
                  fill={isFavourite ? '#fff' : 'none'}
                />
              </motion.button>
              <motion.button
                onClick={handleCompareToggle}
                whileTap={{ scale: 0.82 }}
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-xl"
                style={{
                  background: isInCompare
                    ? 'rgba(59,130,246,0.92)'
                    : 'rgba(0,0,0,0.45)',
                  border: isInCompare
                    ? '1.5px solid rgba(59,130,246,0.6)'
                    : '1px solid rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <GitCompare
                  className="w-3.5 h-3.5"
                  style={{ color: '#ffffff' }}
                />
              </motion.button>
            </div>

            {/* Farmer name strip at bottom of image — no avatar circle */}
            <div className="absolute bottom-0 left-0 right-0 px-3.5 pb-3 pt-6 z-10">
              <div className="flex items-end justify-between">
                {/* Farmer info — simple clean text with small icon */}
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(22,163,74,0.85)',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <div
                      className="text-[11px] font-bold leading-tight"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: '#ffffff',
                        textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                      }}
                    >
                      {item.farmer}
                    </div>
                    <div
                      className="text-[9px] leading-tight"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: 'rgba(255,255,255,0.65)',
                      }}
                    >
                      {item.farm}
                    </div>
                  </div>
                </div>

                {/* Freshness badge */}
                <span
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                  style={{
                    background: `${freshness.color}22`,
                    color: freshness.color,
                    border: `1px solid ${freshness.color}50`,
                    fontFamily: "'DM Sans', sans-serif",
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: freshness.color }}
                  />
                  {freshness.label}
                </span>
              </div>
            </div>
          </div>

          {/* Card body */}
          <div className="p-4" style={{ background: 'var(--fd-surface)' }}>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h3
                  className="text-sm font-bold leading-tight mb-0.5"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: 'var(--fd-text)',
                  }}
                >
                  {item.name}
                </h3>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" style={{ color: '#16a34a' }} />
                  <span
                    className="text-[10px]"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: 'var(--fd-text-muted)',
                    }}
                  >
                    {item.location}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div
                  className="text-lg font-black"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: '#d97706',
                  }}
                >
                  ₹{item.price.toFixed(2)}
                </div>
                <div
                  className="text-[10px]"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: 'var(--fd-text-muted)',
                  }}
                >
                  per {item.unit}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span
                className="flex items-center gap-1 text-[10px]"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: 'var(--fd-text-muted)',
                }}
              >
                <span>{item.practiceIcon}</span>
                {item.practice}
              </span>
              <span
                className="w-1 h-1 rounded-full"
                style={{ background: 'var(--fd-border)' }}
              />
              <span
                className="flex items-center gap-1 text-[10px]"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: 'var(--fd-text-muted)',
                }}
              >
                <Clock className="w-3 h-3" style={{ color: '#d97706' }} />
                {item.deliveryDays === 0
                  ? 'Pickup Today'
                  : `${item.deliveryDays}d delivery`}
              </span>
              <span className="ml-auto flex items-center gap-0.5">
                <Star
                  className="w-3 h-3"
                  style={{ color: '#d97706' }}
                  fill="#d97706"
                />
                <span
                  className="text-[10px] font-bold"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: 'var(--fd-text)',
                  }}
                >
                  {item.rating}
                </span>
                <span
                  className="text-[10px]"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: 'var(--fd-text-muted)',
                  }}
                >
                  ({item.reviews})
                </span>
              </span>
            </div>

            {/* Stock bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-[10px]"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: 'var(--fd-text-muted)',
                  }}
                >
                  Stock
                </span>
                <span
                  className="text-[10px]"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: 'var(--fd-text-muted)',
                  }}
                >
                  {item.inStock} {item.unit}s left
                </span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: 'var(--fd-bg-2)' }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{
                    width: `${Math.min((item.inStock / 50) * 100, 100)}%`,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    delay: index * 0.07 + 0.3,
                    ease: 'easeOut',
                  }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      item.inStock > 20
                        ? '#16a34a'
                        : item.inStock > 10
                          ? '#eab308'
                          : '#ef4444',
                  }}
                />
              </div>
            </div>

            {/* Add to Cart + Chat */}
            <div className="flex gap-2 mb-2">
              <motion.button
                onClick={() => setShowCartModal(true)}
                whileTap={{ scale: 0.95 }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all hover:shadow-lg"
                style={{
                  background:
                    cartQty > 0
                      ? 'linear-gradient(135deg,#16a34a,#22c55e)'
                      : 'linear-gradient(135deg,#d97706,#f59e0b)',
                  color: '#ffffff',
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow:
                    cartQty > 0
                      ? '0 4px 12px rgba(22,163,74,0.3)'
                      : '0 4px 12px rgba(217,119,6,0.25)',
                }}
              >
                {cartQty > 0 ? (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" /> In Cart ({cartQty})
                    · Add More
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                  </>
                )}
              </motion.button>
              <motion.button
                onClick={() => onChat ? onChat() : setShowChat(true)}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200"
                style={{
                  background: 'var(--fd-btn-muted-bg)',
                  border: '1px solid var(--fd-btn-muted-border)',
                  color: 'var(--fd-btn-muted-text)',
                }}
                title="Chat with farmer"
              >
                <MessageCircle className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Fav / Compare row */}
            <div className="flex gap-2">
              <button
                onClick={handleFavouriteClick}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-medium transition-all duration-200"
                style={{
                  background: isFavourite
                    ? 'rgba(239,68,68,0.08)'
                    : 'var(--fd-btn-muted-bg)',
                  border: isFavourite
                    ? '1px solid rgba(239,68,68,0.3)'
                    : '1px solid var(--fd-btn-muted-border)',
                  color: isFavourite ? '#ef4444' : 'var(--fd-btn-muted-text)',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <Heart
                  className="w-3 h-3"
                  fill={isFavourite ? '#ef4444' : 'none'}
                />
                {isFavourite ? 'Saved' : 'Save'}
              </button>

              {isInCompare ? (
                <div className="flex-1 flex gap-1">
                  <button
                    onClick={handleCompareToggle}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[10px] font-medium transition-all duration-200"
                    style={{
                      background: 'rgba(59,130,246,0.08)',
                      border: '1px solid rgba(59,130,246,0.3)',
                      color: '#3b82f6',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    <GitCompare className="w-3 h-3" /> Added
                  </button>
                  <button
                    onClick={handleViewCompare}
                    className="px-2 py-2 rounded-xl text-[10px] font-medium transition-all duration-200"
                    style={{
                      background: 'rgba(59,130,246,0.12)',
                      border: '1px solid rgba(59,130,246,0.3)',
                      color: '#3b82f6',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    View
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleCompareToggle}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-medium transition-all duration-200"
                  style={{
                    background: 'var(--fd-btn-muted-bg)',
                    border: '1px solid var(--fd-btn-muted-border)',
                    color: 'var(--fd-btn-muted-text)',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <GitCompare className="w-3 h-3" /> Compare
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showCartModal && (
          <CartModal
            item={item}
            onClose={() => setShowCartModal(false)}
            onConfirm={handleCartConfirm}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showChat && (
          <ChatPanel item={item} onClose={() => setShowChat(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showCompareModal && (
          <CompareModal
            item={item}
            onClose={() => setShowCompareModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
