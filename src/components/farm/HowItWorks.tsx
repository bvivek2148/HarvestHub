import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Link } from '@tanstack/react-router'
import {
  UserPlus,
  Camera,
  ShoppingBag,
  MessageSquare,
  ShieldCheck,
  Star,
  ArrowRight,
  WifiOff,
  Smartphone,
  RefreshCw,
  Download,
  CheckCircle,
} from 'lucide-react'

const FARMER_STEPS = [
  {
    icon: <UserPlus className="w-5 h-5 sm:w-6 sm:h-6" />,
    step: '01',
    title: 'Onboard with Icons',
    desc: 'Simple icon-guided forms designed for first-time smartphone users. No typing heavy descriptions — just tap, snap, and list.',
    accent: '#d97706',
  },
  {
    icon: <Camera className="w-5 h-5 sm:w-6 sm:h-6" />,
    step: '02',
    title: 'Photograph & List',
    desc: 'Upload produce photos, set price per unit, mark growing practices, and define pickup windows. Done in under 3 minutes.',
    accent: '#16a34a',
  },
  {
    icon: <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />,
    step: '03',
    title: 'Chat & Negotiate',
    desc: 'Receive buyer inquiries via real-time in-app chat. Discuss bulk pricing, custom orders, or delivery logistics.',
    accent: '#3b82f6',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />,
    step: '04',
    title: 'Get Paid Securely',
    desc: 'Funds held in escrow until buyer confirms receipt. Flat 5% platform commission — no hidden fees, ever.',
    accent: '#d97706',
  },
]

const BUYER_STEPS = [
  {
    icon: <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />,
    step: '01',
    title: 'Browse & Discover',
    desc: 'Filter by produce type, location, or farmer. See freshness indicators, growing practices, and real inventory counts.',
    accent: '#d97706',
  },
  {
    icon: <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />,
    step: '02',
    title: 'Chat with Farmers',
    desc: 'Ask questions, request custom quantities, or arrange a direct pickup. Farmers typically respond within minutes.',
    accent: '#16a34a',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />,
    step: '03',
    title: 'Pay in Escrow',
    desc: 'Your payment is protected until you confirm the order. Rate produce quality. Funds release to farmer automatically.',
    accent: '#3b82f6',
  },
  {
    icon: <Star className="w-5 h-5 sm:w-6 sm:h-6" />,
    step: '04',
    title: 'Rate & Repeat',
    desc: 'Leave reviews, build a relationship with your favourite farmer, and set recurring orders for weekly deliveries.',
    accent: '#d97706',
  },
]

const OFFLINE_FEATURES = [
  {
    icon: <WifiOff className="w-4 h-4 sm:w-5 sm:h-5" />,
    title: 'Works on 2G',
    desc: 'Ultra-lightweight pages load even on the slowest rural connections.',
    color: '#16a34a',
  },
  {
    icon: <Download className="w-4 h-4 sm:w-5 sm:h-5" />,
    title: 'Cache & Browse',
    desc: 'Install as PWA — browse cached listings and build your cart offline.',
    color: '#3b82f6',
  },
  {
    icon: <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />,
    title: 'Auto-Sync',
    desc: 'Orders and messages sync automatically when connectivity returns.',
    color: '#d97706',
  },
  {
    icon: <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />,
    title: 'Any Device',
    desc: 'Works on budget Android phones and basic iOS — no app store needed.',
    color: '#a855f7',
  },
]

function StepCard({
  step,
  index,
}: {
  step: (typeof FARMER_STEPS)[0]
  index: number
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative flex gap-4 sm:gap-5 group cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {index < 3 && (
        <div
          className="absolute left-5 top-12 bottom-0 w-px"
          style={{
            background:
              'linear-gradient(to bottom, var(--fd-border-mid), transparent)',
          }}
        />
      )}
      <motion.div
        className="relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
        animate={
          hovered ? { scale: 1.15, rotate: [0, -5, 5, 0] } : { scale: 1 }
        }
        transition={{ duration: 0.4 }}
        style={{
          background: hovered ? `${step.accent}30` : `${step.accent}18`,
          border: `1px solid ${step.accent}${hovered ? '70' : '40'}`,
          color: step.accent,
          boxShadow: hovered ? `0 0 20px ${step.accent}30` : 'none',
        }}
      >
        {step.icon}
      </motion.div>
      <div className="pb-7 sm:pb-8">
        <div
          className="text-[10px] sm:text-xs font-bold tracking-widest mb-1"
          style={{ color: step.accent, fontFamily: "'DM Sans', sans-serif" }}
        >
          STEP {step.step}
        </div>
        <h4
          className="text-sm sm:text-base font-bold mb-1.5"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: 'var(--fd-text)',
          }}
        >
          {step.title}
        </h4>
        <p
          className="text-xs sm:text-sm leading-relaxed"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: 'var(--fd-text-3)',
          }}
        >
          {step.desc}
        </p>
      </div>
    </motion.div>
  )
}

