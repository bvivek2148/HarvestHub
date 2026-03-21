import { useEffect, useState, useRef } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react'
import { HarvestHubLogo } from './HarvestHubLogo'

interface LogoLoaderProps {
  onDone: () => void
}

const DURATION = 3200

const PHRASES = [
  'Farm Fresh.',
  'Harvest Hub.',
  'Direct Trade.',
  'Honest Prices.',
]

const PARTICLES = [
  { x: 12, y: 18, size: 7, delay: 0.1, color: '#16a34a', drift: -12 },
  { x: 85, y: 12, size: 5, delay: 0.22, color: '#d97706', drift: 8 },
  { x: 8, y: 62, size: 6, delay: 0.05, color: '#15803d', drift: -10 },
  { x: 91, y: 58, size: 5, delay: 0.35, color: '#f59e0b', drift: 6 },
  { x: 48, y: 6, size: 4, delay: 0.42, color: '#16a34a', drift: -5 },
  { x: 22, y: 88, size: 5, delay: 0.18, color: '#f59e0b', drift: 10 },
  { x: 78, y: 82, size: 4, delay: 0.28, color: '#16a34a', drift: -8 },
  { x: 3, y: 40, size: 5, delay: 0.5, color: '#d97706', drift: 14 },
  { x: 96, y: 32, size: 4, delay: 0.38, color: '#15803d', drift: -6 },
  { x: 60, y: 94, size: 6, delay: 0.14, color: '#f59e0b', drift: 9 },
  { x: 33, y: 5, size: 3, delay: 0.55, color: '#22c55e', drift: -11 },
  { x: 70, y: 10, size: 4, delay: 0.08, color: '#d97706', drift: 7 },
  { x: 15, y: 50, size: 3, delay: 0.62, color: '#f59e0b', drift: -9 },
  { x: 88, y: 44, size: 5, delay: 0.32, color: '#16a34a', drift: 12 },
]

function LeafSVG({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size * 3.5} height={size * 3.5} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 3 C9 6 5 11 5 17 C5 23 9 28 16 30 C23 28 27 23 27 17 C27 11 23 6 16 3Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M16 5 L16 29"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <ellipse cx="13" cy="12" rx="3" ry="2" fill="rgba(255,255,255,0.2)" />
    </svg>
  )
}

function HexDot({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.circle
      cx={x}
      cy={y}
      r={1.4}
      fill="rgba(22,163,74,0.4)"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 0.7, 0], scale: [0, 1, 0] }}
      transition={{
        delay,
        duration: 2.4,
        repeat: Infinity,
        repeatDelay: 1.5,
        ease: 'easeInOut',
      }}
    />
  )
}

function buildHexGrid() {
  const pts: { x: number; y: number; delay: number }[] = []
  const cols = 20
  const rows = 14
  const xStep = 100 / (cols - 1)
  const yStep = 100 / (rows - 1)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * xStep + (r % 2 === 0 ? 0 : xStep / 2) - xStep / 2
      const y = r * yStep
      pts.push({ x, y, delay: (r * cols + c) * 0.012 })
    }
  }
  return pts
}
const HEX_GRID = buildHexGrid()

