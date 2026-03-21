'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/use-auth'
import { Link } from '@tanstack/react-router'
import {
  Sprout,
  Loader2,
  CheckCircle,
  MapPin,
  Wheat,
  Droplets,
  Sun,
  Leaf,
  Phone,
  FileText,
  Lock,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Shield,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'

const HELPDESK = 'harvesthub.helpdesk@gmail.com'

const farmerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(7, 'Valid phone number required'),
  location: z.string().min(3, 'Location / village is required'),
  farmSize: z.string().min(1, 'Farm size is required'),
  produceTypes: z.string().min(3, 'Please describe what you grow'),
  practices: z.enum(['organic', 'natural', 'conventional', 'mixed']),
  experience: z.string().min(1, 'Years of farming experience required'),
  bio: z.string().min(10, 'Please write a short introduction').max(500),
  deliveryCapability: z.enum(['yes', 'pickup_only', 'both']),
})

type FarmerFormData = z.infer<typeof farmerSchema>

const PRACTICES = [
  {
    value: 'organic',
    label: 'Organic',
    emoji: '🌿',
    desc: 'Certified or practicing organic farming',
    color: '#22c55e',
  },
  {
    value: 'natural',
    label: 'Natural',
    emoji: '🌱',
    desc: 'No chemicals, traditional methods',
    color: '#4ade80',
  },
  {
    value: 'conventional',
    label: 'Conventional',
    emoji: '🚜',
    desc: 'Standard modern farming practices',
    color: '#d4a017',
  },
  {
    value: 'mixed',
    label: 'Mixed',
    emoji: '🔄',
    desc: 'Combination of methods',
    color: '#3b82f6',
  },
]

const DELIVERY_OPTIONS = [
  {
    value: 'yes',
    label: 'I can deliver',
    emoji: '🚚',
    desc: 'Deliver to buyers directly',
  },
  {
    value: 'pickup_only',
    label: 'Pickup only',
    emoji: '📍',
    desc: 'Buyers come to my farm',
  },
  {
    value: 'both',
    label: 'Both options',
    emoji: '🔄',
    desc: 'Either option works for me',
  },
]

// Stats shown on the left panel
const STATS = [
  {
    value: '2,400+',
    label: 'Active Farmers',
    icon: <Users className="w-4 h-4" />,
  },
  {
    value: '₹12K',
    label: 'Avg Monthly Income',
    icon: <TrendingUp className="w-4 h-4" />,
  },
  { value: '4.8★', label: 'Farmer Rating', icon: <Star className="w-4 h-4" /> },
  {
    value: '24h',
    label: 'Application Review',
    icon: <Shield className="w-4 h-4" />,
  },
]

// Testimonials
const TESTIMONIALS = [
  {
    name: 'Ramesh Kumar',
    location: 'Karnataka',
    text: 'I listed my first product in under 3 minutes. Within a week I had 12 regular buyers.',
    emoji: '🧑‍🌾',
  },
  {
    name: 'Priya Patel',
    location: 'Maharashtra',
    text: 'The escrow system means I always get paid on time. No more payment chasing.',
    emoji: '👩‍🌾',
  },
  {
    name: 'Anand Rao',
    location: 'Tamil Nadu',
    text: 'My organic produce gets 60% more orders than before I joined HarvestHub.',
    emoji: '🌾',
  },
]

// Multi-step config
const STEPS = [
  { id: 1, label: 'Personal', icon: <Phone className="w-4 h-4" /> },
  { id: 2, label: 'Farm Info', icon: <Wheat className="w-4 h-4" /> },
  { id: 3, label: 'Practices', icon: <Droplets className="w-4 h-4" /> },
  { id: 4, label: 'Story', icon: <FileText className="w-4 h-4" /> },
]

