'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult 
} from 'firebase/auth'
import { app } from '@/lib/firebase'
import { syncFirebaseUserFn } from '@/server/functions/sync-auth'
import { useServerFn } from '@tanstack/react-start'
import { useAuth, useClerk } from '@clerk/tanstack-react-start'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Loader2, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  Zap
} from 'lucide-react'

export function PhoneLogin() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp' | 'syncing' | 'success'>('phone')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null)
  
  const syncUser = useServerFn(syncFirebaseUserFn)
  const { isLoaded: clerkLoaded } = useAuth()
  const { signIn } = useClerk() as any
  const auth = getAuth(app)

  useEffect(() => {
    if (!recaptchaVerifier.current && recaptchaRef.current) {
      recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        }
      })
    }
  }, [auth])

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber) return
    
    setError('')
    setLoading(true)
    
    try {
      // Format number if needed (assuming India +91 if no +)
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`
      const confirmation = await signInWithPhoneNumber(auth, formattedNumber, recaptchaVerifier.current!)
      setConfirmationResult(confirmation)
      setStep('otp')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to send OTP. Please try again.')
      // Reset recaptcha if it fails
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear()
        recaptchaVerifier.current = null
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || !confirmationResult) return
    
    setError('')
    setLoading(true)
    
    try {
      const result = await confirmationResult.confirm(otp)
      const idToken = await result.user.getIdToken()
      
      setStep('syncing')
      
      // Sync with Clerk
      const syncResult = await (syncUser as any)({ idToken })
      
      if (syncResult.success && syncResult.signInToken && clerkLoaded && signIn) {
        // Authenticate with Clerk using the generated token
        await (signIn as any).create({
          strategy: 'ticket',
          ticket: syncResult.signInToken
        })
        
        setStep('success')
        setTimeout(() => {
          const dest = syncResult.user?.role === 'admin' ? '/admin' : '/farmer'
          window.location.href = dest
        }, 1500)
      } else {
        throw new Error(syncResult.error || 'Identity synchronization failed.')
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Invalid OTP or synchronization error.')
      setStep('otp')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div id="recaptcha-container" ref={recaptchaRef}></div>
      
      <div className="relative group">
        <AnimatePresence mode="wait">
          {step === 'phone' && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#7a9a7a] ml-1 uppercase tracking-[0.2em]">
                    Mobile Identifier
                  </label>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                      <span className="text-sm font-black text-[#d4a017]">+91</span>
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9876543210"
                      className="w-full bg-white/[0.03] border border-white/10 text-white text-lg font-bold rounded-2xl py-4 pl-16 pr-4 transition-all focus:ring-4 focus:ring-[#4ade80]/10 focus:border-[#4ade80] focus:bg-white/[0.05] outline-none placeholder:text-white/10"
                      required
                    />
                    {/* Animated border glow */}
                    <div className="absolute inset-0 rounded-2xl border border-[#4ade80]/0 group-focus-within/input:border-[#4ade80]/50 transition-all pointer-events-none" />
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading || phoneNumber.length < 10}
                  className="w-full bg-white text-[#050a05] font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 overflow-hidden relative group/btn disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4ade80] to-[#16a34a] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 flex items-center gap-2 uppercase tracking-widest text-xs">
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Initiate Session <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </span>
                </button>
              </form>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#7a9a7a] ml-1 uppercase tracking-[0.2em] block text-center">
                    Confirmatory Code
                  </label>
                  <div className="flex justify-center">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      className="w-full max-w-[280px] bg-white/[0.03] border border-white/10 text-white text-center text-4xl font-black tracking-[0.4em] rounded-2xl py-6 transition-all focus:ring-4 focus:ring-[#d4a017]/10 focus:border-[#d4a017] outline-none placeholder:text-white/5"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold justify-center">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full bg-gradient-to-r from-[#d4a017] to-[#b8870f] text-[#050a05] font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs shadow-lg shadow-[#d4a017]/20 disabled:opacity-50 hover:brightness-110"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Verify Identity <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-full text-[10px] font-black text-[#7a9a7a] hover:text-[#f5f0e8] transition-colors uppercase tracking-widest"
                >
                  Revise Phone Number
                </button>
              </form>
            </motion.div>
          )}

          {(step === 'syncing' || step === 'success') && (
            <motion.div
              key="syncing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center space-y-8"
            >
              <div className="relative w-32 h-32 mx-auto">
                <AnimatePresence>
                  {step === 'syncing' ? (
                    <motion.div 
                      key="spinner"
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute inset-0 rounded-full border-[6px] border-[#4ade80]/10 border-t-[#4ade80] animate-spin" 
                    />
                  ) : (
                    <motion.div 
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 rounded-full bg-[#4ade80] flex items-center justify-center shadow-[0_0_30px_rgba(74,222,128,0.4)]"
                    >
                      <CheckCircle2 className="w-16 h-16 text-[#050a05]" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="absolute inset-6 rounded-full bg-[#111f11] flex items-center justify-center">
                   <Zap className={`w-10 h-10 ${step === 'syncing' ? 'text-[#4ade80] animate-pulse' : 'text-[#4ade80]'}`} />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {step === 'syncing' ? 'SYNCHRONIZING' : 'SESSION READY'}
                </h3>
                <p className="text-xs font-medium text-[#7a9a7a] px-8 leading-relaxed">
                  {step === 'syncing' 
                    ? 'Aligning your secure identity across the ecosystem.' 
                    : 'Universal access granted. Redirecting to your dashboard...'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