function PWAMockup() {
  const [installed, setInstalled] = useState(false)
  const [installing, setInstalling] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleInstall = () => {
    if (installed || installing) return
    setInstalling(true)
    setProgress(0)
    const iv = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(iv)
          setInstalling(false)
          setInstalled(true)
          return 100
        }
        return p + Math.random() * 15
      })
    }, 120)
  }

  return (
    <motion.div
      className="relative mx-auto"
      style={{ width: 'min(200px, 60vw)' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
    >
      <div
        className="rounded-[28px] overflow-hidden border-2 shadow-2xl"
        style={{
          borderColor: 'var(--fd-border-mid)',
          background: 'var(--fd-surface)',
          boxShadow: '0 0 40px rgba(22,163,74,0.12)',
        }}
      >
        <div
          className="h-6 px-4 flex items-center justify-between"
          style={{ background: 'var(--fd-bg-2)' }}
        >
          <span
            className="text-[8px]"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: 'var(--fd-text-muted)',
            }}
          >
            9:41
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1 rounded-sm"
                style={{
                  height: 4 + i * 2,
                  background: i <= 2 ? '#16a34a' : 'var(--fd-border)',
                }}
              />
            ))}
            <div
              className="w-2 h-1.5 rounded-sm ml-0.5"
              style={{
                background: '#16a34a',
                border: '0.5px solid var(--fd-border)',
              }}
            />
          </div>
        </div>

        <div
          className="p-3"
          style={{ background: 'var(--fd-bg)', minHeight: 240 }}
        >
          <div className="flex justify-center mb-4 mt-2">
            <motion.div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg text-2xl"
              style={{
                background: 'linear-gradient(135deg,#d97706,#92400e)',
                boxShadow: '0 4px 20px rgba(217,119,6,0.35)',
              }}
              animate={
                installed ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}
              }
              transition={{ duration: 0.6 }}
            >
              🌾
            </motion.div>
          </div>

          <p
            className="text-center text-[10px] font-bold mb-1"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: 'var(--fd-text)',
            }}
          >
            HarvestHub
          </p>
          <p
            className="text-center text-[8px] mb-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: 'var(--fd-text-muted)',
            }}
          >
            Harvest Fresh, Direct
          </p>

          {!installed ? (
            <button
              onClick={handleInstall}
              className="w-full py-2 rounded-xl text-[10px] font-bold transition-all"
              style={{
                background: installing
                  ? 'var(--fd-section-bg)'
                  : 'linear-gradient(135deg,#d97706,#b8870f)',
                color: installing ? '#d97706' : '#ffffff',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {installing ? (
                <div>
                  <div className="mb-1">
                    Installing… {Math.round(progress)}%
                  </div>
                  <div
                    className="h-1 rounded-full mx-1"
                    style={{ background: 'var(--fd-border)' }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ width: `${progress}%`, background: '#d97706' }}
                    />
                  </div>
                </div>
              ) : (
                <>📲 Add to Home Screen</>
              )}
            </button>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full py-2 rounded-xl text-[10px] font-bold text-center"
              style={{
                background: 'rgba(22,163,74,0.12)',
                color: '#16a34a',
                border: '1px solid rgba(22,163,74,0.35)',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <CheckCircle className="w-3 h-3 inline mr-1" />
              Installed! Opens offline
            </motion.div>
          )}

          <div className="mt-3 flex items-center gap-1.5 justify-center">
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ background: '#16a34a' }}
            />
            <span
              className="text-[8px]"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: 'var(--fd-text-muted)',
              }}
            >
              {installed ? 'Ready offline' : 'Works on 2G · Offline capable'}
            </span>
          </div>
        </div>
      </div>
      <div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 rounded-full blur-xl"
        style={{ background: 'rgba(22,163,74,0.18)' }}
      />
    </motion.div>
  )
}

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const centerScale = useTransform(
    scrollYProgress,
    [0.2, 0.5, 0.8],
    [0.9, 1, 0.9],
  )
  const centerOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.3, 0.7, 0.9],
    [0, 1, 1, 0],
  )

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-16 sm:py-24 relative overflow-hidden"
      style={{ background: 'var(--fd-section-bg)' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, var(--fd-gold), transparent)',
          opacity: 0.35,
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse, rgba(16,163,74,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              border: '1px solid var(--fd-border-mid)',
              background: 'var(--fd-green-bg)',
              color: '#14532d',
            }}
          >
            ⚡ How It Works
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
            Simple for Everyone
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
            Whether you grow it or eat it — HarvestHub is designed to work on
            any device, any connection speed.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-12 items-start">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 flex-wrap"
            >
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base"
                style={{
                  background: 'rgba(217,119,6,0.12)',
                  border: '1px solid rgba(217,119,6,0.3)',
                }}
              >
                🧑‍🌾
              </div>
              <h3
                className="text-base sm:text-lg font-bold"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: 'var(--fd-text)',
                }}
              >
                For Farmers
              </h3>
              <Link
                to="/join-farmer"
                className="ml-auto flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg,#22c55e,#16a34a)',
                  color: '#ffffff',
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: '0 4px 12px rgba(22,197,94,0.25)',
                }}
              >
                <span>🌾</span>Join as a Farmer
                <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
            <div className="space-y-0">
              {FARMER_STEPS.map((step, i) => (
                <StepCard key={step.step} step={step} index={i} />
              ))}
            </div>
          </div>

          <motion.div
            style={{ scale: centerScale, opacity: centerOpacity }}
            className="hidden lg:flex flex-col items-center gap-4 sticky top-32 self-start mt-16"
          >
            <div
              className="w-px h-20"
              style={{
                background:
                  'linear-gradient(to bottom, transparent, var(--fd-gold))',
                opacity: 0.6,
              }}
            />
            <div
              className="w-16 h-16 xl:w-20 xl:h-20 rounded-full flex items-center justify-center shadow-xl text-2xl xl:text-3xl"
              style={{
                background: 'var(--fd-surface)',
                border: '2px solid var(--fd-border-mid)',
                boxShadow: '0 8px 32px rgba(217,119,6,0.12)',
              }}
            >
              🌾
            </div>
            <div className="text-center">
              <div
                className="text-xs font-semibold tracking-widest uppercase"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: '#d97706',
                }}
              >
                Direct
              </div>
              <div
                className="text-xs"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: 'var(--fd-text-muted)',
                }}
              >
                Connection
              </div>
            </div>
            <div
              className="w-px h-20"
              style={{
                background:
                  'linear-gradient(to bottom, var(--fd-gold), transparent)',
                opacity: 0.6,
              }}
            />
          </motion.div>

          <div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-6 sm:mb-8"
            >
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base"
                style={{
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.25)',
                }}
              >
                🛒
              </div>
              <h3
                className="text-base sm:text-lg font-bold"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: 'var(--fd-text)',
                }}
              >
                For Buyers
              </h3>
            </motion.div>
            <div className="space-y-0">
              {BUYER_STEPS.map((step, i) => (
                <StepCard key={step.step} step={step} index={i} />
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20"
        >
          <div
            className="rounded-2xl sm:rounded-3xl overflow-hidden relative"
            style={{
              background: 'var(--fd-surface)',
              border: '1px solid var(--fd-border-mid)',
              boxShadow: '0 8px 40px rgba(16,163,74,0.08)',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(16,163,74,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,163,74,0.04) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to right, var(--fd-surface) 0%, transparent 20%, transparent 80%, var(--fd-surface) 100%)',
              }}
            />

            <div className="relative z-10 p-6 sm:p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-center">
                <div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      border: '1px solid rgba(22,163,74,0.3)',
                      background: 'rgba(22,163,74,0.08)',
                      color: '#16a34a',
                    }}
                  >
                    <WifiOff className="w-3 h-3" /> Works Offline Too
                  </motion.div>
                  <h3
                    className="font-black mb-4 leading-tight"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                      color: 'var(--fd-text)',
                    }}
                  >
                    Built for the{' '}
                    <span className="italic" style={{ color: '#16a34a' }}>
                      Real World
                    </span>
                  </h3>
                  <p
                    className="mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: 'var(--fd-text-3)',
                    }}
                  >
                    Rural farms don't always have 4G. HarvestHub is engineered
                    for the real world — ultra-light, offline-capable, and
                    installable on any smartphone from the browser.
                  </p>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {OFFLINE_FEATURES.map((feat, i) => (
                      <motion.div
                        key={feat.title}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        className="p-3 sm:p-4 rounded-2xl"
                        style={{
                          background: `${feat.color}08`,
                          border: `1px solid ${feat.color}22`,
                        }}
                      >
                        <div
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center mb-2 sm:mb-3"
                          style={{
                            background: `${feat.color}18`,
                            color: feat.color,
                          }}
                        >
                          {feat.icon}
                        </div>
                        <div
                          className="text-xs font-bold mb-1"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            color: 'var(--fd-text)',
                          }}
                        >
                          {feat.title}
                        </div>
                        <div
                          className="text-[10px] leading-relaxed"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            color: 'var(--fd-text-3)',
                          }}
                        >
                          {feat.desc}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex flex-col xs:flex-row gap-3">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-full text-sm font-semibold transition-all"
                      style={{
                        background: 'var(--fd-surface-2)',
                        border: '1px solid var(--fd-border-mid)',
                        color: 'var(--fd-text)',
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      <span>🍎</span> Add to iPhone
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-full text-sm font-bold transition-all"
                      style={{
                        background: 'linear-gradient(135deg,#22c55e,#16a34a)',
                        color: '#ffffff',
                        fontFamily: "'DM Sans', sans-serif",
                        boxShadow: '0 4px 16px rgba(34,197,94,0.25)',
                      }}
                    >
                      <span>🤖</span> Install on Android
                    </motion.button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <PWAMockup />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
