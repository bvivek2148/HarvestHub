'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import {
  Tractor,
  ShoppingBag,
  Shield,
  Star,
  TrendingUp,
  Package,
  CheckCircle,
} from 'lucide-react'

type Role = 'farmer' | 'buyer' | 'admin'

interface RoleConfig {
  role: Role
  label: string
  tagline: string
  icon: React.ReactNode
  glowColor: string
  gradientFrom: string
  gradientTo: string
  accentColor: string
  borderColor: string
  emoji: string
  orbColor: string
  particleColor: string
  stats: Array<{ icon: React.ReactNode; value: string; label: string }>
  badge: string
}

function getRoleConfig(user: any): RoleConfig {
  const labels = user.labels ?? []

  if (labels.includes('admin')) {
    return {
      role: 'admin',
      label: 'Administrator',
      tagline: 'Platform Command Center',
      icon: <Shield className="w-8 h-8" />,
      glowColor: 'rgba(139,92,246,0.6)',
      gradientFrom: '#1a0a2e',
      gradientTo: '#2d1b69',
      accentColor: '#a78bfa',
      borderColor: 'rgba(139,92,246,0.4)',
      emoji: '🛡️',
      orbColor: '#7c3aed',
      particleColor: '#c4b5fd',
      badge: 'ADMIN ACCESS',
      stats: [
        {
          icon: <CheckCircle className="w-3.5 h-3.5" />,
          value: '2.4K',
          label: 'Users',
        },
        {
          icon: <Package className="w-3.5 h-3.5" />,
          value: '12K',
          label: 'Orders',
        },
        {
          icon: <TrendingUp className="w-3.5 h-3.5" />,
          value: '₹1.2M',
          label: 'Volume',
        },
      ],
    }
  }

  if (labels.includes('farmer')) {
    return {
      role: 'farmer',
      label: 'Farmer',
      tagline: 'Grow · Sell · Thrive',
      icon: <Tractor className="w-8 h-8" />,
      glowColor: 'rgba(34,197,94,0.5)',
      gradientFrom: '#061a0c',
      gradientTo: '#0f3d1a',
      accentColor: '#4ade80',
      borderColor: 'rgba(74,222,128,0.35)',
      emoji: '🌾',
      orbColor: '#16a34a',
      particleColor: '#86efac',
      badge: 'VERIFIED FARMER',
      stats: [
        {
          icon: <Package className="w-3.5 h-3.5" />,
          value: '0',
          label: 'Listings',
        },
        {
          icon: <TrendingUp className="w-3.5 h-3.5" />,
          value: '₹0',
          label: 'Earnings',
        },
        { icon: <Star className="w-3.5 h-3.5" />, value: '—', label: 'Rating' },
      ],
    }
  }

  // Default: buyer
  return {
    role: 'buyer',
    label: 'Buyer',
    tagline: 'Shop Fresh · Eat Local',
    icon: <ShoppingBag className="w-8 h-8" />,
    glowColor: 'rgba(251,191,36,0.45)',
    gradientFrom: '#1a1200',
    gradientTo: '#3d2d00',
    accentColor: '#fbbf24',
    borderColor: 'rgba(251,191,36,0.35)',
    emoji: '🛒',
    orbColor: '#d97706',
    particleColor: '#fde68a',
    badge: 'VERIFIED BUYER',
    stats: [
      {
        icon: <ShoppingBag className="w-3.5 h-3.5" />,
        value: '0',
        label: 'Orders',
      },
      { icon: <Star className="w-3.5 h-3.5" />, value: '—', label: 'Reviews' },
      {
        icon: <CheckCircle className="w-3.5 h-3.5" />,
        value: '100%',
        label: 'Protected',
      },
    ],
  }
}

// Floating particle
function Particle({
  color,
  delay,
  x,
  y,
}: {
  color: string
  delay: number
  x: string
  y: string
}) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full pointer-events-none"
      style={{ background: color, left: x, top: y }}
      animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.5, 0.5], y: [0, -18, 0] }}
      transition={{
        duration: 2.4 + Math.random(),
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  )
}

