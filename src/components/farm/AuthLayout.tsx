import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Leaf, Globe, ShieldCheck, Zap } from 'lucide-react'
import { useTheme } from 'next-themes'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="min-h-screen bg-[#050a05]" />

  const isDark = resolvedTheme === 'dark'

  return (
    <div className={`min-h-screen w-full relative flex items-center justify-center overflow-hidden p-6 transition-colors duration-500 selection:bg-[#4ade80]/30 ${
      isDark ? 'bg-[#050a05]' : 'bg-[#f7f5f0]'
    }`}>
      {/* ─── Animated Mesh Gradient Background ──────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className={`absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full ${
            isDark ? 'opacity-30 bg-gradient-to-br from-[#16a34a]/20 to-transparent' : 'opacity-40 bg-gradient-to-br from-[#4ade80]/30 to-transparent'
          } blur-[120px]`} 
        />
        <motion.div 
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full ${
            isDark ? 'opacity-30 bg-gradient-to-tl from-[#d4a017]/15 to-transparent' : 'opacity-40 bg-gradient-to-tl from-[#d4a017]/20 to-transparent'
          } blur-[100px]`} 
        />
        <div className={`absolute inset-0 backdrop-blur-[20px] ${
          isDark ? 'bg-[#050a05]/40' : 'bg-[#f7f5f0]/30'
        }`} />
        {/* Subtle grid pattern for texture */}
        <div className={`absolute inset-0 opacity-[0.05] ${isDark ? 'mix-blend-overlay' : 'mix-blend-multiply'}`} style={{ backgroundImage: 'radial-gradient(#4ade80 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      {/* ─── Brand Floating Elements ────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ y: [0, -20, 0] }} 
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-[15%] left-[10%] opacity-20"
        >
          <Leaf className={`w-12 h-12 ${isDark ? 'text-[#4ade80]' : 'text-[#16a34a]'}`} />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0] }} 
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-[20%] right-[15%] opacity-20"
        >
          <Globe className={`w-10 h-10 ${isDark ? 'text-[#d4a017]' : 'text-[#b8870f]'}`} />
        </motion.div>
      </div>

      {/* ─── Main Portal Card ───────────────────────────────────────────────── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className={`relative w-full max-w-5xl grid lg:grid-cols-2 backdrop-blur-3xl rounded-[3rem] border shadow-[0_32px_120px_rgba(0,0,0,0.15)] overflow-hidden group transition-all duration-500 ${
          isDark ? 'bg-[#0d1a0d]/40 border-white/5' : 'bg-white/90 border-[#16a34a]/10'
        }`}
      >
        {/* Inner glow/shine effect */}
        <div className={`absolute inset-0 pointer-events-none rounded-[3rem] ${
          isDark ? 'shadow-[inset_0_0_80px_rgba(74,222,128,0.03)]' : 'shadow-[inset_0_0_80px_rgba(255,255,255,0.4)]'
        }`} />
        {!isDark && (
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
        )}

        {/* ─── Left Side: Cinematic Branding ─────────────────────────────────── */}
        <div className={`hidden lg:flex flex-col justify-between p-16 relative overflow-hidden border-r ${
          isDark ? 'border-white/5' : 'border-[#16a34a]/10'
        }`}>
          <div className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${
            isDark 
              ? 'opacity-40 mix-blend-overlay grayscale hover:grayscale-0' 
              : 'opacity-100 mix-blend-normal'
          }`} style={{ backgroundImage: 'url("/assets/auth-bg.png")' }} />
          <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 ${
            isDark 
              ? 'from-[#0d1a0d] via-[#0d1a0d]/80 to-transparent' 
              : 'from-white/95 via-white/60 to-white/20'
          }`} />
          
          <div className="relative z-10">
            <motion.div className="flex items-center gap-3 mb-10">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#16a34a] to-[#15803d] shadow-lg shadow-[#16a34a]/20">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <span className={`text-3xl font-black tracking-widest uppercase ${
                isDark ? 'text-white' : 'text-[#050a05]'
              }`} style={{ fontFamily: "'Syne', sans-serif" }}>
                HarvestHub
              </span>
            </motion.div>

            <div className="space-y-6">
              <h2 className={`text-6xl font-black leading-[0.9] tracking-tighter ${
                isDark ? 'text-white' : 'text-[#050a05]'
              }`} style={{ fontFamily: "'Syne', sans-serif" }}>
                REAP <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16a34a] via-[#4ade80] to-[#16a34a]">FUTURE</span> <br />
                REWARDS
              </h2>
              <p className={`text-base max-w-sm leading-relaxed border-l-4 pl-6 py-2 transition-all duration-500 ${
                isDark 
                  ? 'text-[#7a9a7a] border-[#4ade80]/30' 
                  : 'text-[#1a3a1a] border-[#16a34a] font-medium'
              }`}>
                Experience India's most advanced digital agriculture ecosystem. Optimized for speed and scale.
              </p>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-6 pb-4">
             {[
                { icon: <Zap />, label: 'Fast Pass', val: 'Low Latency' },
                { icon: <ShieldCheck />, label: 'Enterprise', val: 'Biometric Safe' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group/item">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${
                    isDark 
                      ? 'bg-white/5 text-[#4ade80] group-hover/item:bg-[#4ade80] group-hover/item:text-[#050a05]' 
                      : 'bg-[#16a34a] text-white group-hover/item:bg-[#15803d] shadow-[#16a34a]/20'
                  }`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className={`text-xs font-black uppercase tracking-wider ${
                      isDark ? 'text-white' : 'text-[#050a05]'
                    }`}>{item.label}</div>
                    <div className={`text-[10px] font-bold ${
                      isDark ? 'text-[#7a9a7a]' : 'text-[#4a5a4a]'
                    }`}>{item.val}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* ─── Right Side: Auth Form ─────────────────────────────────────────── */}
        <div className={`flex flex-col justify-center p-8 lg:p-16 relative ${
          isDark ? 'bg-[#0d1a0d]/20' : 'bg-white/40'
        }`}>
          <div className="max-w-md w-full mx-auto">
            <header className="mb-10 lg:text-left text-center">
               <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:hidden flex items-center justify-center gap-2 mb-6"
              >
                <Leaf className="w-8 h-8 text-[#4ade80]" />
                <span className={`text-2xl font-black tracking-widest uppercase ${
                  isDark ? 'text-white' : 'text-[#050a05]'
                }`} style={{ fontFamily: "'Syne', sans-serif" }}>HarvestHub</span>
              </motion.div>
              
              <motion.h3 
                layoutId="auth-title"
                className={`text-4xl font-black mb-3 ${
                  isDark ? 'text-white' : 'text-[#050a05]'
                }`} 
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {title}
              </motion.h3>
              <motion.p 
                layoutId="auth-subtitle"
                className={`text-sm font-semibold ${
                  isDark ? 'text-[#7a9a7a]' : 'text-[#4a5a4a]'
                }`}
              >
                {subtitle}
              </motion.p>
            </header>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {children}
            </motion.div>

            <footer className="mt-12 text-center">
              <div className={`h-[1px] w-12 mx-auto mb-6 ${
                isDark ? 'bg-[#2a4a2a]' : 'bg-[#16a34a]/20'
              }`} />
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                isDark ? 'text-[#3a5a3a]' : 'text-[#4a5a4a]/60'
              }`}>
                Verified Secured Authentication
              </p>
            </footer>
          </div>
        </div>
      </motion.div>

      {/* ─── Scroll/Help Indicator ─────────────────────────────────────────── */}
      <div className={`absolute bottom-8 text-[10px] uppercase font-bold tracking-widest hidden lg:block ${
        isDark ? 'text-[#7a9a7a]/40' : 'text-[#4a5a4a]/30'
      }`}>
        Moving through the portal...
      </div>
    </div>
  )
}
