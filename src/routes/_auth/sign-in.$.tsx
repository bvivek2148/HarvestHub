import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@clerk/tanstack-react-start'

export const Route = createFileRoute('/_auth/sign-in/$')({
  component: SignInPage,
})

import { useState } from 'react'
import { Phone, Mail } from 'lucide-react'
import { PhoneLogin } from '@/components/farm/PhoneLogin'

import { AuthLayout } from '@/components/farm/AuthLayout'

import { useTheme } from 'next-themes'

function SignInPage() {
  const [mode, setMode] = useState<'clerk' | 'phone'>('clerk')
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <AuthLayout 
      title={mode === 'clerk' ? "SYSTEM ACCESS" : "SECURE IDENTIFIER"} 
      subtitle={mode === 'clerk' ? "Initialize standard encrypted connection." : "Biometric-ready phone authentication."}
    >
      <div className="w-full mb-10 relative z-10 transition-all duration-300">
        <div className={`flex p-1.5 backdrop-blur-2xl border rounded-2xl shadow-inner ${
          isDark ? 'bg-white/[0.03] border-white/10 shadow-white/5' : 'bg-[#050a05]/5 border-[#050a05]/5 shadow-black/5'
        }`}>
          <button
            onClick={() => setMode('clerk')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
              mode === 'clerk'
                ? (isDark ? 'bg-white text-[#050a05] shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-[#16a34a] text-white shadow-[0_0_20px_rgba(22,163,74,0.2)]')
                : (isDark ? 'text-[#7a9a7a] hover:text-white hover:bg-white/5' : 'text-[#4a5a4a] hover:text-[#16a34a] hover:bg-[#050a05]/5')
            }`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            <Mail className="w-4 h-4" />
            Standard
          </button>
          <button
            type="button"
            disabled
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative group/phone overflow-hidden ${
              isDark ? 'text-[#3a4a3a] bg-white/[0.01]' : 'text-[#4a5a4a]/40 bg-[#050a05]/5'
            }`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover/phone:translate-x-full transition-transform duration-1000" />
            <Phone className="w-4 h-4 opacity-40" />
            Phone
            <div className="absolute top-1.5 right-1.5 flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4a017] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#d4a017]"></span>
              </span>
              <span className="text-[7px] font-black text-[#d4a017] tracking-tighter opacity-0 group-hover/phone:opacity-100 transition-opacity whitespace-nowrap">
                COMING SOON
              </span>
            </div>
          </button>
        </div>
      </div>

      <div className="w-full relative z-10">
        {mode === 'clerk' ? (
          <SignIn 
            routing="path" 
            path="/sign-in" 
            signUpUrl="/sign-up"
            appearance={{
              elements: {
                rootBox: "w-full mx-auto",
                card: "bg-transparent shadow-none p-0 border-none",
                header: "flex flex-col items-center mb-8",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: `${isDark ? 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08] text-white' : 'bg-[#050a05]/5 border-[#050a05]/10 hover:bg-[#050a05]/10 text-[#050a05]'} transition-all rounded-2xl py-4 border-opacity-20`,
                socialButtonsBlockButtonText: "font-black uppercase tracking-widest text-[10px]",
                formButtonPrimary: `${isDark ? 'bg-white text-[#050a05] hover:bg-[#4ade80]' : 'bg-[#16a34a] text-white hover:bg-[#15803d]'} transition-all duration-500 border-none shadow-[0_0_40px_rgba(255,255,255,0.1)] rounded-2xl py-4 font-black uppercase tracking-[0.3em] text-xs`,
                formFieldLabel: `${isDark ? 'text-[#7a9a7a]' : 'text-[#4a5a4a]'} font-black text-[9px] uppercase tracking-[0.2em] ml-1 mb-2`,
                formFieldInput: `${isDark ? 'bg-white/[0.03] border-white/10 text-white' : 'bg-[#050a05]/5 border-[#050a05]/10 text-[#050a05]'} focus:ring-4 focus:ring-[#4ade80]/10 focus:border-[#4ade80] rounded-2xl py-4 transition-all`,
                footerActionText: `${isDark ? 'text-[#3a5a3a]' : 'text-[#4a5a4a]'} font-bold text-[10px] uppercase tracking-wider`,
                footerActionLink: "text-[#4ade80] hover:text-[#16a34a] font-black transition-all uppercase text-[10px] tracking-widest ml-1",
                dividerRow: isDark ? "border-white/5" : "border-[#050a05]/5",
                dividerText: `${isDark ? 'text-[#3a5a3a]' : 'text-[#4a5a4a]'} text-[9px] font-black uppercase tracking-[0.3em]`,
                identityPreviewText: isDark ? "text-white font-bold" : "text-[#050a05] font-bold",
                identityPreviewEditButtonIcon: "text-[#4ade80]",
                formFieldAction: "text-[#4ade80] hover:text-[#16a34a] text-[10px] font-bold",
              }
            }}
          />
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-500 slide-in-from-right-4">
            <PhoneLogin />
          </div>
        )}
      </div>
    </AuthLayout>
  )
}