export function LogoLoader({ onDone }: LogoLoaderProps) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter')
  const [wordIndex, setWordIndex] = useState(0)
  const [countUp, setCountUp] = useState(0)
  const progressMv = useMotionValue(0)
  const smoothProgress = useSpring(progressMv, { stiffness: 48, damping: 16 })
  const barWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%'])
  const shimmerLeft = useTransform(smoothProgress, [0, 1], ['-15%', '110%'])
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 350)
    const t2 = setTimeout(() => setPhase('exit'), DURATION - 400)
    const t3 = setTimeout(() => onDone(), DURATION)

    const wordInterval = setInterval(() => {
      setWordIndex((i) => (i + 1) % (PHRASES.length - 1))
    }, 820)

    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now
      const elapsed = now - startRef.current
      const p = Math.min(elapsed / (DURATION - 500), 1)
      progressMv.set(p)
      setCountUp(Math.round(p * 100))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearInterval(wordInterval)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [onDone, progressMv])

  const orbitSize = 'min(70vw, 70vh, 380px)'

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          key="logo-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden select-none"
          style={{
            background:
              'linear-gradient(148deg, #020d04 0%, #041a08 30%, #071205 55%, #130800 80%, #060303 100%)',
          }}
        >
          {/* Hex grid background */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1.2 }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0"
            >
              {HEX_GRID.map((p, i) => (
                <HexDot key={i} x={p.x} y={p.y} delay={p.delay} />
              ))}
            </svg>
          </motion.div>

          {/* Ambient orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 'clamp(320px, 60vw, 700px)',
                height: 'clamp(320px, 60vw, 700px)',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -52%)',
                background:
                  'radial-gradient(circle, rgba(22,163,74,0.10) 0%, rgba(21,128,61,0.06) 40%, transparent 68%)',
              }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 'clamp(200px, 36vw, 420px)',
                height: 'clamp(200px, 36vw, 420px)',
                left: '58%',
                top: '44%',
                transform: 'translate(-50%, -50%)',
                background:
                  'radial-gradient(circle, rgba(217,119,6,0.12) 0%, transparent 62%)',
              }}
              animate={{ scale: [1, 1.22, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{
                repeat: Infinity,
                duration: 5.5,
                ease: 'easeInOut',
                delay: 1,
              }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 'clamp(140px, 25vw, 300px)',
                height: 'clamp(140px, 25vw, 300px)',
                left: '36%',
                top: '60%',
                transform: 'translate(-50%, -50%)',
                background:
                  'radial-gradient(circle, rgba(20,83,45,0.2) 0%, transparent 65%)',
              }}
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
              transition={{
                repeat: Infinity,
                duration: 3.8,
                ease: 'easeInOut',
                delay: 0.6,
              }}
            />
          </div>

          {/* Floating leaf particles */}
          {PARTICLES.map((p, i) => (
            <motion.div
              key={i}
              className="absolute pointer-events-none"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              initial={{
                opacity: 0,
                y: 18,
                scale: 0,
                rotate: i % 2 === 0 ? -30 : 30,
              }}
              animate={{
                opacity: [0, 0.75, 0.55, 0],
                y: [18, 0, -20, -44],
                scale: [0, 1, 0.85, 0],
                rotate: i % 2 === 0 ? [-30, 0, 15, 25] : [30, 0, -15, -25],
                x: [0, p.drift * 0.3, p.drift * 0.7, p.drift],
              }}
              transition={{
                delay: p.delay + 0.3,
                duration: 2.8,
                ease: [0.22, 1, 0.36, 1],
                repeat: Infinity,
                repeatDelay: 0.4 + i * 0.07,
              }}
            >
              <LeafSVG size={p.size} color={p.color} />
            </motion.div>
          ))}

          {/* Noise grain overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              opacity: 0.042,
              mixBlendMode: 'overlay',
            }}
          />

          {/* Core content */}
          <div className="relative flex flex-col items-center z-10 w-full px-4">
            {/* Orbit ring system */}
            <motion.div
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: orbitSize,
                height: orbitSize,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.15,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                overflow="visible"
              >
                {/* Outermost ring */}
                <motion.circle
                  cx={50}
                  cy={50}
                  r={47}
                  fill="none"
                  stroke="rgba(217,119,6,0.12)"
                  strokeWidth={0.5}
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 28,
                    ease: 'linear',
                  }}
                  style={{ transformOrigin: '50px 50px' }}
                />
                {/* Outer arc - green */}
                <motion.circle
                  cx={50}
                  cy={50}
                  r={40}
                  fill="none"
                  stroke="rgba(22,163,74,0.3)"
                  strokeWidth={0.6}
                  strokeDasharray={`${2 * Math.PI * 40 * 0.42} ${2 * Math.PI * 40 * 0.58}`}
                  strokeLinecap="round"
                  animate={{ rotate: -360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 5.5,
                    ease: 'linear',
                  }}
                  style={{ transformOrigin: '50px 50px' }}
                />
                {/* Mid arc - amber */}
                <motion.circle
                  cx={50}
                  cy={50}
                  r={32}
                  fill="none"
                  stroke="rgba(217,119,6,0.28)"
                  strokeWidth={0.6}
                  strokeDasharray={`${2 * Math.PI * 32 * 0.32} ${2 * Math.PI * 32 * 0.68}`}
                  strokeLinecap="round"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                  style={{ transformOrigin: '50px 50px' }}
                />
                {/* Inner arc */}
                <motion.circle
                  cx={50}
                  cy={50}
                  r={25}
                  fill="none"
                  stroke="rgba(34,197,94,0.2)"
                  strokeWidth={0.5}
                  strokeDasharray={`${2 * Math.PI * 25 * 0.25} ${2 * Math.PI * 25 * 0.75}`}
                  strokeLinecap="round"
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                  style={{ transformOrigin: '50px 50px' }}
                />
                {/* Tracker dots */}
                <motion.circle
                  cx={50}
                  cy={10}
                  r={1.8}
                  fill="#d97706"
                  animate={{ rotate: -360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 5.5,
                    ease: 'linear',
                  }}
                  style={{
                    transformOrigin: '50px 50px',
                    filter: 'drop-shadow(0 0 2px #d97706)',
                  }}
                />
                <motion.circle
                  cx={50}
                  cy={18}
                  r={1.5}
                  fill="#16a34a"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                  style={{
                    transformOrigin: '50px 50px',
                    filter: 'drop-shadow(0 0 2px #16a34a)',
                  }}
                />
                <motion.circle
                  cx={50}
                  cy={25}
                  r={1.2}
                  fill="#f59e0b"
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                  style={{
                    transformOrigin: '50px 50px',
                    filter: 'drop-shadow(0 0 2px #f59e0b)',
                  }}
                />
              </svg>
            </motion.div>

            {/* Logo icon with layered glow */}
            <motion.div
              className="relative z-10"
              initial={{ scale: 0.3, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.75, ease: [0.175, 0.885, 0.32, 1.275] }}
            >
              <motion.div
                className="absolute rounded-full"
                style={{
                  inset: 'clamp(-20px, -4vmin, -32px)',
                  background:
                    'radial-gradient(circle, rgba(22,163,74,0.35) 0%, rgba(217,119,6,0.12) 50%, transparent 72%)',
                  filter: 'blur(12px)',
                }}
                animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.08, 0.95] }}
                transition={{
                  repeat: Infinity,
                  duration: 2.8,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute rounded-full"
                style={{
                  inset: 'clamp(-6px, -1.5vmin, -12px)',
                  background:
                    'radial-gradient(circle, rgba(34,197,94,0.22) 0%, transparent 70%)',
                  filter: 'blur(6px)',
                }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  ease: 'easeInOut',
                  delay: 0.3,
                }}
              />
              <motion.div
                animate={{ rotateY: [0, 8, 0, -8, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4.5,
                  ease: 'easeInOut',
                }}
              >
                <HarvestHubLogo
                  size={
                    Math.round(
                      Math.min(window.innerWidth, window.innerHeight) * 0.18,
                    ) || 90
                  }
                  animated={false}
                />
              </motion.div>
            </motion.div>

            {/* Brand name — HarvestHub */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                delay: 0.35,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div
                className="flex items-baseline justify-center gap-0 flex-wrap"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(28px, 6vw, 52px)',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                }}
              >
                {'Harvest'.split('').map((ch, i) => (
                  <motion.span
                    key={`h${i}`}
                    style={{ color: '#dcfce7', display: 'inline-block' }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.38 + i * 0.06,
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {ch}
                  </motion.span>
                ))}
                {'Hub'.split('').map((ch, i) => (
                  <motion.span
                    key={`hub${i}`}
                    style={{
                      color: '#d97706',
                      display: 'inline-block',
                      textShadow:
                        '0 0 24px rgba(217,119,6,0.6), 0 0 8px rgba(217,119,6,0.3)',
                    }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.8 + i * 0.06,
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </div>

              {/* Animated phrase */}
              <div
                className="mt-2.5 h-6 flex items-center justify-center overflow-visible relative"
                style={{ minWidth: 'clamp(160px, 40vw, 260px)' }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{
                      opacity: 0,
                      y: 12,
                      filter: 'blur(8px)',
                      letterSpacing: '0.4em',
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      filter: 'blur(0px)',
                      letterSpacing: '0.3em',
                    }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="absolute text-[clamp(8px,1.5vw,11px)] uppercase font-medium tracking-[0.3em]"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: 'rgba(187,247,208,0.45)',
                    }}
                  >
                    {PHRASES[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Progress section */}
            <motion.div
              className="mt-8 flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
            >
              <div
                className="relative rounded-full"
                style={{
                  width: 'clamp(160px, 40vw, 260px)',
                  padding: '2px',
                  background:
                    'linear-gradient(90deg, rgba(22,163,74,0.3), rgba(217,119,6,0.3))',
                  boxShadow: '0 0 20px rgba(22,163,74,0.12)',
                }}
              >
                <div
                  className="relative rounded-full overflow-hidden"
                  style={{ height: 3, background: 'rgba(255,255,255,0.06)' }}
                >
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: barWidth,
                      background:
                        'linear-gradient(90deg, #15803d 0%, #16a34a 30%, #d97706 70%, #f59e0b 100%)',
                      boxShadow:
                        '0 0 12px rgba(217,119,6,0.8), 0 0 5px rgba(22,163,74,0.6)',
                    }}
                  />
                  <motion.div
                    className="absolute inset-y-0 w-16 rounded-full"
                    style={{
                      left: shimmerLeft,
                      background:
                        'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                    }}
                  />
                </div>
              </div>

              <div
                className="flex items-center gap-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <motion.div
                  className="rounded-full"
                  style={{
                    width: 5,
                    height: 5,
                    background: '#16a34a',
                    boxShadow: '0 0 6px #16a34a',
                    flexShrink: 0,
                  }}
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 0.7, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: 'easeInOut',
                  }}
                />
                <span
                  className="uppercase tabular-nums"
                  style={{
                    fontSize: 'clamp(8px, 1.4vw, 10px)',
                    letterSpacing: '0.2em',
                    color: 'rgba(187,247,208,0.35)',
                  }}
                >
                  Connecting to farms
                </span>
                <span
                  className="font-bold tabular-nums"
                  style={{
                    fontSize: 'clamp(9px, 1.6vw, 11px)',
                    color: 'rgba(217,119,6,0.7)',
                    fontVariantNumeric: 'tabular-nums',
                    minWidth: '2.8ch',
                    textAlign: 'right',
                  }}
                >
                  {countUp}%
                </span>
              </div>
            </motion.div>
          </div>

          {/* Bottom decorative line */}
          <motion.div
            className="absolute bottom-[4vh] left-1/2"
            style={{ transform: 'translateX(-50%)' }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              style={{
                width: 'clamp(120px, 20vw, 200px)',
                height: 1,
                background:
                  'linear-gradient(90deg, transparent, rgba(22,163,74,0.35), rgba(217,119,6,0.35), transparent)',
              }}
            />
            <div className="flex justify-center mt-2 gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 3,
                    height: 3,
                    background:
                      i === 1 ? 'rgba(217,119,6,0.5)' : 'rgba(22,163,74,0.35)',
                  }}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.7, 1, 0.7] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.6,
                    delay: i * 0.25,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Corner accent lines */}
          {[
            {
              top: 'clamp(12px,2vmin,24px)',
              left: 'clamp(12px,2vmin,24px)',
              rotate: 0,
            },
            {
              top: 'clamp(12px,2vmin,24px)',
              right: 'clamp(12px,2vmin,24px)',
              rotate: 90,
            },
            {
              bottom: 'clamp(12px,2vmin,24px)',
              left: 'clamp(12px,2vmin,24px)',
              rotate: 270,
            },
            {
              bottom: 'clamp(12px,2vmin,24px)',
              right: 'clamp(12px,2vmin,24px)',
              rotate: 180,
            },
          ].map((pos, i) => {
            const { rotate, ...posStyle } = pos
            return (
              <motion.div
                key={i}
                className="absolute pointer-events-none"
                style={posStyle}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.4, scale: 1 }}
                transition={{
                  delay: 0.5 + i * 0.08,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <svg
                  width="clamp(14px,2.5vmin,22px)"
                  height="clamp(14px,2.5vmin,22px)"
                  viewBox="0 0 20 20"
                  style={{ transform: `rotate(${rotate}deg)` }}
                >
                  <path
                    d="M2 18 L2 2 L18 2"
                    stroke="rgba(22,163,74,0.4)"
                    strokeWidth={1.5}
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