export function JoinFarmerForm() {
  const { currentUser } = useAuth()
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [rootError, setRootError] = useState('')
  const [step, setStep] = useState(1)
  const [testimonialIdx, setTestimonialIdx] = useState(0)

  // Rotate testimonials
  useState(() => {
    const iv = setInterval(
      () => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length),
      4500,
    )
    return () => clearInterval(iv)
  })

  const form = useForm<FarmerFormData>({
    resolver: zodResolver(farmerSchema),
    defaultValues: {
      fullName: currentUser?.name ?? '',
      phone: '',
      location: '',
      farmSize: '',
      produceTypes: '',
      practices: 'organic',
      experience: '',
      bio: '',
      deliveryCapability: 'both',
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: FarmerFormData) => {
    if (!currentUser) return
    setSubmitting(true)
    setRootError('')
    try {
      const subject = encodeURIComponent(
        `[HarvestHub] Farmer Application — ${data.fullName}`,
      )
      const body = encodeURIComponent(
        `FARMER JOIN APPLICATION\n` +
          `========================\n\n` +
          `Applicant: ${data.fullName}\n` +
          `Email: ${currentUser.email}\n` +
          `Account ID: ${currentUser.$id}\n` +
          `Phone: ${data.phone}\n\n` +
          `Farm Location: ${data.location}\n` +
          `Farm Size: ${data.farmSize} acres\n` +
          `Years Experience: ${data.experience} years\n\n` +
          `Produce Types: ${data.produceTypes}\n` +
          `Growing Practices: ${data.practices}\n` +
          `Delivery Capability: ${data.deliveryCapability}\n\n` +
          `Bio / Introduction:\n${data.bio}\n\n` +
          `========================\n` +
          `Submitted via HarvestHub — ${new Date().toLocaleString()}\n` +
          `Please review and assign Farmer role in Admin Dashboard.\n` +
          `User account: ${currentUser.email}`,
      )
      window.open(`mailto:${HELPDESK}?subject=${subject}&body=${body}`)
      setSubmitted(true)
    } catch {
      setRootError(
        'Failed to open mail client. Please email us directly at ' + HELPDESK,
      )
    } finally {
      setSubmitting(false)
    }
  }

  const nextStep = async () => {
    let valid = false
    if (step === 1) valid = await form.trigger(['fullName', 'phone'])
    else if (step === 2)
      valid = await form.trigger([
        'location',
        'farmSize',
        'experience',
        'produceTypes',
      ])
    else if (step === 3)
      valid = await form.trigger(['practices', 'deliveryCapability'])
    else if (step === 4) valid = await form.trigger(['bio'])
    if (valid && step < 4) setStep((s) => s + 1)
    else if (valid && step === 4) void form.handleSubmit(onSubmit)()
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: '#060e06' }}
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url('/farm-sunset-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          opacity: 0.12,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#060e06]/90 via-[#0a160a]/80 to-[#060e06]/95 pointer-events-none" />

      {/* Animated blobs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(212,160,23,0.04) 0%, transparent 70%)',
        }}
      />

      {/* Header */}
      <header className="relative z-10 h-16 flex items-center px-6 border-b border-[#1a3a1a]/40">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#d4a017] to-[#8a6310] group-hover:shadow-lg group-hover:shadow-[#d4a017]/30 transition-all" />
            <Sprout className="absolute inset-0 m-auto w-4 h-4 text-[#0d1a0d]" />
          </div>
          <span
            className="text-base font-bold text-[#f5f0e8]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Harvest<span className="text-[#d4a017]">Hub</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: 'rgba(74,222,128,0.15)',
                  color: '#4ade80',
                  border: '1px solid rgba(74,222,128,0.3)',
                }}
              >
                {(currentUser.name ||
                  currentUser.email ||
                  'U')[0].toUpperCase()}
              </div>
              <span
                className="text-xs text-[#7a9a7a]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {currentUser.name || currentUser.email}
              </span>
            </div>
          ) : (
            <Link
              to="/sign-in/$"
              className="text-xs text-[#d4a017] font-semibold hover:underline"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Sign In to Apply →
            </Link>
          )}
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 items-start">
          {/* ── LEFT PANEL — Social proof ── */}
          <div className="hidden lg:block sticky top-10">
            {/* Brand badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2a4a2a] bg-[#1a2e1a]/60 text-[#d4a017] text-xs font-bold tracking-widest uppercase mb-6"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <Leaf className="w-3.5 h-3.5" /> Farmer Programme
              </div>

              <h2
                className="text-4xl font-black text-[#f5f0e8] leading-tight mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Grow Your Farm.
                <br />
                <span className="italic text-[#4ade80]">Grow Your Income.</span>
              </h2>
              <p
                className="text-[#7a9a7a] text-sm leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Join 2,400+ farmers who sell directly to thousands of local
                buyers — no middlemen, guaranteed payments, and tools designed
                for rural connectivity.
              </p>
            </motion.div>

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-3 mb-8"
            >
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.07 }}
                  className="p-4 rounded-2xl relative overflow-hidden group"
                  style={{
                    background: 'rgba(17,31,17,0.7)',
                    border: '1px solid rgba(42,74,42,0.4)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4ade80]/0 to-[#4ade80]/0 group-hover:from-[#4ade80]/3 transition-all duration-500" />
                  <div className="text-[#4a7c4a] mb-2">{stat.icon}</div>
                  <div
                    className="text-xl font-black text-[#d4a017]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-[10px] text-[#7a7060] uppercase tracking-wider"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Testimonials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(17,31,17,0.7)',
                border: '1px solid rgba(42,74,42,0.4)',
              }}
            >
              <div className="p-5">
                <div className="flex items-center gap-1.5 mb-4">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      onClick={() => setTestimonialIdx(i)}
                      className="transition-all duration-300 rounded-full"
                      style={{
                        width: testimonialIdx === i ? 20 : 6,
                        height: 6,
                        background:
                          testimonialIdx === i ? '#4ade80' : '#2a4a2a',
                      }}
                    />
                  ))}
                  <span
                    className="ml-auto text-[10px] text-[#4a5a4a]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Farmer stories
                  </span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={testimonialIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p
                      className="text-sm text-[#c5bfb0] leading-relaxed mb-4 italic"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      &ldquo;{TESTIMONIALS[testimonialIdx].text}&rdquo;
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="text-xl">
                        {TESTIMONIALS[testimonialIdx].emoji}
                      </div>
                      <div>
                        <div
                          className="text-xs font-bold text-[#f5f0e8]"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {TESTIMONIALS[testimonialIdx].name}
                        </div>
                        <div
                          className="text-[10px] text-[#4a7c4a]"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          📍 {TESTIMONIALS[testimonialIdx].location}
                        </div>
                      </div>
                      <div className="ml-auto flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className="w-3 h-3 fill-[#d4a017] text-[#d4a017]"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Benefits list */}
              <div className="border-t border-[#1a3a1a] p-5 space-y-2.5">
                {[
                  '✅ List produce in under 3 minutes',
                  '✅ Escrow-protected payments always',
                  '✅ Real-time chat with buyers',
                  '✅ Works on 2G connections',
                  '✅ Zero listing fees ever',
                ].map((benefit) => (
                  <div
                    key={benefit}
                    className="text-xs text-[#7a9a7a]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {benefit}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT PANEL — Form ── */}
          <div>
            {/* Page title (mobile) */}
            <div className="lg:hidden text-center mb-8">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2a4a2a] bg-[#1a2e1a]/60 text-[#d4a017] text-xs font-medium tracking-widest uppercase mb-4"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <Leaf className="w-3.5 h-3.5" /> Farmer Application
              </div>
              <h1
                className="text-3xl font-black text-[#f5f0e8] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Join as a <span className="text-[#4ade80]">Farmer</span>
              </h1>
              <p
                className="text-[#7a9a7a] text-sm"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Our team at <span className="text-[#4ade80]">{HELPDESK}</span>{' '}
                reviews within 24h.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {/* ── Not logged in gate ── */}
              {!currentUser && (
                <motion.div
                  key="gate"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  className="rounded-2xl border border-[#2a4a2a]/60 bg-[#0d1a0d]/80 backdrop-blur-xl p-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{
                      background: 'rgba(212,160,23,0.1)',
                      border: '2px solid rgba(212,160,23,0.4)',
                    }}
                  >
                    <Lock className="w-8 h-8 text-[#d4a017]" />
                  </motion.div>
                  <h2
                    className="text-2xl font-bold text-[#f5f0e8] mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Sign In to Apply
                  </h2>
                  <p
                    className="text-sm text-[#7a7060] mb-8 max-w-sm mx-auto leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    You must be signed in to submit a farmer application. Your
                    account details are automatically included with the
                    application.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      to="/sign-in/$"
                      className="flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all hover:shadow-lg hover:shadow-[#d4a017]/20"
                      style={{
                        background: 'linear-gradient(135deg,#d4a017,#b8870f)',
                        color: '#0d1a0d',
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Sign In <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/sign-up/$"
                      className="flex items-center justify-center gap-2 px-8 py-3 rounded-full font-semibold text-sm border border-[#2a4a2a]/60 text-[#f5f0e8] hover:bg-[#1a2e1a]/40 transition-colors"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Create Account
                    </Link>
                  </div>

                  {/* Mini stats for motivation */}
                  <div className="grid grid-cols-2 gap-3 mt-10 max-w-xs mx-auto">
                    {STATS.slice(0, 4).map((stat) => (
                      <div
                        key={stat.label}
                        className="p-3 rounded-xl text-center"
                        style={{
                          background: '#111f11',
                          border: '1px solid rgba(42,74,42,0.3)',
                        }}
                      >
                        <div
                          className="text-base font-black text-[#d4a017]"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {stat.value}
                        </div>
                        <div
                          className="text-[9px] text-[#7a7060] uppercase tracking-wider"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── Success state ── */}
              {currentUser && submitted && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl border border-[#2a4a2a]/60 bg-[#0d1a0d]/80 backdrop-blur-xl p-12 text-center"
                >
                  {/* Animated checkmark */}
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 180 }}
                    className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 relative"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(74,222,128,0.15) 0%, transparent 70%)',
                      border: '2px solid #4ade80',
                    }}
                  >
                    <CheckCircle className="w-12 h-12 text-[#4ade80]" />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-[#4ade80]"
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        repeatDelay: 0.5,
                      }}
                    />
                  </motion.div>

                  <h2
                    className="text-3xl font-black text-[#f5f0e8] mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Application Submitted! 🌾
                  </h2>
                  <p
                    className="text-[#a09880] text-sm leading-relaxed mb-2"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Your application has been sent to{' '}
                    <span className="text-[#4ade80] font-semibold">
                      {HELPDESK}
                    </span>
                    .
                  </p>
                  <p
                    className="text-[#7a7060] text-xs leading-relaxed mb-8 max-w-sm mx-auto"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Our admin team will review your details and promote your
                    account from Buyer to Farmer within{' '}
                    <strong className="text-[#d4a017]">24 hours</strong>. You'll
                    be notified once your role is upgraded.
                  </p>

                  {/* What happens next */}
                  <div className="grid grid-cols-3 gap-3 mb-8 max-w-sm mx-auto">
                    {[
                      {
                        step: '1',
                        desc: 'Team reviews your application',
                        icon: '👀',
                      },
                      {
                        step: '2',
                        desc: 'Role upgraded to Farmer',
                        icon: '⬆️',
                      },
                      { step: '3', desc: 'Start listing produce!', icon: '🌾' },
                    ].map((s) => (
                      <div
                        key={s.step}
                        className="p-3 rounded-xl text-center"
                        style={{
                          background: '#111f11',
                          border: '1px solid rgba(42,74,42,0.3)',
                        }}
                      >
                        <div className="text-lg mb-1">{s.icon}</div>
                        <div
                          className="text-[9px] text-[#7a9a7a] leading-tight"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {s.desc}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm transition-all hover:shadow-xl hover:shadow-[#4ade80]/20"
                    style={{
                      background: 'linear-gradient(135deg,#4ade80,#16a34a)',
                      color: '#0d1a0d',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Back to Marketplace →
                  </Link>
                </motion.div>
              )}

              {/* ── Multi-step form ── */}
              {currentUser && !submitted && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Step progress */}
                  <div
                    className="rounded-2xl p-5 mb-5"
                    style={{
                      background: 'rgba(17,31,17,0.6)',
                      border: '1px solid rgba(42,74,42,0.4)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {STEPS.map((s, idx) => (
                        <div key={s.id} className="flex items-center flex-1">
                          <button
                            onClick={() => step > s.id && setStep(s.id)}
                            className="flex flex-col items-center gap-1 group flex-1"
                            disabled={step < s.id}
                          >
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                              style={{
                                background:
                                  step === s.id
                                    ? 'linear-gradient(135deg,#4ade80,#16a34a)'
                                    : step > s.id
                                      ? 'rgba(74,222,128,0.15)'
                                      : 'rgba(26,46,26,0.6)',
                                border:
                                  step === s.id
                                    ? '2px solid #4ade80'
                                    : step > s.id
                                      ? '2px solid rgba(74,222,128,0.4)'
                                      : '2px solid rgba(42,74,42,0.3)',
                                color:
                                  step === s.id
                                    ? '#0d1a0d'
                                    : step > s.id
                                      ? '#4ade80'
                                      : '#4a5a4a',
                                boxShadow:
                                  step === s.id
                                    ? '0 0 16px rgba(74,222,128,0.3)'
                                    : 'none',
                              }}
                            >
                              {step > s.id ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                s.icon
                              )}
                            </div>
                            <span
                              className="text-[9px] font-semibold uppercase tracking-wider"
                              style={{
                                fontFamily: "'DM Sans', sans-serif",
                                color:
                                  step === s.id
                                    ? '#4ade80'
                                    : step > s.id
                                      ? '#4a7c4a'
                                      : '#3a4a3a',
                              }}
                            >
                              {s.label}
                            </span>
                          </button>
                          {idx < STEPS.length - 1 && (
                            <div
                              className="h-0.5 flex-1 mx-1 transition-all duration-500"
                              style={{
                                background:
                                  step > s.id
                                    ? 'linear-gradient(90deg,#4ade80,rgba(74,222,128,0.4))'
                                    : 'rgba(42,74,42,0.3)',
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form card */}
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: '#0d1a0d',
                      border: '1px solid rgba(42,74,42,0.5)',
                    }}
                  >
                    {/* Gradient top bar */}
                    <div
                      className="h-1 w-full"
                      style={{
                        background:
                          'linear-gradient(90deg,#4ade80,#d4a017,#22c55e)',
                      }}
                    />

                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="p-7"
                    >
                      <AnimatePresence mode="wait">
                        {/* ── Step 1: Personal ── */}
                        {step === 1 && (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3 }}
                          >
                            <SectionHead
                              icon={<Phone className="w-4 h-4" />}
                              title="Personal Details"
                              color="#4ade80"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                              <FormField
                                label="Full Name"
                                error={form.formState.errors.fullName?.message}
                              >
                                <input
                                  {...form.register('fullName')}
                                  type="text"
                                  placeholder="Your full name"
                                  className={INPUT_CLASS}
                                />
                              </FormField>
                              <FormField
                                label="Phone Number"
                                error={form.formState.errors.phone?.message}
                              >
                                <input
                                  {...form.register('phone')}
                                  type="tel"
                                  placeholder="+91 98765 43210"
                                  className={INPUT_CLASS}
                                />
                              </FormField>
                            </div>
                            <div className="mt-5">
                              <label className={LABEL_CLASS}>
                                Registered Email
                              </label>
                              <div
                                className="w-full px-4 py-3 rounded-xl text-sm text-[#7a9a7a] flex items-center gap-2"
                                style={{
                                  background: 'rgba(74,222,128,0.05)',
                                  border: '1px solid rgba(74,222,128,0.2)',
                                }}
                              >
                                <CheckCircle className="w-4 h-4 text-[#4ade80]" />
                                {currentUser.email}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* ── Step 2: Farm Info ── */}
                        {step === 2 && (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3 }}
                          >
                            <SectionHead
                              icon={<Wheat className="w-4 h-4" />}
                              title="Farm Information"
                              color="#d4a017"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                              <FormField
                                label="Village / Location"
                                error={form.formState.errors.location?.message}
                              >
                                <div className="relative">
                                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a5a4a]" />
                                  <input
                                    {...form.register('location')}
                                    type="text"
                                    placeholder="Village, District, State"
                                    className={`${INPUT_CLASS} pl-10`}
                                  />
                                </div>
                              </FormField>
                              <FormField
                                label="Farm Size (acres)"
                                error={form.formState.errors.farmSize?.message}
                              >
                                <input
                                  {...form.register('farmSize')}
                                  type="text"
                                  placeholder="e.g. 2.5"
                                  className={INPUT_CLASS}
                                />
                              </FormField>
                              <FormField
                                label="Years of Experience"
                                error={
                                  form.formState.errors.experience?.message
                                }
                              >
                                <input
                                  {...form.register('experience')}
                                  type="text"
                                  placeholder="e.g. 8 years"
                                  className={INPUT_CLASS}
                                />
                              </FormField>
                              <FormField
                                label="Produce You Grow"
                                error={
                                  form.formState.errors.produceTypes?.message
                                }
                              >
                                <input
                                  {...form.register('produceTypes')}
                                  type="text"
                                  placeholder="e.g. Tomatoes, Corn, Spinach"
                                  className={INPUT_CLASS}
                                />
                              </FormField>
                            </div>
                          </motion.div>
                        )}

                        {/* ── Step 3: Practices + Delivery ── */}
                        {step === 3 && (
                          <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3 }}
                          >
                            <SectionHead
                              icon={<Droplets className="w-4 h-4" />}
                              title="Growing Practices"
                              color="#22c55e"
                            />
                            <div className="grid grid-cols-2 gap-3 mt-5">
                              {PRACTICES.map((p) => {
                                const selected =
                                  form.watch('practices') === p.value
                                return (
                                  <motion.button
                                    key={p.value}
                                    type="button"
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() =>
                                      form.setValue(
                                        'practices',
                                        p.value as FarmerFormData['practices'],
                                      )
                                    }
                                    className="p-4 rounded-xl text-left transition-all duration-200 relative overflow-hidden"
                                    style={{
                                      background: selected
                                        ? `${p.color}12`
                                        : 'rgba(26,46,26,0.4)',
                                      border: selected
                                        ? `2px solid ${p.color}60`
                                        : '1px solid rgba(42,74,42,0.3)',
                                      boxShadow: selected
                                        ? `0 0 20px ${p.color}15`
                                        : 'none',
                                    }}
                                  >
                                    <div className="text-xl mb-2">
                                      {p.emoji}
                                    </div>
                                    <div
                                      className="font-semibold text-sm mb-1"
                                      style={{
                                        color: selected ? p.color : '#f5f0e8',
                                        fontFamily: "'DM Sans', sans-serif",
                                      }}
                                    >
                                      {p.label}
                                    </div>
                                    <div
                                      className="text-xs"
                                      style={{
                                        color: '#7a7060',
                                        fontFamily: "'DM Sans', sans-serif",
                                      }}
                                    >
                                      {p.desc}
                                    </div>
                                    {selected && (
                                      <div
                                        className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                                        style={{
                                          background: p.color,
                                          color: '#0d1a0d',
                                        }}
                                      >
                                        <CheckCircle className="w-3 h-3" />
                                      </div>
                                    )}
                                  </motion.button>
                                )
                              })}
                            </div>

                            <div className="mt-7">
                              <SectionHead
                                icon={<Sun className="w-4 h-4" />}
                                title="Delivery Capability"
                                color="#3b82f6"
                              />
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                                {DELIVERY_OPTIONS.map((opt) => {
                                  const selected =
                                    form.watch('deliveryCapability') ===
                                    opt.value
                                  return (
                                    <motion.button
                                      key={opt.value}
                                      type="button"
                                      whileTap={{ scale: 0.97 }}
                                      onClick={() =>
                                        form.setValue(
                                          'deliveryCapability',
                                          opt.value as FarmerFormData['deliveryCapability'],
                                        )
                                      }
                                      className="p-4 rounded-xl text-left transition-all duration-200"
                                      style={{
                                        background: selected
                                          ? 'rgba(59,130,246,0.1)'
                                          : 'rgba(26,46,26,0.3)',
                                        border: selected
                                          ? '2px solid rgba(59,130,246,0.5)'
                                          : '1px solid rgba(42,74,42,0.3)',
                                        boxShadow: selected
                                          ? '0 0 16px rgba(59,130,246,0.1)'
                                          : 'none',
                                      }}
                                    >
                                      <div className="text-lg mb-1">
                                        {opt.emoji}
                                      </div>
                                      <div
                                        className="font-semibold text-sm mb-0.5"
                                        style={{
                                          color: selected
                                            ? '#60a5fa'
                                            : '#f5f0e8',
                                          fontFamily: "'DM Sans', sans-serif",
                                        }}
                                      >
                                        {opt.label}
                                      </div>
                                      <div
                                        className="text-xs"
                                        style={{
                                          color: '#7a7060',
                                          fontFamily: "'DM Sans', sans-serif",
                                        }}
                                      >
                                        {opt.desc}
                                      </div>
                                    </motion.button>
                                  )
                                })}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* ── Step 4: Story / Bio ── */}
                        {step === 4 && (
                          <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3 }}
                          >
                            <SectionHead
                              icon={<FileText className="w-4 h-4" />}
                              title="Your Farm Story"
                              color="#d4a017"
                            />
                            <p
                              className="text-xs text-[#7a7060] mb-5 mt-2"
                              style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                              Tell buyers about your farm, your family, and what
                              makes your produce special. Personal stories build
                              buyer trust and lead to more orders.
                            </p>
                            <FormField
                              label="Short Introduction (10–500 characters)"
                              error={form.formState.errors.bio?.message}
                            >
                              <textarea
                                {...form.register('bio')}
                                rows={5}
                                placeholder="e.g. We've been farming this land for 3 generations in the foothills of the Western Ghats. Everything is hand-picked at peak ripeness…"
                                className={`${INPUT_CLASS} resize-none`}
                              />
                            </FormField>
                            <div className="flex items-center justify-between mt-1.5">
                              <div
                                className="text-xs"
                                style={{
                                  color:
                                    (form.watch('bio')?.length ?? 0) > 400
                                      ? '#d4a017'
                                      : '#4a5a4a',
                                  fontFamily: "'DM Sans', sans-serif",
                                }}
                              >
                                {(form.watch('bio')?.length ?? 0) > 10
                                  ? '✓ Looking good!'
                                  : 'At least 10 characters'}
                              </div>
                              <div
                                className="text-xs text-[#4a5a4a]"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              >
                                {form.watch('bio')?.length ?? 0} / 500
                              </div>
                            </div>

                            {/* Tips */}
                            <div
                              className="mt-5 p-4 rounded-xl"
                              style={{
                                background: 'rgba(212,160,23,0.06)',
                                border: '1px solid rgba(212,160,23,0.2)',
                              }}
                            >
                              <div
                                className="text-xs font-bold text-[#d4a017] mb-2"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              >
                                ✨ Tips for a great bio
                              </div>
                              {[
                                "Mention your farming heritage or how long you've farmed",
                                'Name specific crops and unique growing methods',
                                'Share your location and what makes it special',
                              ].map((tip) => (
                                <div
                                  key={tip}
                                  className="text-[11px] text-[#a08060] flex gap-2 mb-1"
                                  style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                  }}
                                >
                                  <span className="text-[#d4a017]">→</span>{' '}
                                  {tip}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {rootError && (
                        <div className="mt-5 px-4 py-3 rounded-xl bg-red-950/40 border border-red-800/40">
                          <p
                            className="text-red-400 text-sm"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {rootError}
                          </p>
                        </div>
                      )}

                      {/* Navigation buttons */}
                      <div className="flex gap-3 mt-7">
                        {step > 1 && (
                          <motion.button
                            type="button"
                            onClick={() => setStep((s) => s - 1)}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-[#2a4a2a] text-[#7a9a7a] text-sm font-medium hover:bg-[#1a2e1a]/40 transition-all"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            <ChevronLeft className="w-4 h-4" /> Back
                          </motion.button>
                        )}
                        <motion.button
                          type="button"
                          onClick={nextStep}
                          disabled={submitting}
                          whileTap={{ scale: 0.97 }}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all hover:shadow-xl disabled:opacity-50"
                          style={{
                            background:
                              'linear-gradient(135deg,#4ade80,#16a34a)',
                            color: '#0d1a0d',
                            fontFamily: "'DM Sans', sans-serif",
                            boxShadow: '0 4px 20px rgba(74,222,128,0.25)',
                          }}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />{' '}
                              Submitting…
                            </>
                          ) : step < 4 ? (
                            <>
                              Continue <ChevronRight className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              <Sprout className="w-4 h-4" /> Submit Application{' '}
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </motion.button>
                      </div>

                      <p
                        className="text-center text-[10px] text-[#3a4a3a] mt-4"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Sent to{' '}
                        <span className="text-[#4ade80]">{HELPDESK}</span> ·
                        Admin reviews within 24h
                      </p>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────
const INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl bg-[#1a2e1a]/60 border border-[#2a4a2a]/60 text-[#f5f0e8] placeholder-[#4a5a4a] text-sm focus:outline-none focus:border-[#4ade80]/50 focus:ring-1 focus:ring-[#4ade80]/20 transition-all'

const LABEL_CLASS =
  'block text-xs font-semibold text-[#a09880] uppercase tracking-wider mb-1.5'

function SectionHead({
  icon,
  title,
  color,
}: {
  icon: React.ReactNode
  title: string
  color: string
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center"
        style={{
          background: `${color}18`,
          border: `1px solid ${color}40`,
          color,
        }}
      >
        {icon}
      </div>
      <h3
        className="text-sm font-bold uppercase tracking-wider"
        style={{ color: '#f5f0e8', fontFamily: "'DM Sans', sans-serif" }}
      >
        {title}
      </h3>
    </div>
  )
}

function FormField({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        className={LABEL_CLASS}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p
          className="text-red-400 text-xs mt-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {error}
        </p>
      )}
    </div>
  )
}
