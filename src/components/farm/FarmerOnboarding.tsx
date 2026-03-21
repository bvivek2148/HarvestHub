import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check, ChevronRight } from 'lucide-react'

const STEPS = [
  {
    id: 'profile',
    icon: '🧑‍🌾',
    title: 'Your Identity',
    subtitle: 'Tell buyers who you are',
    fields: [
      { icon: '📛', label: 'Your Name', placeholder: 'e.g. Meena Sharma' },
      {
        icon: '🌾',
        label: 'Farm Name',
        placeholder: 'e.g. Surya Valley Organic Farm',
      },
      { icon: '📍', label: 'Location', placeholder: 'e.g. Anantapur, Andhra Pradesh' },
    ],
  },
  {
    id: 'practices',
    icon: '🌿',
    title: 'Growing Practices',
    subtitle: 'What makes your produce special?',
    options: [
      { icon: '🌱', label: 'Certified Organic' },
      { icon: '💧', label: 'Drip Irrigation' },
      { icon: '🐝', label: 'Bee Friendly' },
      { icon: '♻️', label: 'Regenerative' },
      { icon: '🚫', label: 'No-Spray' },
      { icon: '☀️', label: 'Solar Powered' },
      { icon: '🌙', label: 'Biodynamic' },
      { icon: '🔬', label: 'FSSAI Registered' },
    ],
  },
  {
    id: 'produce',
    icon: '🍅',
    title: 'What Do You Grow?',
    subtitle: 'Select all that apply',
    options: [
      { icon: '🍅', label: 'Tomatoes' },
      { icon: '🥦', label: 'Brassicas' },
      { icon: '🍓', label: 'Berries' },
      { icon: '🥕', label: 'Root Veg' },
      { icon: '🌽', label: 'Corn/Grains' },
      { icon: '🍋', label: 'Citrus' },
      { icon: '🥬', label: 'Leafy Greens' },
      { icon: '🥚', label: 'Eggs/Dairy' },
    ],
  },
  {
    id: 'done',
    icon: '✅',
    title: "You're Ready!",
    subtitle: 'Start listing your harvest',
  },
]

