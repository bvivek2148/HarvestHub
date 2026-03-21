import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Bot,
  X,
  Send,
  Sparkles,
  ChevronDown,
  Leaf,
  ShoppingBag,
  TrendingUp,
  Truck,
  ShieldCheck,
  BarChart3,
  Mic,
  Paperclip,
  RefreshCw,
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  category?: string
}

const CATEGORIES = [
  { id: 'all', label: 'All', icon: <Sparkles className="w-3 h-3" /> },
  { id: 'buy', label: 'Buy', icon: <ShoppingBag className="w-3 h-3" /> },
  { id: 'sell', label: 'Sell', icon: <TrendingUp className="w-3 h-3" /> },
  { id: 'delivery', label: 'Delivery', icon: <Truck className="w-3 h-3" /> },
  { id: 'escrow', label: 'Escrow', icon: <ShieldCheck className="w-3 h-3" /> },
  { id: 'market', label: 'Market', icon: <BarChart3 className="w-3 h-3" /> },
  { id: 'organic', label: 'Organic', icon: <Leaf className="w-3 h-3" /> },
]

const PROMPTS_BY_CATEGORY: Record<string, { label: string; key: string }[]> = {
  all: [
    { label: '🍅 Find fresh tomatoes', key: 'tomatoes' },
    { label: '💰 How are prices set?', key: 'prices' },
    { label: '📦 Track my order', key: 'track' },
    { label: '🤝 How does escrow work?', key: 'escrow' },
  ],
  buy: [
    { label: '🍅 Find tomatoes near me', key: 'tomatoes' },
    { label: '🥦 Best organic greens?', key: 'organic' },
    { label: '🛒 How do I place an order?', key: 'order' },
    { label: '⭐ Top-rated farmers?', key: 'topfarmers' },
  ],
  sell: [
    { label: '💰 How do I set prices?', key: 'prices' },
    { label: '📸 Tips for product photos?', key: 'photos' },
    { label: '🌿 What certifications help?', key: 'certifications' },
    { label: '📈 How to boost visibility?', key: 'visibility' },
  ],
  delivery: [
    { label: '🚚 Delivery options?', key: 'delivery' },
    { label: '📦 Track my order', key: 'track' },
    { label: '⏱️ Same-day delivery?', key: 'sameday' },
    { label: '🗺️ Delivery zones?', key: 'zones' },
  ],
  escrow: [
    { label: '🤝 How does escrow work?', key: 'escrow' },
    { label: '💵 When do farmers get paid?', key: 'farmerpay' },
    { label: '🔒 Is my money safe?', key: 'safe' },
    { label: '⚖️ Dispute resolution?', key: 'dispute' },
  ],
  market: [
    { label: '📊 Current tomato prices?', key: 'marketprice' },
    { label: "📅 What's in season now?", key: 'season' },
    { label: '📉 Price trends this week?', key: 'trends' },
    { label: '🏆 Top selling produce?', key: 'topselling' },
  ],
  organic: [
    { label: '🌿 What certifications help?', key: 'certifications' },
    { label: '🥗 Find certified organic?', key: 'organic' },
    { label: '🌱 Is no-spray enough?', key: 'nospray' },
    { label: '💚 Organic premium pricing?', key: 'organicprice' },
  ],
}

