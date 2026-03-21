import { motion } from 'motion/react'

interface LogoProps {
  size?: number
  animated?: boolean
  className?: string
}

export function HarvestHubLogo({
  size = 36,
  animated = true,
  className = '',
}: LogoProps) {
  const id = `hh-${size}`
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={animated ? { opacity: 0, scale: 0.7, rotate: -12 } : undefined}
      animate={animated ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
      transition={{ duration: 0.6, ease: 'backOut' }}
    >
      <defs>
        {/* Deep forest radial bg */}
        <radialGradient id={`${id}-bg`} cx="50%" cy="40%" r="58%">
          <stop offset="0%" stopColor="#1a3d1a" />
          <stop offset="100%" stopColor="#071207" />
        </radialGradient>
        {/* Golden harvest gradient */}
        <radialGradient id={`${id}-gold`} cx="40%" cy="25%" r="70%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="45%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#92400e" />
        </radialGradient>
        {/* Leaf / stem green */}
        <linearGradient id={`${id}-green`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        {/* Outer ring glow */}
        <radialGradient id={`${id}-ring`} cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="transparent" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.3" />
        </radialGradient>
        {/* Gloss */}
        <radialGradient id={`${id}-gloss`} cx="38%" cy="22%" r="55%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter
          id={`${id}-softglow`}
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
        >
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background disc */}
      <circle cx="28" cy="28" r="27" fill={`url(#${id}-bg)`} />
      {/* Outer glow ring */}
      <circle cx="28" cy="28" r="27" fill={`url(#${id}-ring)`} />
      {/* Thin amber ring border */}
      <circle
        cx="28"
        cy="28"
        r="26.2"
        stroke="#d97706"
        strokeWidth="0.7"
        strokeOpacity="0.55"
        fill="none"
      />

      {/* ── Hub hexagon ── */}
      {/* A subtle hex backdrop */}
      <path
        d="M28 18 L35.5 22.25 L35.5 30.75 L28 35 L20.5 30.75 L20.5 22.25 Z"
        fill="#d97706"
        fillOpacity="0.14"
        stroke="#f59e0b"
        strokeWidth="0.7"
        strokeOpacity="0.5"
      />

      {/* ── Wheat stalks radiating from hub ── */}
      {/* 6 stalks at 30° increments pointing outward from centre */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180
        const cx = 28,
          cy = 26.5
        const innerR = 8,
          outerR = 17
        const x1 = cx + Math.cos(rad) * innerR
        const y1 = cy + Math.sin(rad) * innerR
        const x2 = cx + Math.cos(rad) * outerR
        const y2 = cy + Math.sin(rad) * outerR
        const isGold = i % 2 === 0
        const rnd = (n: number) => Number(n.toFixed(3))
        return (
          <g key={deg}>
            <line
              x1={rnd(x1)}
              y1={rnd(y1)}
              x2={rnd(x2)}
              y2={rnd(y2)}
              stroke={isGold ? '#f59e0b' : '#4ade80'}
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeOpacity="0.85"
            />
            {/* Tiny grain head */}
            <ellipse
              cx={rnd(x2 + Math.cos(rad) * 1.6)}
              cy={rnd(y2 + Math.sin(rad) * 1.6)}
              rx={1.5}
              ry={2.2}
              transform={`rotate(${deg}, ${rnd(x2 + Math.cos(rad) * 1.6)}, ${rnd(y2 + Math.sin(rad) * 1.6)})`}
              fill={isGold ? '#fde68a' : '#4ade80'}
              opacity={0.9}
              filter={`url(#${id}-glow)`}
            />
          </g>
        )
      })}

      {/* ── Central "H" hub emblem ── */}
      {/* Outer hub ring */}
      <circle
        cx="28"
        cy="26.5"
        r="7.2"
        fill="#0d2210"
        stroke="#d97706"
        strokeWidth="1"
        strokeOpacity="0.8"
      />
      {/* H shape */}
      <path
        d="M24.5 22.5 L24.5 30.5 M24.5 26.5 L31.5 26.5 M31.5 22.5 L31.5 30.5"
        stroke={`url(#${id}-gold)`}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${id}-glow)`}
      />

      {/* Stem / root below */}
      <path
        d="M28 35 Q27 38.5 28 41 Q29 43.5 28 45"
        stroke="#4ade80"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
      {/* Two tiny leaves at base */}
      <path
        d="M28 39 Q25 37 24 39.5 Q26 39.5 28 39Z"
        fill="#4ade80"
        opacity="0.7"
      />
      <path
        d="M28 39 Q31 37 32 39.5 Q30 39.5 28 39Z"
        fill="#4ade80"
        opacity="0.7"
      />

      {/* Specular gloss */}
      <ellipse
        cx="24"
        cy="20"
        rx="5"
        ry="3"
        fill={`url(#${id}-gloss)`}
        opacity="0.45"
      />

      {/* Accent sparkle dots */}
      <circle
        cx="41"
        cy="14"
        r="1.4"
        fill="#fde68a"
        opacity="0.9"
        filter={`url(#${id}-softglow)`}
      />
      <circle
        cx="14"
        cy="15"
        r="1"
        fill="#4ade80"
        opacity="0.8"
        filter={`url(#${id}-softglow)`}
      />
      <circle cx="43" cy="38" r="0.9" fill="#f59e0b" opacity="0.7" />
    </motion.svg>
  )
}
