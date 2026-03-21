import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ShieldCheck,
  Lock,
  RefreshCcw,
  BarChart3,
  Zap,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'

const TRUST_FEATURES = [
  {
    icon: <Lock className="w-5 h-5" />,
    title: 'Escrow Protected',
    desc: 'Buyer funds are held securely until the order is confirmed received. No risk for either party.',
    color: '#16a34a',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Flat 5% Commission',
    desc: 'The same transparent fee for every farmer. No tiers, no surprises, no volume penalties.',
    color: '#3b82f6',
  },
  {
    icon: <RefreshCcw className="w-5 h-5" />,
    title: 'Dispute Resolution',
    desc: 'Problems with an order? Our team mediates fairly within 24 hours — protecting both sides.',
    color: '#d97706',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Instant Payout',
    desc: "Once buyer confirms delivery, funds hit the farmer's account in minutes — not days.",
    color: '#a855f7',
  },
]

const ESCROW_STAGES = [
  {
    label: 'Buyer Pays',
    icon: '💳',
    desc: 'Funds held in escrow',
    color: '#3b82f6',
  },
  {
    label: 'Farmer Ships',
    icon: '📦',
    desc: 'Order packed & dispatched',
    color: '#d97706',
  },
  {
    label: 'Buyer Confirms',
    icon: '✅',
    desc: 'Receipt acknowledged',
    color: '#16a34a',
  },
  {
    label: 'Farmer Paid',
    icon: '💰',
    desc: 'Instant payout released',
    color: '#a855f7',
  },
]

const SALE_AMOUNTS = [
  { label: 'Try ₹5,000', value: 5000 },
  { label: '₹10,000', value: 10000 },
  { label: '₹25,000', value: 25000 },
  { label: '₹50,000', value: 50000 },
]

