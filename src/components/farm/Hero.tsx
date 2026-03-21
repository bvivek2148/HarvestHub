import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'motion/react'
import {
  ArrowDown,
  MapPin,
  Leaf,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { RoleAvatarCard } from './RoleAvatarCard'
import { useTheme } from 'next-themes'

// Rich, diverse farm-to-table imagery covering crops, markets, farmers, orchards
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1920&q=85', // sunrise field
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=85', // harvesting
  'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1920&q=85', // greenhouse rows
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=85', // wheat golden
  'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1920&q=85', // farm aerial
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1920&q=85', // farmers market
  'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1920&q=85', // apple orchard
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=85', // tractor vineyard
  'https://images.unsplash.com/photo-1595351298020-038700609878?w=1920&q=85', // fresh vegetables
  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&q=85', // agriculture field
]

const FLOATING_PRODUCE = [
  {
    emoji: '🍅',
    x: '6%',
    y: '28%',
    delay: 0,
    size: 'text-4xl xl:text-5xl',
    blur: false,
  },
  {
    emoji: '🥕',
    x: '88%',
    y: '22%',
    delay: 0.4,
    size: 'text-3xl xl:text-4xl',
    blur: true,
  },
  {
    emoji: '🌽',
    x: '10%',
    y: '72%',
    delay: 0.8,
    size: 'text-4xl xl:text-5xl',
    blur: false,
  },
  {
    emoji: '🍓',
    x: '82%',
    y: '70%',
    delay: 0.2,
    size: 'text-3xl xl:text-4xl',
    blur: false,
  },
  {
    emoji: '🥦',
    x: '94%',
    y: '48%',
    delay: 0.6,
    size: 'text-2xl xl:text-3xl',
    blur: true,
  },
  {
    emoji: '🍋',
    x: '3%',
    y: '50%',
    delay: 1.0,
    size: 'text-3xl xl:text-4xl',
    blur: true,
  },
  {
    emoji: '🫑',
    x: '16%',
    y: '15%',
    delay: 0.3,
    size: 'text-2xl xl:text-3xl',
    blur: true,
  },
  {
    emoji: '🥬',
    x: '76%',
    y: '12%',
    delay: 0.7,
    size: 'text-2xl xl:text-3xl',
    blur: true,
  },
  {
    emoji: '🍇',
    x: '92%',
    y: '80%',
    delay: 1.1,
    size: 'text-3xl xl:text-4xl',
    blur: true,
  },
  {
    emoji: '🌻',
    x: '2%',
    y: '85%',
    delay: 0.9,
    size: 'text-3xl xl:text-4xl',
    blur: false,
  },
]

const STATS = [
  {
    icon: <Leaf className="w-3 h-3 sm:w-4 sm:h-4" />,
    value: 'Growing',
    label: 'Active Farmers',
  },
  {
    icon: <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />,
    value: 'Direct',
    label: 'Communities',
  },
  {
    icon: <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />,
    value: 'Vibrant',
    label: 'Marketplace',
  },
  {
    icon: <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" />,
    value: '100%',
    label: 'Escrow Protected',
  },
]

const ROLE_CARDS = [
  {
    icon: '🧑\u200d🌾',
    role: 'Farmer',
    desc: 'List & sell your harvest',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.3)',
    badge: 'VERIFIED FARMER',
    stat: '2.4K+ farmers',
  },
  {
    icon: '🛒',
    role: 'Buyer',
    desc: 'Shop fresh, eat local',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.3)',
    badge: 'BUYER',
    stat: '18K+ orders',
  },
  {
    icon: '🛡️',
    role: 'Admin',
    desc: 'Manage the platform',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.12)',
    border: 'rgba(167,139,250,0.3)',
    badge: 'ADMIN',
    stat: 'Platform-wide',
  },
]