export function FarmerOnboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedPractices, setSelectedPractices] = useState<string[]>([])
  const [selectedProduce, setSelectedProduce] = useState<string[]>([])
  const [formValues, setFormValues] = useState<Record<string, string>>({})

  const toggleOption = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    state: string[],
  ) => {
    setter(
      state.includes(value)
        ? state.filter((v) => v !== value)
        : [...state, value],
    )
  }

  const step = STEPS[currentStep]

  return (
    <section
      className="py-16 sm:py-24 relative overflow-hidden"
      style={{ background: 'var(--fd-section-bg)' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, var(--fd-gold), transparent)',
          opacity: 0.3,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left: description */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-4"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                border: '1px solid var(--fd-border-mid)',
                background: 'var(--fd-green-bg)',
                color: '#14532d',
              }}
            >
              🌾 For Farmers
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-black mb-6 leading-tight"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                color: 'var(--fd-text)',
              }}
            >
              List Your First
              <br />
              <span className="italic" style={{ color: 'var(--fd-gold)' }}>
                Harvest
              </span>{' '}
              in Minutes
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-8 leading-relaxed text-sm sm:text-base"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: 'var(--fd-text-3)',
              }}
            >
              Our icon-guided onboarding is designed for farmers who may be new
              to smartphones. No confusing forms — just tap the icons that
              describe your farm, snap a photo, and you're selling.
            </motion.p>
            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              {[
                'Profile setup in under 3 minutes',
                'Icon-guided produce listings',
                'Offline-ready for low-bandwidth areas',
                'AI assistant helps with pricing',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: 'rgba(22,163,74,0.12)',
                      border: '1px solid rgba(22,163,74,0.35)',
                    }}
                  >
                    <Check className="w-3 h-3" style={{ color: '#16a34a' }} />
                  </div>
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: 'var(--fd-text-3)',
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Right: interactive onboarding demo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {STEPS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentStep(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === currentStep ? 32 : 8,
                    height: 8,
                    background:
                      i === currentStep
                        ? '#d97706'
                        : i < currentStep
                          ? '#16a34a'
                          : 'var(--fd-border-mid)',
                  }}
                />
              ))}
            </div>

            {/* Step card */}
            <div
              className="rounded-2xl overflow-hidden shadow-xl"
              style={{
                background: 'var(--fd-surface)',
                border: '1px solid var(--fd-border-mid)',
                boxShadow: 'var(--fd-card-shadow)',
              }}
            >
              {/* Card header */}
              <div
                className="p-4 sm:p-5 flex items-center gap-3"
                style={{
                  background: 'var(--fd-section-bg)',
                  borderBottom: '1px solid var(--fd-border)',
                }}
              >
                <div className="text-2xl sm:text-3xl">{step.icon}</div>
                <div>
                  <h3
                    className="text-sm sm:text-base font-bold"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: 'var(--fd-text)',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-xs"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: 'var(--fd-text-muted)',
                    }}
                  >
                    {step.subtitle}
                  </p>
                </div>
                <div
                  className="ml-auto text-xs"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: 'var(--fd-text-muted)',
                  }}
                >
                  {currentStep + 1}/{STEPS.length}
                </div>
              </div>

              {/* Card body */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 sm:p-5"
                >
                  {/* Text fields */}
                  {step.fields && (
                    <div className="space-y-3">
                      {step.fields.map((field) => (
                        <div key={field.label}>
                          <label
                            className="flex items-center gap-2 text-xs mb-1.5"
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              color: 'var(--fd-text-muted)',
                            }}
                          >
                            <span>{field.icon}</span> {field.label}
                          </label>
                          <input
                            type="text"
                            placeholder={field.placeholder}
                            value={formValues[field.label] || ''}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                [field.label]: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none transition-colors"
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              background: 'var(--fd-bg)',
                              border: '1px solid var(--fd-border-mid)',
                              color: 'var(--fd-text)',
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Option grid — 2 cols on mobile, 4 on sm+ */}
                  {step.options && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {step.options.map((opt) => {
                        const selected =
                          step.id === 'practices'
                            ? selectedPractices.includes(opt.label)
                            : selectedProduce.includes(opt.label)

                        return (
                          <button
                            key={opt.label}
                            onClick={() =>
                              step.id === 'practices'
                                ? toggleOption(
                                    opt.label,
                                    setSelectedPractices,
                                    selectedPractices,
                                  )
                                : toggleOption(
                                    opt.label,
                                    setSelectedProduce,
                                    selectedProduce,
                                  )
                            }
                            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-200"
                            style={{
                              background: selected
                                ? 'rgba(217,119,6,0.08)'
                                : 'var(--fd-bg)',
                              borderColor: selected
                                ? 'rgba(217,119,6,0.5)'
                                : 'var(--fd-border)',
                              transform: selected ? 'scale(1.05)' : 'scale(1)',
                            }}
                          >
                            <span className="text-xl">{opt.icon}</span>
                            <span
                              className="text-[9px] text-center leading-tight"
                              style={{
                                fontFamily: "'DM Sans', sans-serif",
                                color: selected
                                  ? '#d97706'
                                  : 'var(--fd-text-muted)',
                              }}
                            >
                              {opt.label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Done state */}
                  {step.id === 'done' && (
                    <div className="text-center py-4">
                      <div className="text-5xl mb-4">🎉</div>
                      <p
                        className="text-sm mb-4"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          color: 'var(--fd-text-3)',
                        }}
                      >
                        Your profile is ready! Now list your first product and
                        start receiving orders from local buyers.
                      </p>
                      <button
                        className="w-full py-2.5 rounded-xl text-xs font-semibold"
                        style={{
                          background: 'linear-gradient(135deg,#d97706,#f59e0b)',
                          color: '#ffffff',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        📸 List My First Crop
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Footer */}
              {currentStep < STEPS.length - 1 && (
                <div
                  className="px-4 sm:px-5 pb-4 sm:pb-5"
                  style={{ borderTop: '1px solid var(--fd-border)' }}
                >
                  <div className="pt-4">
                    <button
                      onClick={() =>
                        setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1))
                      }
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        background: 'linear-gradient(135deg,#d97706,#f59e0b)',
                        color: '#ffffff',
                        fontFamily: "'DM Sans', sans-serif",
                        boxShadow: '0 4px 14px rgba(217,119,6,0.25)',
                      }}
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