function AnimatedBar({
  pct,
  color,
  delay = 0,
}: {
  pct: number
  color: string
  delay?: number
}) {
  return (
    <div
      className="h-3 rounded-full overflow-hidden"
      style={{
        background: 'var(--fd-bg-3)',
        border: '1px solid var(--fd-border)',
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
        className="h-full rounded-full relative overflow-hidden"
        style={{ background: color }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ x: ['-100%', '200%'] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
            delay: delay + 0.5,
          }}
          style={{
            background:
              'linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.35) 50%, transparent 80%)',
          }}
        />
      </motion.div>
    </div>
  )
}

export function EscrowBanner() {
  const [activeStage, setActiveStage] = useState<number | null>(null)
  const [saleAmount, setSaleAmount] = useState(100)

  const fee = saleAmount * 0.05
  const farmerReceives = saleAmount - fee

  return (
    <section
      id="escrow"
      className="py-16 sm:py-24 relative overflow-hidden"
      style={{ background: 'var(--fd-bg)' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(22,163,74,0.4), transparent)',
        }}
      />

      {/* Decorative background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(22,163,74,0.04)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              border: '1px solid rgba(22,163,74,0.3)',
              background: 'var(--fd-green-bg)',
              color: '#14532d',
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Secure Payments
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
            Money Moves{' '}
            <span className="italic" style={{ color: '#16a34a' }}>
              Safely
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-lg mx-auto text-sm sm:text-base"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: 'var(--fd-text-3)',
            }}
          >
            Our escrow model ensures farmers get paid fairly and buyers receive
            what they ordered. No chargebacks, no scams.
          </motion.p>
        </div>

        {/* Interactive Escrow flow diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-16"
        >
          <div className="flex flex-wrap items-center justify-center gap-0">
            {ESCROW_STAGES.map((stage, i) => (
              <div key={stage.label} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.12 }}
                  className="flex flex-col items-center gap-2 px-3 sm:px-6 py-4 cursor-pointer"
                  onClick={() => setActiveStage(activeStage === i ? null : i)}
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    animate={
                      activeStage === i
                        ? { scale: [1, 1.12, 1], rotate: [0, -5, 5, 0] }
                        : {}
                    }
                    transition={{ duration: 0.5 }}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-lg transition-all duration-300"
                    style={{
                      background:
                        activeStage === i
                          ? `${stage.color}15`
                          : 'var(--fd-surface)',
                      border:
                        activeStage === i
                          ? `2px solid ${stage.color}50`
                          : '1px solid var(--fd-border-mid)',
                      boxShadow:
                        activeStage === i
                          ? `0 0 20px ${stage.color}20`
                          : 'none',
                    }}
                  >
                    {stage.icon}
                  </motion.div>
                  <div className="text-center">
                    <div
                      className="text-xs font-bold transition-colors"
                      style={{
                        color:
                          activeStage === i ? stage.color : 'var(--fd-text)',
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {stage.label}
                    </div>
                    <div
                      className="text-[10px]"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: 'var(--fd-text-muted)',
                      }}
                    >
                      {stage.desc}
                    </div>
                  </div>
                </motion.div>
                {i < ESCROW_STAGES.length - 1 && (
                  <motion.div
                    animate={activeStage === i ? { x: [0, 4, 0] } : {}}
                    transition={{
                      duration: 0.8,
                      repeat: activeStage === i ? Infinity : 0,
                    }}
                  >
                    <ChevronRight
                      className="w-4 h-4 shrink-0 hidden sm:block"
                      style={{ color: 'var(--fd-border-strong)' }}
                    />
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          <AnimatePresence>
            {activeStage !== null && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 max-w-xs mx-auto p-4 rounded-2xl text-center"
                style={{
                  background: `${ESCROW_STAGES[activeStage].color}08`,
                  border: `1px solid ${ESCROW_STAGES[activeStage].color}25`,
                }}
              >
                <p
                  className="text-sm"
                  style={{
                    color: ESCROW_STAGES[activeStage].color,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {activeStage === 0 &&
                    'Your payment is immediately locked in escrow — the farmer cannot access it until you confirm receipt.'}
                  {activeStage === 1 &&
                    'The farmer prepares and ships your order. You receive real-time updates at every step.'}
                  {activeStage === 2 &&
                    'Once you confirm delivery and quality, escrow releases automatically. Rate your experience!'}
                  {activeStage === 3 &&
                    'The farmer receives 95% of the sale price directly to their bank account within minutes.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Trust features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10 sm:mb-12">
          {TRUST_FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-default"
              style={{
                background: 'var(--fd-surface)',
                borderColor: `${feature.color}20`,
                boxShadow: 'var(--fd-card-shadow)',
              }}
            >
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3 sm:mb-4"
                style={{
                  background: `${feature.color}15`,
                  color: feature.color,
                }}
              >
                {feature.icon}
              </div>
              <h4
                className="text-sm font-bold mb-2"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: 'var(--fd-text)',
                }}
              >
                {feature.title}
              </h4>
              <p
                className="text-xs leading-relaxed"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: 'var(--fd-text-3)',
                }}
              >
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Interactive Commission Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-5 sm:p-8 rounded-2xl"
          style={{
            background: 'var(--fd-surface)',
            border: '1px solid var(--fd-border-mid)',
            boxShadow: 'var(--fd-card-shadow)',
          }}
        >
          <h3
            className="font-bold mb-2 text-center"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
              color: 'var(--fd-text)',
            }}
          >
            💡 How a Sale Works
          </h3>
          <p
            className="text-xs text-center mb-6"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: 'var(--fd-text-muted)',
            }}
          >
            Click a sale amount to see the breakdown
          </p>

          {/* Amount selector */}
          <div className="flex gap-2 justify-center flex-wrap mb-6 sm:mb-8">
            {SALE_AMOUNTS.map((amt) => (
              <motion.button
                key={amt.value}
                onClick={() => setSaleAmount(amt.value)}
                whileTap={{ scale: 0.95 }}
                className="px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200"
                style={{
                  background:
                    saleAmount === amt.value ? '#d97706' : 'var(--fd-bg-2)',
                  color:
                    saleAmount === amt.value ? '#ffffff' : 'var(--fd-text-3)',
                  border:
                    saleAmount === amt.value
                      ? '1px solid #d97706'
                      : '1px solid var(--fd-border)',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {amt.label}
              </motion.button>
            ))}
          </div>

          {/* Animated breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {[
              {
                label: 'Buyer Pays',
                amount: saleAmount,
                color: '#3b82f6',
                pct: 100,
                icon: '💳',
              },
              {
                label: 'Platform Fee (5%)',
                amount: fee,
                color: '#d97706',
                pct: 5,
                icon: '🏛️',
              },
              {
                label: 'Farmer Receives',
                amount: farmerReceives,
                color: '#16a34a',
                pct: 95,
                icon: '🧑‍🌾',
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="text-center p-3 sm:p-4 rounded-2xl"
                style={{
                  background: `${item.color}08`,
                  border: `1px solid ${item.color}18`,
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-xl sm:text-2xl mb-2">{item.icon}</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={item.amount}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{
                      color: item.color,
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 'clamp(1.25rem, 4vw, 1.875rem)',
                      fontWeight: 900,
                    }}
                    className="mb-1"
                  >
                    ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </motion.div>
                </AnimatePresence>
                <div
                  className="text-xs mb-3"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: 'var(--fd-text-3)',
                  }}
                >
                  {item.label}
                </div>
                <AnimatedBar
                  pct={item.pct}
                  color={item.color}
                  delay={0.3 + i * 0.1}
                />
                <div
                  className="text-xs mt-1.5 font-semibold"
                  style={{
                    color: item.color,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {item.pct}% of sale
                </div>
              </motion.div>
            ))}
          </div>

          {/* Flow arrow */}
          <div
            className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: 'var(--fd-text-muted)',
            }}
          >
            <span
              className="px-3 py-1 rounded-full"
              style={{
                background: '#3b82f610',
                color: '#3b82f6',
                border: '1px solid #3b82f625',
              }}
            >
              Buyer: ₹{saleAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <ArrowRight
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              style={{ color: '#d97706' }}
            />
            <span
              className="px-3 py-1 rounded-full"
              style={{
                background: '#d9770610',
                color: '#d97706',
                border: '1px solid #d9770625',
              }}
            >
              Escrow holds
            </span>
            <ArrowRight
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              style={{ color: '#16a34a' }}
            />
            <span
              className="px-3 py-1 rounded-full"
              style={{
                background: '#16a34a10',
                color: '#16a34a',
                border: '1px solid #16a34a25',
              }}
            >
              Farmer: ₹{farmerReceives.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <p
            className="text-xs mt-4 sm:mt-6 text-center"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: 'var(--fd-text-muted)',
            }}
          >
            No subscription. No listing fees. No hidden charges. We only earn
            when you earn.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