function BokehParticle({
  x,
  y,
  size,
  opacity,
  color,
  delay,
}: {
  x: string
  y: string
  size: number
  opacity: number
  color: string
  delay: number
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: color,
        filter: `blur(${size * 0.45}px)`,
        opacity,
      }}
      animate={{
        y: [0, -18, 0],
        opacity: [opacity * 0.5, opacity, opacity * 0.5],
      }}
      transition={{
        duration: 4 + delay,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  )
}

const BOKEH = Array.from({ length: 18 }, (_, i) => ({
  x: `${(i * 5.9 + 3) % 100}%`,
  y: `${(i * 6.7 + 5) % 100}%`,
  size: 8 + (i % 4) * 10,
  opacity: 0.05 + (i % 3) * 0.04,
  color:
    i % 4 === 0
      ? '#d4a017'
      : i % 4 === 1
        ? '#22c55e'
        : i % 4 === 2
          ? '#ffffff'
          : '#16a34a',
  delay: (i % 5) * 0.9,
}))

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentImage, setCurrentImage] = useState(0)
  const [activeRole, setActiveRole] = useState(0)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 30, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 30, damping: 30 })

  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0])
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.06])
  const textY = useTransform(scrollY, [0, 400], [0, 60])
  const cardParallaxY = useTransform(scrollY, [0, 400], [0, 30])

  const { currentUser } = useAuth()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  useEffect(() => {
    const t = setInterval(
      () => setCurrentImage((p) => (p + 1) % HERO_IMAGES.length),
      5000,
    )
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(
      () => setActiveRole((p) => (p + 1) % ROLE_CARDS.length),
      3200,
    )
    return () => clearInterval(t)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left - rect.width / 2) / rect.width)
    mouseY.set((e.clientY - rect.top - rect.height / 2) / rect.height)
  }

  // Always use deep overlay so text is always white and readable regardless of theme
  const overlay1 = isDark
    ? 'linear-gradient(to bottom, rgba(4,10,4,0.92) 0%, rgba(6,13,6,0.58) 38%, rgba(6,13,6,0.88) 100%)'
    : 'linear-gradient(to bottom, rgba(10,50,20,0.88) 0%, rgba(14,60,25,0.52) 38%, rgba(90,35,5,0.82) 100%)'
  const overlay2 = isDark
    ? 'linear-gradient(100deg, rgba(4,10,4,0.72) 0%, transparent 55%, rgba(4,10,4,0.52) 100%)'
    : 'linear-gradient(100deg, rgba(10,50,20,0.72) 0%, transparent 55%, rgba(90,35,5,0.52) 100%)'
  const heroBg = isDark
    ? 'linear-gradient(160deg,#030a03 0%,#060d06 50%,#070e07 100%)'
    : 'linear-gradient(160deg,#0a3018 0%,#0d4020 45%,#5a2205 100%)'

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: heroBg }}
      onMouseMove={handleMouseMove}
      id="hero"
    >
      {/* ── Background image carousel ── */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: heroScale, opacity: heroOpacity }}
      >
        {HERO_IMAGES.map((src, i) => (
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: i === currentImage ? 1 : 0 }}
            transition={{ duration: 2.2, ease: 'easeInOut' }}
          >
            <img
              src={src}
              alt="Farm"
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </motion.div>
        ))}
        {/* Gradient overlays — always keep text white */}
        <div className="absolute inset-0" style={{ background: overlay1 }} />
        <div className="absolute inset-0" style={{ background: overlay2 }} />
        {/* Noise grain */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </motion.div>

      {/* ── Bokeh particles ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {BOKEH.map((b, i) => (
          <BokehParticle key={i} {...b} />
        ))}
      </div>

      {/* ── Floating produce (xl only) ── */}
      {FLOATING_PRODUCE.map((item, i) => (
        <motion.div
          key={i}
          className={`absolute z-[5] hidden xl:block ${item.size} select-none pointer-events-none`}
          style={{
            left: item.x,
            top: item.y,
            filter: item.blur ? 'blur(1px)' : 'none',
            opacity: item.blur ? 0.5 : 0.9,
          }}
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          animate={{ opacity: item.blur ? 0.5 : 0.9, scale: 1, rotate: 0 }}
          transition={{
            delay: item.delay + 0.8,
            duration: 0.9,
            ease: 'backOut',
          }}
        >
          <motion.div
            animate={{ y: [-8, 8, -8], rotate: [-5, 5, -5] }}
            transition={{
              duration: 4 + i * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ x: springX, y: springY }}
          >
            {item.emoji}
          </motion.div>
        </motion.div>
      ))}

      {/* ── Main content ── */}
      <div className="relative z-[10] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 flex flex-col xl:flex-row items-center justify-between gap-8 xl:gap-12 min-h-[100dvh]">
        <motion.div
          className="text-center xl:text-left flex-1 w-full max-w-2xl mx-auto xl:mx-0"
          style={{ y: textY }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-6 sm:mb-8"
            style={{
              background: 'rgba(217,119,6,0.2)',
              border: '1px solid rgba(217,119,6,0.5)',
            }}
          >
            <motion.span
              className="w-2 h-2 rounded-full"
              style={{ background: '#22c55e' }}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            <span
              style={{
                color: '#fbbf24',
                fontSize: 'clamp(0.6rem,1.8vw,0.7rem)',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Live Marketplace · Zero Middlemen
            </span>
            <Sparkles
              className="w-3 h-3 sm:w-3.5 sm:h-3.5"
              style={{ color: '#fbbf24' }}
            />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.35,
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="leading-[0.88] tracking-tight mb-4 sm:mb-6"
            style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: 'clamp(2.4rem,8vw,6.5rem)',
              fontWeight: 900,
              color: '#ffffff',
              textShadow: '0 2px 20px rgba(0,0,0,0.4)',
            }}
          >
            Farm to{' '}
            <em style={{ color: '#fbbf24', fontStyle: 'italic' }}>Your</em>
            <br />
            <span className="relative inline-block">
              Table
              <motion.span
                className="absolute bottom-1 left-0 h-[3px] rounded-full"
                style={{
                  background: 'linear-gradient(90deg,#d97706,#16a34a)',
                  width: '100%',
                }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              />
            </span>
            {', '}
            <span style={{ color: '#4ade80' }}>Direct.</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="max-w-xl mx-auto xl:mx-0 mb-8 sm:mb-10 leading-relaxed"
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 'clamp(0.875rem,2.2vw,1.125rem)',
              color: 'rgba(255,255,255,0.88)',
              textShadow: '0 1px 8px rgba(0,0,0,0.3)',
            }}
          >
            Connect with local farmers, browse real inventory, chat directly,
            and pay securely through escrow.{' '}
            <strong style={{ color: '#ffffff', fontWeight: 600 }}>
              No grocery markup. No mystery supply chains.
            </strong>
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72 }}
            className="flex flex-col xs:flex-row items-center justify-center xl:justify-start gap-3 sm:gap-4 mb-10 sm:mb-14"
          >
            <a
              href="#market"
              className="group relative w-full xs:w-auto flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm font-bold overflow-hidden transition-all duration-300"
              style={{
                background:
                  'linear-gradient(135deg,#d97706 0%,#f59e0b 50%,#d97706 100%)',
                color: '#ffffff',
                fontFamily: "'DM Sans',sans-serif",
                boxShadow: '0 4px 24px rgba(217,119,6,0.55)',
              }}
            >
              <span className="relative z-10">Shop Fresh Produce</span>
              <motion.span
                className="relative z-10 text-base"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
              <div className="absolute inset-0 bg-white/15 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 skew-x-12" />
            </a>
            <a
              href="#farmers"
              className="w-full xs:w-auto flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                border: '1.5px solid rgba(255,255,255,0.45)',
                color: '#ffffff',
                fontFamily: "'DM Sans',sans-serif",
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span className="text-base">🌾</span>
              <span>Sell Your Harvest</span>
            </a>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.22)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            }}
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + i * 0.08 }}
                className="flex flex-col items-center gap-1 px-2 sm:px-3 py-4 sm:py-5"
                style={{
                  background: 'rgba(0,0,0,0.32)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div style={{ color: '#fbbf24' }} className="mb-0.5">
                  {stat.icon}
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    color: '#ffffff',
                    fontSize: 'clamp(1rem,3vw,1.5rem)',
                    fontWeight: 900,
                    textShadow: '0 1px 6px rgba(0,0,0,0.3)',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    color: 'rgba(255,255,255,0.65)',
                    fontSize: 'clamp(0.55rem,1.5vw,0.625rem)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center gap-3 mt-4 sm:mt-6 justify-center xl:justify-start"
          >
            <div className="flex -space-x-2">
              {['🧑\u200d🌾', '👩\u200d🌾', '🌾', '🧑\u200d🍳', '🛒'].map(
                (e, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center text-xs"
                    style={{
                      background: `hsl(${100 + i * 30},35%,50%)`,
                      borderColor: 'rgba(0,0,0,0.3)',
                    }}
                  >
                    {e}
                  </div>
                ),
              )}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                    style={{ fill: '#fbbf24', color: '#fbbf24' }}
                  />
                ))}
                <span
                  className="text-xs font-bold ml-0.5"
                  style={{ color: '#fbbf24' }}
                >
                  4.9
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: 'clamp(0.6rem,1.5vw,0.625rem)',
                }}
              >
                Join our flourishing community
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Role card */}
        <motion.div
          className="flex-shrink-0 xl:self-center w-full xl:w-auto"
          style={{ y: cardParallaxY }}
        >
          {currentUser ? (
            <RoleAvatarCard user={currentUser} />
          ) : (
            <GuestCard
              activeRole={activeRole}
              setActiveRole={setActiveRole}
              isDark={isDark}
            />
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        style={{ color: 'rgba(255,255,255,0.55)' }}
      >
        <span
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: '0.6rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
          }}
        >
          Discover
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </motion.div>
      </motion.div>

      {/* Slide dots */}
      <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentImage(i)}
            className="h-1 rounded-full transition-all duration-500"
            style={{
              width: i === currentImage ? 28 : 6,
              background:
                i === currentImage ? '#d97706' : 'rgba(255,255,255,0.35)',
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

function GuestCard({
  activeRole,
  setActiveRole,
  isDark,
}: {
  activeRole: number
  setActiveRole: (i: number) => void
  isDark: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 160,
    damping: 24,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 160,
    damping: 24,
  })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left - rect.width / 2) / rect.width)
    mouseY.set((e.clientY - rect.top - rect.height / 2) / rect.height)
  }
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const role = ROLE_CARDS[activeRole]
  const cardBase = isDark ? 'rgba(8,18,8,0.94)' : 'rgba(255,255,255,0.97)'
  const cardBorder = isDark ? 'rgba(42,74,42,0.55)' : 'rgba(220,252,231,0.8)'
  const headerLabel = isDark ? '#a09880' : '#4b7a4b'
  const headerTitle = isDark ? '#f5f0e8' : '#1c2d1c'
  const tabInactiveBg = isDark ? 'rgba(13,26,13,0.8)' : 'rgba(240,253,244,0.9)'
  const tabInactiveBorder = isDark
    ? 'rgba(42,74,42,0.3)'
    : 'rgba(16,163,74,0.15)'
  const roleDescColor = isDark ? '#c5bfb0' : '#2d4f2d'
  const footerNote = isDark ? '#7a7060' : '#6b7280'

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
      className="w-full max-w-sm mx-auto xl:max-w-none xl:w-80"
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative rounded-3xl overflow-hidden cursor-pointer select-none"
        whileHover={{
          boxShadow: `0 30px 80px rgba(0,0,0,0.4), 0 0 60px ${role.color}30`,
        }}
      >
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: cardBase,
            backdropFilter: 'blur(28px)',
            border: `1px solid ${cardBorder}`,
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            className="absolute inset-0 pointer-events-none rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${role.color}20 0%, transparent 65%)`,
            }}
          />
        </AnimatePresence>

        <motion.div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
          animate={{
            background: `linear-gradient(90deg, ${role.color}90, ${role.color}50, ${role.color}90)`,
          }}
          transition={{ duration: 0.4 }}
        />

        <div className="relative z-10 p-5 sm:p-7">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <div>
              <p
                className="text-[10px] font-bold tracking-[0.25em] uppercase mb-1"
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  color: headerLabel,
                }}
              >
                HarvestHub
              </p>
              <h3
                className="text-lg sm:text-xl font-black"
                style={{
                  fontFamily: "'Playfair Display',serif",
                  color: headerTitle,
                }}
              >
                Join the Platform
              </h3>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="text-2xl sm:text-3xl"
            >
              🌾
            </motion.div>
          </div>

          <div className="mb-5 sm:mb-6 relative h-24 sm:h-28 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full"
              style={{ border: `1px dashed ${role.color}50` }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full"
              style={{ border: `1px solid ${role.color}30` }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRole}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'backOut' }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl sm:text-4xl shadow-2xl relative z-10"
                style={{
                  background: `radial-gradient(circle at 35% 30%, ${role.color}50, ${role.color}20)`,
                  border: `2.5px solid ${role.color}60`,
                  boxShadow: `0 0 30px ${role.color}30, inset 0 2px 8px rgba(255,255,255,0.6)`,
                }}
              >
                {role.icon}
                <div
                  className="absolute top-3 left-4 w-6 h-3 rounded-full opacity-50"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(255,255,255,0.95) 0%, transparent 70%)',
                    filter: 'blur(2px)',
                  }}
                />
              </motion.div>
            </AnimatePresence>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute w-20 h-20 sm:w-24 sm:h-24 flex items-start justify-center"
            >
              <motion.div
                className="w-2.5 h-2.5 rounded-full -mt-1.5"
                style={{
                  background: role.color,
                  boxShadow: `0 0 8px ${role.color}`,
                }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-5 sm:mb-6">
            {ROLE_CARDS.map((rc, i) => (
              <motion.button
                key={rc.role}
                onClick={() => setActiveRole(i)}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1 sm:gap-1.5 p-2 sm:p-3 rounded-2xl transition-all duration-300 text-center"
                style={{
                  background: activeRole === i ? rc.bg : tabInactiveBg,
                  border: `1px solid ${activeRole === i ? rc.border : tabInactiveBorder}`,
                  boxShadow:
                    activeRole === i ? `0 0 16px ${rc.color}20` : 'none',
                }}
              >
                <span className="text-base sm:text-lg">{rc.icon}</span>
                <span
                  className="text-[9px] sm:text-[10px] font-bold"
                  style={{
                    color: activeRole === i ? rc.color : headerLabel,
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  {rc.role}
                </span>
                <AnimatePresence>
                  {activeRole === i && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[7px] sm:text-[8px] font-medium"
                      style={{
                        color: `${rc.color}90`,
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                    >
                      {rc.stat}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeRole}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 sm:mb-5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl"
              style={{
                background: role.bg,
                border: `1px solid ${role.border}`,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: role.color }}
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
                <span
                  className="text-[9px] font-bold tracking-widest uppercase"
                  style={{
                    color: role.color,
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  {role.badge}
                </span>
              </div>
              <p
                className="text-xs"
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  color: roleDescColor,
                }}
              >
                {role.desc}
              </p>
            </motion.div>
          </AnimatePresence>

          <a
            href="/sign-in"
            className="flex items-center justify-center gap-2 w-full py-3 sm:py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg,#d97706,#f59e0b)',
              color: '#ffffff',
              fontFamily: "'DM Sans',sans-serif",
              boxShadow: '0 4px 20px rgba(217,119,6,0.4)',
            }}
          >
            Get Started Free →
          </a>
          <p
            className="text-center text-[10px] mt-2.5 sm:mt-3"
            style={{ fontFamily: "'DM Sans',sans-serif", color: footerNote }}
          >
            No credit card · Join 2,400+ farmers & buyers
          </p>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${role.color}50, transparent)`,
          }}
        />
      </motion.div>
    </motion.div>
  )
}
