import { useState } from 'react'
import { 
  User, 
  MapPin, 
  Leaf, 
  Award,
  Loader2,
  Save,
  Info
} from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { updateUserProfileFn } from '@/server/functions/users'
import { toast } from 'sonner'
import { C } from './FarmerTypes'

const INPUT_STYLE = {
  background: C.surface2,
  border: `1px solid ${C.border}`,
  color: C.text,
}

const LABEL_STYLE = { color: C.muted }

interface FarmerProfile {
  name: string
  farmName: string
  bio: string
  location: string
  phone: string
  experience: string
  farmSize: string
  specialties: string
  methods: string
  certifications?: string
}

export function FarmerSettingsTab({ profile }: { profile: any }) {
  const queryClient = useQueryClient()
  const updateUserProfile = useServerFn(updateUserProfileFn)

  const [formData, setFormData] = useState<FarmerProfile>({
    name: profile?.name || '',
    farmName: profile?.farmName || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    phone: profile?.phone || '',
    experience: profile?.experience || '',
    farmSize: profile?.farmSize || '',
    specialties: profile?.specialties || '',
    methods: profile?.methods || '',
    certifications: profile?.certifications || '',
  })

  const saveMutation = useMutation({
    mutationFn: (data: any) => (updateUserProfile as any)({ data }),
    onSuccess: () => {
      toast.success('Farm profile updated!')
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update profile')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveMutation.mutate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a1a0a] p-6 rounded-3xl border border-[#1a3a1a]">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}>
            Farm Showcase Details
          </h2>
          <p className="text-sm mt-1" style={{ color: C.muted }}>
            Complete your profile to build trust with potential buyers.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a2f1a] text-[#4ade80] text-xs font-bold border border-[#2a4f2a]">
           <Award className="w-3.5 h-3.5" /> Verified Farmer Status
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 1: Identity */}
          <div className="space-y-4 p-6 rounded-2xl bg-[#081208] border border-white/[0.04]">
             <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-[#4ade80]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#688568]">Business Identity</span>
             </div>
             
             <div>
                <label className="block text-xs font-semibold mb-1.5" style={LABEL_STYLE}>Full Name</label>
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4ade80] transition-all"
                  style={INPUT_STYLE}
                />
             </div>

             <div>
                <label className="block text-xs font-semibold mb-1.5" style={LABEL_STYLE}>Farm Name</label>
                <input 
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleChange}
                  placeholder="e.g. Green Valley Organics"
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4ade80] transition-all"
                  style={INPUT_STYLE}
                />
             </div>
          </div>

          {/* Section 2: Contact/Location */}
          <div className="space-y-4 p-6 rounded-2xl bg-[#081208] border border-white/[0.04]">
             <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-[#4ade80]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#688568]">Reach & Presence</span>
             </div>

             <div>
                <label className="block text-xs font-semibold mb-1.5" style={LABEL_STYLE}>Location / Village</label>
                <input 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Ranga Reddy, Telangana"
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4ade80] transition-all"
                  style={INPUT_STYLE}
                />
             </div>

             <div>
                <label className="block text-xs font-semibold mb-1.5" style={LABEL_STYLE}>Contact Phone</label>
                <input 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4ade80] transition-all"
                  style={INPUT_STYLE}
                />
             </div>
          </div>

          {/* Section 3: Farm Specifics */}
          <div className="space-y-4 p-6 rounded-2xl bg-[#081208] border border-white/[0.04]">
             <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4 text-[#4ade80]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#688568]">Farm Stats</span>
             </div>

             <div>
                <label className="block text-xs font-semibold mb-1.5" style={LABEL_STYLE}>Experience (Years)</label>
                <input 
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 15+ Years"
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4ade80] transition-all"
                  style={INPUT_STYLE}
                />
             </div>

             <div>
                <label className="block text-xs font-semibold mb-1.5" style={LABEL_STYLE}>Farm Size</label>
                <input 
                  name="farmSize"
                  value={formData.farmSize}
                  onChange={handleChange}
                  placeholder="e.g. 5 Acres"
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4ade80] transition-all"
                  style={INPUT_STYLE}
                />
             </div>
          </div>

          {/* Section 4: Expertise */}
          <div className="space-y-4 p-6 rounded-2xl bg-[#081208] border border-white/[0.04]">
             <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-[#4ade80]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#688568]">Expertise & Quality</span>
             </div>

             <div>
                <label className="block text-xs font-semibold mb-1.5" style={LABEL_STYLE}>Specialties</label>
                <input 
                  name="specialties"
                  value={formData.specialties}
                  onChange={handleChange}
                  placeholder="e.g. Ancient Grains, Exotic Fruits"
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4ade80] transition-all"
                  style={INPUT_STYLE}
                />
             </div>

             <div>
                <label className="block text-xs font-semibold mb-1.5" style={LABEL_STYLE}>Certifications</label>
                <input 
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  placeholder="e.g. FSSAI, Organic India"
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4ade80] transition-all"
                  style={INPUT_STYLE}
                />
             </div>
          </div>
        </div>

        {/* Section 5: Story & Bio */}
        <div className="p-6 rounded-2xl bg-[#081208] border border-white/[0.04] space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-[#4ade80]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#688568]">Farm Story & Methods</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={LABEL_STYLE}>Farming Methods</label>
                <textarea 
                  name="methods"
                  value={formData.methods}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. We use ZBNF (Zero Budget Natural Farming) and Drip Irrigation..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4ade80] transition-all resize-none"
                  style={INPUT_STYLE}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={LABEL_STYLE}>Public Bio</label>
                <textarea 
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  placeholder="A short welcome for your buyers..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#4ade80] transition-all resize-none"
                  style={INPUT_STYLE}
                />
              </div>
            </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #4ade80, #16a34a)',
              color: '#051005',
              boxShadow: '0 8px 16px -4px rgba(74,222,128,0.3)',
            }}
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save All Details
          </button>
        </div>
      </form>
    </div>
  )
}
