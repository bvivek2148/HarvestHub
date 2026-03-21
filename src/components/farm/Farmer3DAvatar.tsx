'use client'

import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

const FARMER_EMOJIS = ['🧑‍🌾', '👩‍🌾', '🌾', '🧑‍🍳', '🌱', '🥬', '🌻', '🍅']

function getFarmerEmoji(name: string): string {
  const idx =
    (name.charCodeAt(0) + (name.length > 1 ? name.charCodeAt(1) : 0)) %
    FARMER_EMOJIS.length
  return FARMER_EMOJIS[idx]
}

function getHue(name: string): number {
  return (
    (name.charCodeAt(0) * 47 +
      (name.length > 1 ? name.charCodeAt(1) * 31 : 0)) %
    360
  )
}

interface Farmer3DAvatarProps {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showName?: boolean
  farm?: string
  animated?: boolean
}

export function Farmer3DAvatar({
  name,
  size = 'sm',
  showName = false,
  farm,
  animated = true,
}: Farmer3DAvatarProps) {
  const hue = getHue(name)
  const orbColor = `hsl(${hue}, 60%, 32%)`
  const accentColor = `hsl(${hue}, 75%, 58%)`
  const lightColor = `hsl(${hue}, 80%, 72%)`
  const emoji = getFarmerEmoji(name)

  const rotateY = useMotionValue(0)
  const rotateX = useMotionValue(0)
  const springY = useSpring(rotateY, { stiffness: 80, damping: 20 })
  const springX = useSpring(rotateX, { stiffness: 80, damping: 20 })

  const dim = size === 'lg' ? 80 : size === 'md' ? 56 : size === 'sm' ? 40 : 28

  const emojiFontSize =
    size === 'lg' ? 28 : size === 'md' ? 20 : size === 'sm' ? 14 : 10

  const ringOuter = dim + 14
  const ringInner = dim + 6

  useEffect(() => {
    if (!animated) return
    let frame: number
    let t = 0
    const run = () => {
      t += 0.007
      rotateY.set(Math.sin(t) * 18)
      rotateX.set(Math.cos(t * 0.65) * 10)
      frame = requestAnimationFrame(run)
    }
    frame = requestAnimationFrame(run)
    return () => cancelAnimationFrame(frame)
  }, [animated, rotateX, rotateY])

  return (
    <div className="flex items-center gap-2.5">
      <div
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: ringOuter, height: ringOuter }}
      >
        {/* Outer glow corona */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
            filter: `blur(${dim * 0.15}px)`,
          }}
        />

        {/* Spinning outer ring */}
        <motion.div
          className="absolute rounded-full border"
          style={{
            width: ringOuter,
            height: ringOuter,
            borderColor: `${accentColor}55`,
            borderStyle: 'dashed',
          }}
          animate={animated ? { rotate: 360 } : undefined}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
        />

        {/* Inner ring */}
        <motion.div
          className="absolute rounded-full border"
          style={{
            width: ringInner,
            height: ringInner,
            borderColor: `${orbColor}70`,
          }}
          animate={animated ? { rotate: -360 } : undefined}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />

        {/* Main 3D sphere */}
        <div style={{ perspective: 300 }}>
          <motion.div
            style={{
              width: dim,
              height: dim,
              rotateY: springY,
              rotateX: springX,
              transformStyle: 'preserve-3d',
            }}
            className="relative rounded-full"
          >
            {/* Sphere body */}
            <div
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{
                background: `radial-gradient(circle at 35% 30%, ${lightColor}88, ${orbColor}ee, rgba(0,0,0,0.7))`,
                boxShadow: `0 0 ${dim * 0.4}px ${orbColor}88, inset 0 0 ${dim * 0.3}px rgba(0,0,0,0.5)`,
              }}
            >
              {/* Primary specular */}
              <div
                className="absolute rounded-full"
                style={{
                  width: dim * 0.38,
                  height: dim * 0.22,
                  top: '12%',
                  left: '18%',
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.75) 0%, transparent 75%)',
                  filter: `blur(${dim * 0.04}px)`,
                  opacity: 0.65,
                }}
              />
              {/* Secondary specular */}
              <div
                className="absolute rounded-full"
                style={{
                  width: dim * 0.2,
                  height: dim * 0.12,
                  bottom: '18%',
                  right: '14%',
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                  filter: `blur(${dim * 0.03}px)`,
                  opacity: 0.4,
                }}
              />
              {/* Equator */}
              <div
                className="absolute left-0 right-0"
                style={{
                  top: '48%',
                  height: '1px',
                  background: `linear-gradient(90deg, transparent, ${lightColor}66, transparent)`,
                }}
              />
              {/* Emoji center */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  fontSize: emojiFontSize,
                  filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.6))',
                }}
              >
                {emoji}
              </div>
            </div>

            {/* Orbiting dot */}
            <motion.div
              className="absolute inset-0 flex items-start justify-center"
              animate={animated ? { rotate: 360 } : undefined}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
            >
              <div
                className="rounded-full"
                style={{
                  width: dim * 0.12,
                  height: dim * 0.12,
                  marginTop: `-${dim * 0.06}px`,
                  background: accentColor,
                  boxShadow: `0 0 ${dim * 0.2}px ${accentColor}`,
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {showName && (
        <div className="min-w-0">
          <p
            className="text-xs font-semibold text-[#d4c8a8] leading-tight truncate"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {name}
          </p>
          {farm && (
            <p
              className="text-[10px] text-[#5a7a5a] truncate"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {farm}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