// 3D animated orb using CSS perspective
function Orb3D({ color, accentColor }: { color: string; accentColor: string }) {
  const rotateY = useMotionValue(0)
  const rotateX = useMotionValue(0)

  useEffect(() => {
    let frame: number
    let t = 0
    const animate = () => {
      t += 0.008
      rotateY.set(Math.sin(t) * 25)
      rotateX.set(Math.cos(t * 0.7) * 15)
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [rotateX, rotateY])

  return (
    <div className="relative w-28 h-28 mx-auto" style={{ perspective: 600 }}>
      <motion.div
        className="relative w-full h-full"
        style={{ rotateY, rotateX, transformStyle: 'preserve-3d' }}
      >
        {/* Outer glow */}
        <motion.div
          className="absolute inset-[-8px] rounded-full"
          style={{
            background: `conic-gradient(from 0deg, ${color}, ${accentColor}, ${color})`,
            opacity: 0.3,
            filter: 'blur(8px)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />

        {/* Spinning outer ring */}
        <motion.div
          className="absolute inset-[-4px] rounded-full border-2"
          style={{ borderColor: accentColor, opacity: 0.6 }}
          animate={{ rotateZ: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        {/* Dashed inner ring */}
        <motion.div
          className="absolute inset-[-2px] rounded-full border"
          style={{ borderColor: color, opacity: 0.4, borderStyle: 'dashed' }}
          animate={{ rotateZ: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />

        {/* Main sphere */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${accentColor}55, ${color}cc, #000000aa)`,
            boxShadow: `0 0 30px ${color}88, inset 0 0 20px ${color}44`,
          }}
        >
          {/* Specular highlight */}
          <div
            className="absolute w-10 h-6 rounded-full opacity-60"
            style={{
              background:
                'radial-gradient(circle, rgba(255,255,255,0.7) 0%, transparent 70%)',
              top: '14%',
              left: '20%',
              filter: 'blur(3px)',
            }}
          />
          {/* Secondary light */}
          <div
            className="absolute w-5 h-3 rounded-full opacity-30"
            style={{
              background:
                'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)',
              bottom: '20%',
              right: '18%',
              filter: 'blur(2px)',
            }}
          />
          {/* Equator line */}
          <div
            className="absolute left-0 right-0"
            style={{
              top: '47%',
              height: '1px',
              background: `linear-gradient(90deg, transparent, ${accentColor}88, transparent)`,
            }}
          />
        </div>

        {/* Orbiting dot — parent rotates, dot is offset from center */}
        <motion.div
          className="absolute inset-0 flex items-start justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="w-3 h-3 rounded-full -mt-1.5"
            style={{
              background: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

interface Props {
  user: any
}

const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  x: `${10 + i * 8}%`,
  y: `${20 + ((i * 17) % 65)}%`,
  delay: i * 0.22,
}))

export function RoleAvatarCard({ user }: Props) {
  const config = getRoleConfig(user)
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 })

  const rotateX = useTransform(springY, [-0.5, 0.5], [12, -12])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left - rect.width / 2) / rect.width)
    mouseY.set((e.clientY - rect.top - rect.height / 2) / rect.height)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  const displayName = user.name || user.email?.split('@')[0] || 'Guest'
  const initials = displayName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        className="relative w-72 rounded-2xl overflow-hidden cursor-pointer select-none"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`,
          border: `1px solid ${config.borderColor}`,
          boxShadow: `0 8px 32px ${config.glowColor}44, inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileHover={{
          boxShadow: `0 20px 60px ${config.glowColor}, 0 0 80px ${config.glowColor}44, inset 0 1px 0 rgba(255,255,255,0.1)`,
        }}
        whileTap={{ scale: 0.97 }}
      >
        {/* Animated particles */}
        {PARTICLES.map((p, i) => (
          <Particle
            key={i}
            color={config.particleColor}
            delay={p.delay}
            x={p.x}
            y={p.y}
          />
        ))}

        {/* Top mesh gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 60% -10%, ${config.accentColor}22 0%, transparent 60%)`,
          }}
        />

        {/* Shine sweep on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '200%' } : { x: '-100%' }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          style={{
            background: `linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 p-6">
          {/* Badge */}
          <div className="flex items-center justify-between mb-5">
            <span
              className="text-[9px] font-bold tracking-[0.2em] px-2 py-1 rounded-full"
              style={{
                color: config.accentColor,
                background: `${config.accentColor}18`,
                border: `1px solid ${config.accentColor}40`,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {config.badge}
            </span>
            <motion.span
              className="text-xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              {config.emoji}
            </motion.span>
          </div>

          {/* 3D Orb */}
          <div className="mb-2">
            <Orb3D color={config.orbColor} accentColor={config.accentColor} />
          </div>

          {/* User initials overlaid on orb */}
          <div className="flex justify-center -mt-10 mb-4 relative z-20">
            <motion.div
              className="rounded-full flex items-center justify-center font-bold text-lg"
              style={{
                width: '52px',
                height: '52px',
                background: `linear-gradient(135deg, ${config.orbColor}dd, ${config.accentColor}cc)`,
                border: `2px solid ${config.accentColor}`,
                color: '#fff',
                boxShadow: `0 0 16px ${config.orbColor}88`,
                fontFamily: "'Playfair Display', serif",
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              {initials}
            </motion.div>
          </div>

          {/* Name & role */}
          <div className="text-center mb-5">
            <h3
              className="text-white font-bold text-lg leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {displayName}
            </h3>
            <p
              className="text-xs mt-0.5"
              style={{
                color: config.accentColor,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {config.tagline}
            </p>
          </div>

          {/* Divider */}
          <div
            className="h-px w-full mb-4"
            style={{
              background: `linear-gradient(90deg, transparent, ${config.accentColor}50, transparent)`,
            }}
          />

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {config.stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1"
              >
                <div style={{ color: config.accentColor }}>{stat.icon}</div>
                <span
                  className="text-white text-sm font-bold"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-[9px] uppercase tracking-wider"
                  style={{
                    color: `${config.accentColor}99`,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Pulse indicator */}
          <motion.div
            className="mt-4 flex items-center justify-center gap-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: config.accentColor }}
            />
            <span
              className="text-[9px] tracking-widest uppercase"
              style={{
                color: `${config.accentColor}88`,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Interactive · Hover to explore
            </span>
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: config.accentColor }}
            />
          </motion.div>
        </div>

        {/* Bottom edge glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${config.accentColor}60, transparent)`,
          }}
        />
      </motion.div>

      {/* Card drop shadow glow */}
      <div
        className="absolute inset-0 rounded-2xl -z-10 blur-2xl opacity-40"
        style={{
          background: config.glowColor,
          transform: 'translateY(12px) scale(0.9)',
        }}
      />
    </motion.div>
  )
}
