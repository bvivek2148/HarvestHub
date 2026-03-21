import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Star, MapPin, ArrowRight } from 'lucide-react'

const FARMERS = [
  {
    id: '1',
    name: 'Meena Sharma',
    farm: 'Surya Valley Organic Farm',
    location: 'Anantapur, Andhra Pradesh',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    coverImage:
      'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=800&q=75',
    specialty: 'Heirloom Tomatoes & Desi Grains',
    practices: ['FSSAI Registered', 'Organic India', 'Drip Irrigation'],
    rating: 4.9,
    reviews: 312,
    products: 14,
    memberSince: '2021',
    badge: '🏆 Top Seller',
    badgeColor: '#d97706',
    bio: 'Three generations of farming. We grow 40 heirloom varieties using traditional seed-saving methods passed down from our ancestors.',
  },
  {
    id: '2',
    name: 'Arjun Reddy',
    farm: 'Hillside Mango Gardens',
    location: 'Chittoor, Andhra Pradesh',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    coverImage:
      'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=800&q=75',
    specialty: 'Alphonso & Banganapalli Mangoes',
    practices: ['Natural Farming', 'Panchagavya', 'Rain-fed'],
    rating: 5.0,
    reviews: 188,
    products: 9,
    memberSince: '2022',
    badge: '⭐ 5-Star Farmer',
    badgeColor: '#d97706',
    bio: 'I farm with nature. Every mango is picked at peak ripeness and shipped directly from our heritage orchards.',
  },
  {
    id: '3',
    name: 'Priya Verma',
    farm: 'Green Roots Hydroponics',
    location: 'Rangareddy, Telangana',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
    coverImage:
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=75',
    specialty: 'Year-Round Leafy Greens',
    practices: ['Hydroponic', 'Zero-Waste', 'Solar Powered'],
    rating: 4.7,
    reviews: 156,
    products: 21,
    memberSince: '2023',
    badge: '🌱 Eco Pioneer',
    badgeColor: '#16a34a',
    bio: 'Indoor vertical farm powered by solar. We deliver fresh greens 365 days a year with 90% less water than traditional farming.',
  },
  {
    id: '4',
    name: 'Rajesh Goud',
    farm: 'Meenambika Heritage Farm',
    location: 'Medak, Telangana',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    coverImage:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=75',
    specialty: 'Sweet Corn & Seasonal Vegetables',
    practices: ['ZBNF', 'Crop Rotation', 'Soil Health'],
    rating: 4.8,
    reviews: 401,
    products: 18,
    memberSince: '2020',
    badge: '🌽 Community Favorite',
    badgeColor: '#84cc16',
    bio: 'Fourth-generation farmer. Our 20-acre farm feeds the local community with honest produce at honest prices.',
  },
]

