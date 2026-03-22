import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  User,
  ChevronDown,
  Mail,
  Shield,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Link, useNavigate } from '@tanstack/react-router'
import { HarvestHubLogo } from './HarvestHubLogo'
import { ThemeToggle } from './ThemeToggle'
import { LogoLoader } from './LogoLoader'

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
  violet: 'var(--fd-purple)',
  violetGlow: 'var(--fd-purple-bg)',
  hover: 'var(--fd-hover-bg)',
  active: 'var(--fd-active-bg)',
}

function getRoleDest(labels: string[]): string {
  if (labels.includes('admin')) return '/admin'
  if (labels.includes('farmer')) return '/farmer'
  return '/buyer'
}

function getRoleLabel(labels: string[]): {
  label: string
  emoji: string
  color: string
  glow: string
} {
  if (labels.includes('admin'))
    return { label: 'Admin', emoji: '🛡️', color: C.violet, glow: C.violetGlow }
  if (labels.includes('farmer'))
    return { label: 'Farmer', emoji: '🌾', color: C.green, glow: C.greenGlow }
  return { label: 'Buyer', emoji: '🛒', color: C.amber, glow: C.amberGlow }
}

function ProfileModal({
  user,
  roleInfo,
  initials,
  roleDest,
  onClose,
  onSignOut,
}: {
  user: { name: string; email: string }
  roleInfo: { label: string; emoji: string; color: string }
  initials: string
  roleDest: string
  onClose: () => void
  onSignOut: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ duration: 0.22 }}
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'var(--fd-modal-bg)',
          border: `1px solid color-mix(in srgb, ${roleInfo.color}, transparent 80%)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-6 py-5 flex items-start justify-between"
          style={{
            background: `linear-gradient(135deg, color-mix(in srgb, ${roleInfo.color}, transparent 93%), color-mix(in srgb, ${roleInfo.color}, transparent 97%))`,
            borderBottom: `1px solid color-mix(in srgb, ${roleInfo.color}, transparent 88%)`,
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, ${roleInfo.color}, transparent 74%), color-mix(in srgb, ${roleInfo.color}, transparent 87%))`,
                color: roleInfo.color,
                border: `2px solid color-mix(in srgb, ${roleInfo.color}, transparent 69%)`,
                fontFamily: "'Playfair Display',serif",
              }}
            >
              {initials}
            </div>
            <div>
              <div
                className="text-base font-bold"
                style={{
                  fontFamily: "'Playfair Display',serif",
                  color: 'var(--fd-text)',
                }}
              >
                {user.name}
              </div>
              <div
                className="text-xs mt-0.5 px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-semibold"
                style={{
                  background: `color-mix(in srgb, ${roleInfo.color}, transparent 91%)`,
                  color: roleInfo.color,
                  border: `1px solid color-mix(in srgb, ${roleInfo.color}, transparent 80%)`,
                }}
              >
                {roleInfo.emoji} {roleInfo.label}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--fd-text-muted)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-3">
          {[
            {
              icon: <Mail className="w-4 h-4 shrink-0" />,
              label: 'Email',
              value: user.email,
            },
            {
              icon: <Shield className="w-4 h-4 shrink-0" />,
              label: 'Account Role',
              value: `${roleInfo.emoji} ${roleInfo.label}`,
              colored: true,
            },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: 'var(--fd-section-bg)',
                border: '1px solid var(--fd-border)',
              }}
            >
              <span style={{ color: 'var(--fd-text-muted)' }}>{row.icon}</span>
              <div>
                <div
                  className="text-xs mb-0.5"
                  style={{ color: 'var(--fd-text-muted)' }}
                >
                  {row.label}
                </div>
                <div
                  className="text-sm"
                  style={{
                    color: row.colored ? roleInfo.color : 'var(--fd-text)',
                    fontWeight: row.colored ? 600 : 400,
                  }}
                >
                  {row.value}
                </div>
              </div>
            </div>
          ))}
          <Link
            to={roleDest as '/admin' | '/farmer' | '/buyer'}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all hover:scale-[1.01]"
            style={{
              background: `color-mix(in srgb, ${roleInfo.color}, transparent 94%)`,
              border: `1px solid color-mix(in srgb, ${roleInfo.color}, transparent 85%)`,
              color: roleInfo.color,
            }}
          >
            <LayoutDashboard className="w-4 h-4" />
            <div>
              <div className="text-sm font-semibold">My Dashboard</div>
              <div className="text-xs opacity-60">
                View your {roleInfo.label.toLowerCase()} workspace
              </div>
            </div>
          </Link>
        </div>

        <div className="px-6 pb-5">
          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold text-red-600 border border-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            style={{ fontFamily: "'DM Sans',sans-serif" }}
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showLogoLoader, setShowLogoLoader] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const { currentUser, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setMenuOpen(false)
    setShowLogoLoader(true)
  }

  const handleLoaderDone = useCallback(() => {
    setShowLogoLoader(false)
    navigate({ to: '/' })
  }, [navigate])

  const navLinks = [
    { label: 'Browse Market', href: '#market' },
    { label: 'Farmers', href: '#farmers' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Secure Payments', href: '#escrow' },
  ]

  const roleInfo = currentUser ? getRoleLabel(currentUser.labels ?? []) : null
  const roleDest = currentUser ? getRoleDest(currentUser.labels ?? []) : '/'
  const displayName =
    currentUser?.name || currentUser?.email?.split('@')[0] || 'User'
  const initials = String(displayName || 'User')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleSignOut = async () => {
    setProfileOpen(false)
    setMenuOpen(false)
    setShowProfileModal(false)
    await signOut()
    await navigate({ to: '/' })
  }

  // Nav link color: always white when hero is showing (not scrolled), theme-aware when scrolled
  const navLinkColor = scrolled
    ? 'var(--fd-nav-link)'
    : 'rgba(255,255,255,0.92)'

  return (
    <>
      <AnimatePresence>
        {showLogoLoader && (
          <LogoLoader key="logo-loader" onDone={handleLoaderDone} />
        )}
      </AnimatePresence>

      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none" style={{ position: 'fixed', top: 0, left: 0, width: '100%', pointerEvents: 'none' }}>
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative transition-all duration-500 pointer-events-auto w-full"
          style={{
            position: 'relative',
            background: scrolled ? 'var(--fd-nav-bg)' : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            borderBottom: scrolled ? '1px solid var(--fd-border)' : 'none',
            boxShadow: scrolled ? `0 4px 24px color-mix(in srgb, ${C.green}, transparent 92%)` : 'none',
          }}
        >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.08, rotate: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              <HarvestHubLogo size={38} animated={false} />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span
                className="text-lg font-black tracking-tight leading-tight"
                style={{
                  fontFamily: "'Playfair Display',Georgia,serif",
                  color: scrolled ? 'var(--fd-text)' : '#ffffff',
                  textShadow: scrolled ? 'none' : '0 1px 8px rgba(0,0,0,0.4)',
                }}
              >
                Harvest
                <span
                  style={{ color: scrolled ? C.amber : '#fbbf24' }}
                >
                  Hub
                </span>
              </span>
              <span
                className="text-[9px] tracking-[0.2em] uppercase leading-tight"
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  color: scrolled
                    ? C.greenDark
                    : 'rgba(255,255,255,0.7)',
                }}
              >
                Farm to Table
              </span>
            </div>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-semibold transition-colors duration-200 relative group"
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  color: navLinkColor,
                  textShadow: scrolled ? 'none' : '0 1px 6px rgba(0,0,0,0.5)',
                }}
              >
                {link.label}
                <span
                  className="absolute -bottom-0.5 left-0 w-0 h-[2px] group-hover:w-full transition-all duration-300 rounded-full"
                  style={{
                    background: scrolled ? C.amber : '#fbbf24',
                  }}
                />
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle scrolled={scrolled} />

            {currentUser ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border transition-all duration-200"
                  style={{
                    borderColor: scrolled
                      ? `color-mix(in srgb, ${roleInfo?.color || C.green}, transparent 73%)`
                      : 'rgba(255,255,255,0.35)',
                    background: scrolled
                      ? `color-mix(in srgb, ${roleInfo?.color || C.green}, transparent 95%)`
                      : 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: `linear-gradient(135deg, color-mix(in srgb, ${roleInfo?.color || C.green}, transparent 73%), color-mix(in srgb, ${roleInfo?.color || C.green}, transparent 87%))`,
                      color: roleInfo?.color || C.green,
                      border: `1px solid color-mix(in srgb, ${roleInfo?.color || C.green}, transparent 69%)`,
                      fontFamily: "'Playfair Display',serif",
                    }}
                  >
                    {initials}
                  </div>
                  <span
                    className="text-sm font-medium max-w-[100px] truncate"
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      color: scrolled ? 'var(--fd-text)' : '#ffffff',
                    }}
                  >
                    {displayName}
                  </span>
                  <span className="text-xs">{roleInfo?.emoji}</span>
                  <ChevronDown
                    className="w-3.5 h-3.5 transition-transform duration-200"
                    style={{
                      color: scrolled
                        ? 'var(--fd-text-muted)'
                        : 'rgba(255,255,255,0.7)',
                      transform: profileOpen
                        ? 'rotate(180deg)'
                        : 'rotate(0deg)',
                    }}
                  />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-full mt-2 w-52 rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden"
                      style={{
                        background: 'var(--fd-modal-bg)',
                        border: '1px solid var(--fd-border)',
                        boxShadow: `0 8px 40px color-mix(in srgb, ${C.green}, transparent 92%)`,
                      }}
                    >
                      <div
                        className="px-4 py-3"
                        style={{ borderBottom: '1px solid var(--fd-border)' }}
                      >
                        <div
                          className="font-semibold text-sm truncate"
                          style={{
                            color: 'var(--fd-text)',
                            fontFamily: "'DM Sans',sans-serif",
                          }}
                        >
                          {displayName}
                        </div>
                        <div
                          className="text-xs mt-0.5"
                          style={{
                            color: roleInfo?.color,
                            fontFamily: "'DM Sans',sans-serif",
                          }}
                        >
                          {roleInfo?.emoji} {roleInfo?.label}
                        </div>
                      </div>
                      <div className="py-1">
                        <Link
                          to={roleDest as '/admin' | '/farmer' | '/buyer'}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--fd-section-bg)]"
                          style={{
                            fontFamily: "'DM Sans',sans-serif",
                            color: 'var(--fd-text-2)',
                          }}
                        >
                          <LayoutDashboard className="w-4 h-4" /> My Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            setProfileOpen(false)
                            setShowProfileModal(true)
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--fd-section-bg)]"
                          style={{
                            fontFamily: "'DM Sans',sans-serif",
                            color: 'var(--fd-text-2)',
                          }}
                        >
                          <User className="w-4 h-4" /> My Profile
                        </button>
                      </div>
                      <div
                        className="py-1"
                        style={{ borderTop: '1px solid var(--fd-border)' }}
                      >
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          style={{ fontFamily: "'DM Sans',sans-serif" }}
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/sign-in/$"
                  className="text-sm font-semibold border px-4 py-1.5 rounded-full transition-all duration-200"
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    color: scrolled ? C.green : '#ffffff',
                    borderColor: scrolled
                      ? `color-mix(in srgb, ${C.green}, transparent 60%)`
                      : 'rgba(255,255,255,0.45)',
                    background: scrolled
                      ? 'transparent'
                      : 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up/$"
                  className="text-sm font-bold px-5 py-2 rounded-full transition-all duration-200 shadow-lg"
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    background: `linear-gradient(135deg, ${C.amber}, ${C.amberGlow})`,
                    color: '#ffffff',
                    boxShadow: `0 4px 14px color-mix(in srgb, ${C.amber}, transparent 55%)`,
                  }}
                >
                  Start Selling
                </Link>
              </>
            )}
          </div>

          {/* Mobile right */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle scrolled={scrolled} />
            <button
              className="p-2"
              style={{ color: scrolled ? 'var(--fd-text)' : '#ffffff' }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-16 left-0 right-0 z-40 backdrop-blur-xl px-4 py-6 flex flex-col gap-4"
            style={{
              background: 'var(--fd-nav-bg)',
              borderBottom: '1px solid var(--fd-border)',
            }}
          >
            {currentUser && (
              <div
                className="flex items-center gap-3 px-3 py-3 rounded-xl mb-1"
                style={{
                  background: 'var(--fd-section-bg)',
                  border: '1px solid var(--fd-border)',
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in srgb, ${roleInfo?.color}, transparent 73%), color-mix(in srgb, ${roleInfo?.color}, transparent 87%))`,
                    color: roleInfo?.color,
                    border: `1px solid color-mix(in srgb, ${roleInfo?.color}, transparent 69%)`,
                    fontFamily: "'Playfair Display',serif",
                  }}
                >
                  {initials}
                </div>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{
                      color: 'var(--fd-text)',
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    {displayName}
                  </div>
                  <div
                    className="text-xs"
                    style={{
                      color: roleInfo?.color,
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    {roleInfo?.emoji} {roleInfo?.label}
                  </div>
                </div>
              </div>
            )}

            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="text-base font-semibold py-2"
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  color: 'var(--fd-text-2)',
                  borderBottom: '1px solid var(--fd-border)',
                }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </motion.a>
            ))}

            <div className="flex gap-3 pt-2">
              {currentUser ? (
                <>
                  <Link
                    to={roleDest as '/admin' | '/farmer' | '/buyer'}
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-sm font-medium text-center py-2.5 rounded-full border"
                    style={{
                      color: roleInfo?.color,
                      borderColor: `color-mix(in srgb, ${roleInfo?.color}, transparent 73%)`,
                      background: `color-mix(in srgb, ${roleInfo?.color}, transparent 95%)`,
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    My Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex-1 text-sm font-medium text-red-600 border border-red-300 px-4 py-2.5 rounded-full transition-colors"
                    style={{ fontFamily: "'DM Sans',sans-serif" }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/sign-in/$"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-sm font-semibold text-center px-4 py-2.5 rounded-full border"
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      color: C.green,
                      borderColor:
                        `color-mix(in srgb, ${C.green}, transparent 60%)`,
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/sign-up/$"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-sm font-bold text-center px-4 py-2.5 rounded-full"
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      background: `linear-gradient(135deg, ${C.amber}, ${C.amberGlow})`,
                      color: '#ffffff',
                    }}
                  >
                    Start Selling
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfileModal && currentUser && roleInfo && (
          <ProfileModal
            user={{ name: displayName, email: currentUser.email ?? '' }}
            roleInfo={roleInfo}
            initials={initials}
            roleDest={roleDest}
            onClose={() => setShowProfileModal(false)}
            onSignOut={handleSignOut}
          />
        )}
      </AnimatePresence>
    </>
  )
}
