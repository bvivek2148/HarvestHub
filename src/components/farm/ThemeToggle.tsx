import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Sun, Moon } from 'lucide-react'

interface ThemeToggleProps {
  scrolled?: boolean
}

export function ThemeToggle({ scrolled = true }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div
        className="w-[52px] h-7 rounded-full"
        style={{
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.25)',
        }}
      />
    )
  }

  const isDark = resolvedTheme === 'dark'

  // Over the hero (not scrolled) — always use a glass/white style
  const trackBg = scrolled
    ? isDark
      ? 'linear-gradient(135deg,#1a3a1a,#0d2a0d)'
      : 'linear-gradient(135deg,#e8f5e9,#f0fdf4)'
    : 'rgba(255,255,255,0.15)'

  const trackBorder = scrolled
    ? isDark
      ? '1.5px solid rgba(212,160,23,0.4)'
      : '1.5px solid rgba(16,163,74,0.4)'
    : '1.5px solid rgba(255,255,255,0.4)'

  const thumbBg = isDark
    ? 'linear-gradient(135deg,#d4a017,#b8870f)'
    : scrolled
      ? 'linear-gradient(135deg,#16a34a,#22c55e)'
      : 'linear-gradient(135deg,#f0c340,#d4a017)'

  const thumbGlow = isDark
    ? '0 2px 8px rgba(212,160,23,0.5)'
    : scrolled
      ? '0 2px 8px rgba(22,163,74,0.5)'
      : '0 2px 8px rgba(212,160,23,0.6)'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="relative w-[52px] h-7 rounded-full flex items-center px-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a017]"
      style={{
        background: trackBg,
        border: trackBorder,
        backdropFilter: !scrolled ? 'blur(10px)' : 'none',
      }}
    >
      {/* Sliding thumb */}
      <motion.div
        animate={{ x: isDark ? 0 : 26 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        className="w-5 h-5 rounded-full flex items-center justify-center shadow-lg z-10 absolute left-1"
        style={{ background: thumbBg, boxShadow: thumbGlow }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
              transition={{ duration: 0.18 }}
            >
              <Moon
                className="w-3 h-3"
                style={{ color: isDark ? '#fffbe6' : '#0d1a0d' }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: 30, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -30, scale: 0.7 }}
              transition={{ duration: 0.18 }}
            >
              <Sun className="w-3 h-3" style={{ color: '#ffffff' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Opposite icon hint */}
      <div className="absolute right-1.5 flex items-center justify-center w-4 h-4 pointer-events-none">
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="sun-hint"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.45, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Sun
                className="w-3 h-3"
                style={{
                  color: scrolled ? '#d4a017' : 'rgba(255,255,255,0.7)',
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="moon-hint"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.45, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Moon
                className="w-3 h-3"
                style={{
                  color: scrolled ? '#6b7280' : 'rgba(255,255,255,0.6)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </button>
  )
}