function FarmerCard({
  farmer,
  index,
}: {
  farmer: (typeof FARMERS)[0]
  index: number
}) {
  const [flipped, setFlipped] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="cursor-pointer"
      onClick={() => setFlipped(!flipped)}
      style={{ perspective: 1200 }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front face */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            background: 'var(--fd-surface)',
            border: '1px solid var(--fd-border-mid)',
            boxShadow: 'var(--fd-card-shadow)',
          }}
        >
          {/* Cover image */}
          <div className="relative h-28 sm:h-32 overflow-hidden">
            <img
              src={farmer.coverImage}
              alt={farmer.farm}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, var(--fd-surface) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)',
              }}
            />
          </div>

          {/* Avatar + badge */}
          <div className="px-3 sm:px-4 pb-3 sm:pb-4">
            <div className="flex items-end justify-between -mt-8 mb-3">
              <div className="relative">
                <img
                  src={farmer.avatar}
                  alt={farmer.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                  style={{
                    border: '2px solid var(--fd-surface)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  }}
                  loading="lazy"
                />
                <div
                  className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full"
                  style={{
                    background: '#16a34a',
                    border: '2px solid var(--fd-surface)',
                  }}
                />
              </div>
              <span
                className="text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full"
                style={{
                  background: `${farmer.badgeColor}18`,
                  color: farmer.badgeColor,
                  border: `1px solid ${farmer.badgeColor}35`,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {farmer.badge}
              </span>
            </div>

            <h3
              className="text-sm sm:text-base font-bold mb-0.5"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: 'var(--fd-text)',
              }}
            >
              {farmer.name}
            </h3>
            <p
              className="text-xs mb-1"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: 'var(--fd-text-muted)',
              }}
            >
              {farmer.farm}
            </p>
            <div
              className="flex items-center gap-1 text-xs mb-3"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: 'var(--fd-green)',
              }}
            >
              <MapPin className="w-3 h-3" />
              {farmer.location}
            </div>

            <p
              className="text-xs mb-3 line-clamp-2"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: 'var(--fd-text-3)',
              }}
            >
              {farmer.specialty}
            </p>

            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-1 pt-3 mb-3"
              style={{ borderTop: '1px solid var(--fd-border)' }}
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-0.5 mb-0.5">
                  <Star
                    className="w-3 h-3 fill-current"
                    style={{ color: '#d97706' }}
                  />
                  <span
                    className="text-xs sm:text-sm font-bold"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: 'var(--fd-text)',
                    }}
                  >
                    {farmer.rating}
                  </span>
                </div>
                <div
                  className="text-[9px] sm:text-[10px]"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: 'var(--fd-text-muted)',
                  }}
                >
                  {farmer.reviews} reviews
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-xs sm:text-sm font-bold mb-0.5"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: 'var(--fd-text)',
                  }}
                >
                  {farmer.products}
                </div>
                <div
                  className="text-[9px] sm:text-[10px]"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: 'var(--fd-text-muted)',
                  }}
                >
                  products
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-xs sm:text-sm font-bold mb-0.5"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: 'var(--fd-text)',
                  }}
                >
                  {farmer.memberSince}
                </div>
                <div
                  className="text-[9px] sm:text-[10px]"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: 'var(--fd-text-muted)',
                  }}
                >
                  joined
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span
                className="text-[10px] sm:text-xs"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: 'var(--fd-text-muted)',
                }}
              >
                Tap to learn more
              </span>
              <div
                className="flex items-center gap-1 text-[10px] sm:text-xs"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: 'var(--fd-gold)',
                }}
              >
                View Profile <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden p-4 sm:p-5 flex flex-col"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'var(--fd-surface)',
            border: `1px solid ${farmer.badgeColor}30`,
            boxShadow: 'var(--fd-card-shadow)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <img
              src={farmer.avatar}
              alt={farmer.name}
              className="w-10 h-10 rounded-full object-cover"
              style={{ border: '1px solid var(--fd-border)' }}
              loading="lazy"
            />
            <div>
              <div
                className="text-sm font-bold"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: 'var(--fd-text)',
                }}
              >
                {farmer.name}
              </div>
              <div
                className="text-[11px]"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: 'var(--fd-text-muted)',
                }}
              >
                {farmer.farm}
              </div>
            </div>
          </div>

          <p
            className="text-xs sm:text-sm mb-4 italic leading-relaxed flex-1"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: 'var(--fd-text-3)',
            }}
          >
            "{farmer.bio}"
          </p>

          <div className="space-y-1.5 mb-4">
            {farmer.practices?.map((p: string) => (
              <div
                key={p}
                className="flex items-center gap-2 text-xs"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: 'var(--fd-text-3)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#16a34a' }}
                />
                {p}
              </div>
            ))}
          </div>

          <button
            className="w-full py-2.5 rounded-xl text-xs font-semibold"
            style={{
              background: 'linear-gradient(135deg,#d97706,#f59e0b)',
              color: '#ffffff',
              fontFamily: "'DM Sans', sans-serif",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            Shop {farmer.name.split(' ')[0]}'s Products →
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function FarmerProfiles() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  return (
    <section
      id="farmers"
      ref={sectionRef}
      className="py-16 sm:py-24 relative overflow-hidden"
      style={{ background: 'var(--fd-bg-2)' }}
    >
      {/* Parallax bg texture */}
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY, opacity: 0.035 }}
      >
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=2000&q=40"
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, var(--fd-border-mid), transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              border: '1px solid var(--fd-border-mid)',
              background: 'var(--fd-gold-bg)',
              color: '#92400e',
            }}
          >
            🧑‍🌾 Meet Your Farmers
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-black mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.75rem, 5vw, 3rem)',
              color: 'var(--fd-text)',
            }}
          >
            Faces Behind Your Food
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-lg mx-auto text-sm sm:text-base"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: 'var(--fd-text-3)',
            }}
          >
            Every product has a story. Tap a card to read it. Real farmers, real
            practices, full traceability.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {FARMERS.map((farmer, i) => (
            <FarmerCard key={farmer.id} farmer={farmer} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10 sm:mt-12"
        >
          <button
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full text-sm font-medium transition-all duration-200"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              border: '1px solid var(--fd-border-mid)',
              color: 'var(--fd-gold)',
              background: 'var(--fd-gold-bg)',
            }}
          >
            Browse All 2,400+ Farmers <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
