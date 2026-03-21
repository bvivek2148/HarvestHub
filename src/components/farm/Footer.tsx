import { motion } from 'motion/react'
import {
  Sprout,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
} from 'lucide-react'

const FOOTER_LINKS = {
  Marketplace: [
    'Browse Produce',
    'Find Farmers',
    'Seasonal Guide',
    'Organic Filter',
    'Bulk Orders',
  ],
  Farmers: [
    'Start Selling',
    'Pricing Guide',
    'Certifications',
    'Farmer Stories',
    'Cooperative Program',
  ],
  Company: ['About Us', 'Sustainability', 'Press Kit', 'Careers', 'Blog'],
  Support: [
    'Help Center',
    'Contact Us',
    'Dispute Process',
    'Privacy Policy',
    'Terms of Service',
  ],
}

const CONTACT = [
  { Icon: Mail, label: 'Email', value: 'hello@harvesthub.in' },
  { Icon: Phone, label: 'Farmer Support', value: '+91 800-HARVEST-IN' },
  { Icon: MapPin, label: 'HQ', value: 'Hyderabad, Telangana · Nationwide' },
]

const BADGES = [
  { icon: '🔒', label: 'SSL Secured' },
  { icon: '🛡️', label: 'Escrow Protected' },
  { icon: '✅', label: 'Verified Farmers' },
  { icon: '📱', label: 'PWA Certified' },
  { icon: '🌱', label: 'FSSAI Registered' },
]

export function Footer() {
  return (
    <footer
      className="pt-12 sm:pt-16 pb-6 sm:pb-8 relative overflow-hidden"
      style={{
        background: '#14532d',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(217,119,6,0.5), transparent)',
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse, rgba(217,119,6,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 pb-10 sm:pb-12"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
        >
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative w-8 h-8 shrink-0">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg,#d97706,#f59e0b)',
                  }}
                />
                <Sprout className="absolute inset-0 m-auto w-4 h-4 text-white" />
              </div>
              <span
                className="text-base sm:text-lg font-bold text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Harvest<span style={{ color: '#f59e0b' }}>Hub</span>
              </span>
            </div>
            <p
              className="text-xs mb-5 leading-relaxed max-w-xs"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              Connecting farmers with communities. Every purchase supports local
              agriculture and builds food sovereignty.
            </p>
            <div className="flex gap-2 sm:gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.15, y: -2 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4
                className="text-xs font-bold uppercase tracking-widest mb-3 sm:mb-4"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: '#f59e0b',
                }}
              >
                {heading}
              </h4>
              <ul className="space-y-1.5 sm:space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs transition-colors duration-200 hover:text-white"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: 'rgba(255,255,255,0.45)',
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div
          className="py-6 sm:py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
        >
          {CONTACT.map(({ Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <div
                  className="text-[10px] uppercase tracking-wider mb-0.5"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: 'rgba(255,255,255,0.35)',
                  }}
                >
                  {label}
                </div>
                <div
                  className="text-xs"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: 'rgba(255,255,255,0.65)',
                  }}
                >
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div
          className="py-5 sm:py-6 flex flex-wrap gap-2 sm:gap-4 items-center justify-center"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
        >
          {BADGES.map((badge) => (
            <span
              key={badge.label}
              className="text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: 'rgba(255,255,255,0.45)',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
              }}
            >
              {badge.icon} {badge.label}
            </span>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-center">
          <p
            className="text-[10px]"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: 'rgba(255,255,255,0.3)',
            }}
          >
            © {new Date().getFullYear()} HarvestHub Marketplace Inc. All rights
            reserved.
          </p>
          <p
            className="text-[10px]"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: 'rgba(255,255,255,0.3)',
            }}
          >
            Built with 🌾 for farmers everywhere · 5% flat commission · Zero
            hidden fees
          </p>
        </div>
      </div>
    </footer>
  )
}