const RESPONSES: Record<string, string> = {
  tomatoes:
    'I can help you find fresh tomatoes from our local farmers! 🍅\n\nCheck the **Marketplace** for live listings. Many of our farmers offer heirlooms, cherry tomatoes, and organic varieties harvested daily.\n\nWould you like to filter by organic practices or price?',
  prices:
    "Pricing on HarvestHub is set directly by farmers based on local market conditions:\n\n📊 **Live Benchmarks** — check the 'Market' tab for current averages\n🌿 **Organic Premium** — typically higher due to sustainable practices\n📉 **Seasonal Trends** — prices often adjust based on harvest abundance\n\nYou can see the exact price per unit on every listing. Want to see current price trends?",
  track:
    'You can track your orders directly from your **Dashboard** 🚚\n\nSimply go to the "Orders" tab to see real-time status updates: from confirmation to out-for-delivery. You can also chat with the farmer directly if you have specific delivery questions!',
  certifications:
    "Farmers on HarvestHub showcase various practices to build trust:\n\n🌿 **FSSAI Registered** — verified food safety standards\n🌱 **Organic India** — certified sustainable farming\n✅ **Transparency** — check listing descriptions for 'no-spray' or 'natural' tags\n\nLook for the practice icons in the marketplace to find produce that matches your preferences.",
  delivery:
    'HarvestHub farmers offer several convenient delivery modes 🚚\n\n📍 **Farm Pickup** — the freshest option, directly from the source\n🏘️ **Local Delivery** — many farmers deliver within their community\n📦 **Coordinated Shipping** — available for select produce and regions\n\nYou can filter the marketplace by your preferred delivery method!',
  escrow:
    "Our secure escrow system protects your payment 🔒\n\n1️⃣ **Secure Payment** — funds are held safely when you order\n2️⃣ **Farmer Prepares** — produce is harvested and packed\n3️⃣ **Delivery Confirmed** — you confirm everything is perfect\n4️⃣ **Payment Released** — only then does the farmer receive the funds\n\nIt’s the safest way to buy fresh, local food online.",
  organic:
    'We have many dedicated organic producers on the platform! 🌿\n\nUse the **"Organic"** filter in the Marketplace to see all currently available certified and natural listings. From leafy greens to seasonal fruits, you’ll find the best our local soil has to offer.',
  order:
    'Placing an order is simple and secure 🛒\n\n1. Browse the **Marketplace** and find what you need\n2. Add to your cart and select quantities\n3. Choose your delivery or pickup preference\n4. Your payment is held in **Escrow** until you receive the goods\n\nNeed help finding a specific item?',
  topfarmers:
    'Our marketplace features highly-rated local producers! 🏆\n\nYou can identify top farmers by their ratings and reviews on their listings. Look for the "Verified" badges for extra peace of mind. Would you like to see the current top-rated listings?',
  photos:
    'Quality photos help our farmers showcase their hard work 📸\n\nWe encourage farmers to use natural light and clear angles to show the true quality of their harvest. This transparency helps you buy with confidence. Check out the latest produce photos in the Marketplace!',
  visibility:
    "Farmers can boost their reach by being detailed and responsive 📈\n\nAccurate descriptions and quick chat replies help listings stand out. If you're a farmer, try adding multiple photos and clear harvest dates to attract more buyers!",
  sameday:
    'Select farmers offer same-day or next-day delivery ⚡\n\nCheck for the "Fast Delivery" tags or "Available Today" notes on marketplace listings. It’s the fastest way to get global-quality produce from a local source!',
  zones:
    "Delivery availability is determined by each individual farm 🗺️\n\nMost farmers list their delivery radius or pickup locations clearly. You can also use the location filters in the Marketplace to see who delivers to your area.",
  farmerpay:
    "Farmers are paid promptly after a successful transaction 💵\n\nOnce the buyer confirms delivery, the funds are released from escrow to the farmer's account. This ensures fair treatment for both parties. Detailed breakdowns are available in the Farmer Dashboard.",
  safe: "Your security is our top priority 🔒\n\nEvery transaction is protected by our escrow system and secure payment processing. If an order isn't right, our support team at **harvesthub.helpdesk@gmail.com** is here to help resolve it quickly.",
  dispute:
    'We aim for 100% satisfaction on every order ⚖️\n\nIn the rare case of an issue, buyers and farmers can resolve it through our mediation process. Contact **harvesthub.helpdesk@gmail.com** with your order details and photos for quick assistance.',
  marketprice:
    'Market prices are live and dynamic 📊\n\nThey reflect current harvest conditions and local demand. To see today’s exact pricing, head over to the **"Market"** or **"Explore"** tabs for real-time data from our producers.',
  season:
    "Discover what's in peak season right now 📅\n\nOur seasonal filters make it easy to find produce at its nutritional and flavor peak. Check the **Marketplace** categories to see what our farmers are harvesting today!",
  trends:
    "Stay ahead with the latest agricultural trends 📉📈\n\nMarket data helps both buyers and farmers make informed decisions. Check the 'Analytics' and 'Market' tabs for insights into regional pricing and supply.",
  topselling:
    'Find out what’s trending in the local harvest! 🏆\n\nOur "Most Popular" sort in the Marketplace shows you what other buyers are loving right now. It’s a great way to discover high-quality seasonal favorites.',
  nospray:
    "Many HarvestHub farmers follow 'No-Spray' and sustainable practices 🌱\n\nLook for specific practice tags like 'Biological Control' or 'Hand-Weeded' in listing descriptions. It's all about providing the healthiest food possible for our community.",
  organicprice:
    'Organic produce often reflects the true cost of sustainable farming 💚\n\nWhile prices may be slightly higher, they support farmers who invest in soil health and chemical-free growing. You can compare organic and conventional prices live in the Marketplace.',
}

const FALLBACK =
  "Thanks for asking! I'm gathering the latest data from our network of 2,400+ farmers across the region.\n\nFor the most accurate answer, I'll need a moment to check live inventory and market conditions.\n\nIn the meantime, try browsing the Marketplace or contact our helpdesk at **harvesthub.helpdesk@gmail.com** for immediate assistance. Is there anything else I can help with?"

const INITIAL_MESSAGE: Message = {
  id: 'init',
  role: 'assistant',
  text: "👋 Hi! I'm your HarvestHub AI assistant.\n\nI help **buyers** find the freshest local produce, and **farmers** optimise listings, pricing, and grow their customer base — all in real time.\n\nWhat can I help you with today?",
}

function MessageText({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <span>
      {lines.map((line, li) => {
        const parts = line.split(/\*\*(.*?)\*\*/g)
        return (
          <span key={li}>
            {parts.map((part, pi) =>
              pi % 2 === 1 ? (
                <strong key={pi} style={{ color: 'inherit', fontWeight: 700 }}>
                  {part}
                </strong>
              ) : (
                part
              ),
            )}
            {li < lines.length - 1 && <br />}
          </span>
        )
      })}
    </span>
  )
}

export function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        inputRef.current?.focus()
      }, 80)
      setUnread(0)
    }
  }, [messages, open, minimized])

  useEffect(() => {
    const t = setTimeout(() => {
      if (!open) setUnread(1)
    }, 6000)
    return () => clearTimeout(t)
  }, [open])

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInputValue('')
    setIsTyping(true)

    const lower = text.toLowerCase()
    const matchKey = Object.keys(RESPONSES).find((k) => lower.includes(k))
    const responseText = RESPONSES[matchKey ?? ''] ?? FALLBACK

    const delay = 900 + Math.random() * 700
    setTimeout(() => {
      setIsTyping(false)
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: responseText,
      }
      setMessages((prev) => [...prev, assistantMsg])
      if (!open || minimized) setUnread((n) => n + 1)
    }, delay)
  }

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE])
    setUnread(0)
  }

  const prompts =
    PROMPTS_BY_CATEGORY[activeCategory] ?? PROMPTS_BY_CATEGORY['all']

  return (
    <>
      {/* FAB */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 220, damping: 18 }}
        onClick={() => {
          setOpen(true)
          setMinimized(false)
          setUnread(0)
        }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          open ? 'scale-0 opacity-0 pointer-events-none' : 'hover:scale-110'
        }`}
        style={{
          background: 'linear-gradient(135deg,#d97706,#b8870f)',
          boxShadow: '0 0 32px rgba(217,119,6,0.35)',
        }}
        aria-label="Open AI assistant"
      >
        <Sparkles className="w-6 h-6 text-white" />
        <span
          className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: '#16a34a', border: '2px solid white' }}
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-white"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        </span>
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -left-1 w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center"
              style={{ border: '2px solid white' }}
            >
              {unread}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-6 right-6 z-50 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            style={{
              width: 'min(92vw, 400px)',
              maxHeight: minimized ? 'auto' : '82vh',
              background: 'var(--fd-surface)',
              border: '1px solid var(--fd-border-mid)',
              boxShadow:
                '0 8px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(217,119,6,0.08)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 border-b shrink-0"
              style={{
                background: 'var(--fd-section-bg)',
                borderColor: 'var(--fd-border)',
              }}
            >
              <motion.div
                className="relative w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: 'linear-gradient(135deg,#d97706,#f59e0b)',
                }}
                animate={{ rotate: [0, 4, -4, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <Bot className="w-4 h-4 text-white" />
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full"
                  style={{
                    background: '#16a34a',
                    border: '2px solid var(--fd-surface)',
                  }}
                />
              </motion.div>

              <div className="flex-1 min-w-0">
                <div
                  className="text-xs font-bold"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: 'var(--fd-text)',
                  }}
                >
                  HarvestHub AI
                </div>
                <div className="flex items-center gap-1.5">
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#16a34a' }}
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  />
                  <span
                    className="text-[10px]"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: 'var(--fd-green)',
                    }}
                  >
                    Online · Smart farm assistant
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                <button
                  onClick={clearChat}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--fd-text-muted)' }}
                  title="Clear chat"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setMinimized(!minimized)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--fd-text-muted)' }}
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${minimized ? 'rotate-180' : ''}`}
                  />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--fd-text-muted)' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Collapsible body */}
            <AnimatePresence initial={false}>
              {!minimized && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="flex flex-col overflow-hidden"
                  style={{ maxHeight: 'calc(82vh - 56px)' }}
                >
                  {/* Category tabs */}
                  <div
                    className="flex gap-1.5 px-3 pt-3 pb-2 overflow-x-auto shrink-0"
                    style={{ scrollbarWidth: 'none' }}
                  >
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all duration-200 whitespace-nowrap"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          background:
                            activeCategory === cat.id
                              ? 'rgba(217,119,6,0.12)'
                              : 'var(--fd-bg-2)',
                          border:
                            activeCategory === cat.id
                              ? '1px solid rgba(217,119,6,0.45)'
                              : '1px solid var(--fd-border)',
                          color:
                            activeCategory === cat.id
                              ? '#d97706'
                              : 'var(--fd-text-muted)',
                        }}
                      >
                        {cat.icon}
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Messages */}
                  <div
                    className="flex-1 overflow-y-auto px-3 pt-1 pb-2 space-y-3"
                    style={{
                      minHeight: 200,
                      maxHeight: '45vh',
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'var(--fd-border-mid) transparent',
                    }}
                  >
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
                      >
                        {msg.role === 'assistant' && (
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mb-0.5"
                            style={{
                              background:
                                'linear-gradient(135deg,#d97706,#f59e0b)',
                            }}
                          >
                            <Bot className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div
                          className="max-w-[82%] px-3.5 py-2.5 text-xs leading-relaxed"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            background:
                              msg.role === 'user'
                                ? 'linear-gradient(135deg,#d97706,#f59e0b)'
                                : 'var(--fd-bg-2)',
                            color:
                              msg.role === 'user'
                                ? '#ffffff'
                                : 'var(--fd-text)',
                            border:
                              msg.role === 'assistant'
                                ? '1px solid var(--fd-border)'
                                : 'none',
                            borderRadius:
                              msg.role === 'user'
                                ? '18px 18px 4px 18px'
                                : '4px 18px 18px 18px',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          <MessageText text={msg.text} />
                        </div>
                        {msg.role === 'user' && (
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mb-0.5 text-[10px] font-bold"
                            style={{
                              background: 'rgba(217,119,6,0.15)',
                              color: '#d97706',
                              border: '1px solid rgba(217,119,6,0.3)',
                            }}
                          >
                            U
                          </div>
                        )}
                      </motion.div>
                    ))}

                    <AnimatePresence>
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-end gap-2"
                        >
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                            style={{
                              background:
                                'linear-gradient(135deg,#d97706,#f59e0b)',
                            }}
                          >
                            <Bot className="w-3 h-3 text-white" />
                          </div>
                          <div
                            className="px-4 py-3 flex gap-1.5 rounded-2xl rounded-bl-sm"
                            style={{
                              background: 'var(--fd-bg-2)',
                              border: '1px solid var(--fd-border)',
                            }}
                          >
                            {[0, 1, 2].map((i) => (
                              <motion.span
                                key={i}
                                animate={{ y: [0, -5, 0] }}
                                transition={{
                                  duration: 0.55,
                                  repeat: Infinity,
                                  delay: i * 0.14,
                                }}
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: '#d97706' }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div ref={bottomRef} />
                  </div>

                  {/* Quick prompts */}
                  <div
                    className="px-3 py-2 flex gap-2 overflow-x-auto shrink-0"
                    style={{
                      scrollbarWidth: 'none',
                      borderTop: '1px solid var(--fd-border)',
                    }}
                  >
                    {prompts.map((p) => (
                      <button
                        key={p.label}
                        onClick={() =>
                          sendMessage(p.label.replace(/^[\S]+ /, ''))
                        }
                        className="shrink-0 text-[10px] px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-200"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          border: '1px solid var(--fd-border)',
                          color: 'var(--fd-text-3)',
                          background: 'var(--fd-bg-2)',
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {/* Input bar */}
                  <div
                    className="p-3 flex gap-2 items-center shrink-0"
                    style={{ borderTop: '1px solid var(--fd-border)' }}
                  >
                    <button
                      className="p-2 transition-colors shrink-0"
                      style={{ color: 'var(--fd-text-muted)' }}
                      title="Attach file"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                    </button>
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' &&
                        !e.shiftKey &&
                        sendMessage(inputValue)
                      }
                      placeholder="Ask about produce, pricing, delivery…"
                      className="flex-1 bg-transparent border-0 text-xs focus:outline-none"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: 'var(--fd-text)',
                      }}
                    />
                    <button
                      className="p-2 transition-colors shrink-0"
                      style={{ color: 'var(--fd-text-muted)' }}
                      title="Voice input"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                    <motion.button
                      onClick={() => sendMessage(inputValue)}
                      disabled={!inputValue.trim() || isTyping}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-xl flex items-center justify-center disabled:opacity-35 transition-all shrink-0"
                      style={{
                        background: inputValue.trim()
                          ? 'linear-gradient(135deg,#d97706,#f59e0b)'
                          : 'var(--fd-bg-3)',
                        color: inputValue.trim()
                          ? '#ffffff'
                          : 'var(--fd-text-muted)',
                      }}
                    >
                      <Send className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>

                  {/* Powered by footer */}
                  <div
                    className="px-4 py-1.5 text-center"
                    style={{
                      background: 'var(--fd-bg-2)',
                      borderTop: '1px solid var(--fd-border)',
                    }}
                  >
                    <span
                      className="text-[9px]"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: 'var(--fd-text-muted)',
                      }}
                    >
                      Powered by HarvestHub AI · harvesthub.helpdesk@gmail.com
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
