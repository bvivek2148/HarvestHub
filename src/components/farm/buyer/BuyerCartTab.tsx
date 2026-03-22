import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, Loader2, CheckCircle, ShieldCheck, MapPin } from 'lucide-react'
import { C } from './BuyerTypes'
import { useCart } from '@/context/CartContext'
import { toast } from 'sonner'
import { createOrderFn } from '@/server/functions/orders'
import { useMutation, useQueryClient } from '@tanstack/react-query'

function CheckoutModal({ 
  items, 
  total, 
  onClose, 
  onSuccess 
}: { 
  items: any[], 
  total: number, 
  onClose: () => void, 
  onSuccess: () => void 
}) {
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details')
  const queryClient = useQueryClient()
  const createOrderMutation = useMutation({
    mutationFn: (data: any) => createOrderFn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyerOrders'] })
      queryClient.invalidateQueries({ queryKey: ['farmerOrders'] })
    }
  })

  const handleProcessOrder = async () => {
    setStep('processing')
    
    try {
      // Simulate real payment delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create orders for each item
      for (const item of items) {
        await createOrderMutation.mutateAsync({
          farmerId: item.farmerId,
          listingId: item.id,
          qty: item.quantity,
          total: item.price * item.quantity
        })
      }

      setStep('success')
      // Auto close after 3 seconds
      setTimeout(() => {
        onSuccess()
      }, 3000)
    } catch (error) {
      toast.error('Payment failed. Please try again.')
      setStep('details')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: C.surface, border: `1px solid ${C.border}` }}
      >
        <AnimatePresence mode="wait">
          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-8"
            >
              <h3 className="text-xl font-bold mb-6" style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}>Delivery Details</h3>
              <div className="space-y-4 mb-8">
                <div
                  className="p-4 rounded-2xl"
                  style={{ background: C.surface2, border: `1px solid ${C.border}` }}
                >
                  <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: C.muted }}>Shipping Address</label>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4" style={{ color: C.green }} />
                    <span className="text-sm font-medium" style={{ color: C.text }}>Hyderabad, Telangana, India</span>
                  </div>
                </div>
                <div
                  className="p-4 rounded-2xl"
                  style={{ background: C.surface2, border: `1px solid ${C.border}` }}
                >
                  <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: C.muted }}>Order Items</label>
                  <div className="text-sm font-medium" style={{ color: C.text }}>{items.length} unique produce from local farms</div>
                </div>
              </div>
              <button
                onClick={() => setStep('payment')}
                className="w-full py-4 rounded-2xl font-black text-sm transition-all hover:scale-[1.02]"
                style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`, color: '#051005' }}
              >
                Continue to Payment
              </button>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8"
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}>Secure Payment</h3>
              <p className="text-xs mb-6" style={{ color: C.muted }}>Trust-based escrow for local farming</p>
              
              <div className="p-8 rounded-[2rem] mb-8 flex flex-col items-center justify-center text-center gap-6 relative overflow-hidden" style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${C.green}, transparent 85%), color-mix(in srgb, ${C.green}, transparent 95%))`, border: `1px solid color-mix(in srgb, ${C.green}, transparent 60%)` }}>
                <div 
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-16 -mt-16"
                  style={{ background: `color-mix(in srgb, ${C.green}, transparent 90%)` }}
                />
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl border" style={{ background: C.surface2, borderColor: C.border }}>
                  <ShieldCheck className="w-10 h-10" style={{ color: C.green }} />
                </div>
                <div>
                  <div className="text-xl font-black mb-1" style={{ color: C.text }}>Harvest Escrow Active</div>
                  <div className="text-sm opacity-60" style={{ color: C.text }}>Funds released only after confirmed delivery</div>
                </div>
                <div
                  className="px-5 py-2 rounded-full border text-xs font-bold"
                  style={{ background: C.surface2, borderColor: `color-mix(in srgb, ${C.green}, transparent 70%)`, color: C.green }}
                >
                   Guaranteed Security
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center px-2">
                  <span className="text-sm" style={{ color: C.muted }}>Subtotal</span>
                  <span className="text-sm font-bold" style={{ color: C.text }}>₹{total}</span>
                </div>
                <div className="flex justify-between items-center px-2">
                   <span className="text-sm" style={{ color: C.muted }}>Security Fee</span>
                   <span className="text-sm font-bold" style={{ color: C.green }}>FREE</span>
                </div>
                <div className="h-px mx-2" style={{ background: C.border }} />
                <div className="flex justify-between items-center px-2">
                  <span className="text-base font-bold" style={{ color: C.text }}>Total Amount</span>
                  <span className="text-2xl font-black" style={{ color: C.green }}>₹{total}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep('details')}
                  className="flex-1 py-4 rounded-2xl border text-xs font-bold transition-colors"
                  style={{ color: C.muted, borderColor: C.border, background: C.surface2 }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = C.hover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = C.surface2)}
                >
                  Back
                </button>
                <button
                  onClick={handleProcessOrder}
                  className="flex-[2] py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`, color: '#051005', boxShadow: `0 10px 15px -3px color-mix(in srgb, ${C.green}, transparent 80%)` }}
                >
                  Confirm & Pay <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 flex flex-col items-center justify-center text-center py-20"
            >
               <Loader2 className="w-12 h-12 animate-spin mb-6" style={{ color: C.green }} />
              <h4 className="text-lg font-bold mb-2" style={{ color: C.text }}>Processing Payment...</h4>
              <p className="text-xs" style={{ color: C.muted }}>Securing your fresh produce with the farmer.</p>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 flex flex-col items-center justify-center text-center"
            >
              <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mb-8 relative">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, delay: 0.2 }}
                >
                  <CheckCircle className="w-16 h-16" style={{ color: C.green }} />
                </motion.div>
                <motion.div 
                  className="absolute inset-0 rounded-full border-4"
                  style={{ borderColor: `color-mix(in srgb, ${C.green}, transparent 80%)` }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.4, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
              <h4 className="text-3xl font-black mb-3" style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}>Order Placed!</h4>
              <p className="text-sm mb-8 max-w-[280px] mx-auto" style={{ color: C.muted }}>Your fresh produce is being secured by the farmers.</p>
                            <div
                 className="w-full rounded-2xl p-4 mb-8"
                 style={{ background: C.surface2, border: `1px solid ${C.border}` }}
               >
                 <div className="flex justify-between text-xs mb-2">
                    <span style={{ color: C.muted }}>Total Paid</span>
                    <span className="font-bold" style={{ color: C.green }}>₹{total}</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span style={{ color: C.muted }}>Items</span>
                    <span className="font-bold" style={{ color: C.text }}>{items.length} Products</span>
                 </div>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={onSuccess}
                  className="flex-1 py-4 rounded-xl text-xs font-bold transition-all"
                  style={{ color: C.text, background: C.surface2, border: `1px solid ${C.border}` }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = C.hover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = C.surface2)}
                >
                  Continue Browsing
                </button>
                <button
                  onClick={() => {
                    onSuccess()
                    // This is a hack to switch tab if possible, but onSuccess usually handles cleanup
                  }}
                  className="flex-[1.5] py-4 rounded-xl font-black text-sm shadow-xl"
                  style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`, color: '#051005', boxShadow: `0 10px 15px -3px color-mix(in srgb, ${C.green}, transparent 80%)` }}
                >
                  Track Orders
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export function BuyerCartTab() {
  const [showCheckout, setShowCheckout] = useState(false)
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice, itemCount } = useCart()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6 border"
          style={{ background: C.surface2, borderColor: C.border }}
        >
          <ShoppingCart className="w-10 h-10" style={{ color: C.muted, opacity: 0.3 }} />
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: C.text, fontFamily: "'Syne', sans-serif" }}>
          Your cart is empty
        </h3>
        <p className="text-sm max-w-xs mx-auto mb-8" style={{ color: C.muted }}>
          Looks like you haven't added any fresh produce to your cart yet.
        </p>
      </div>
    )
  }

  const handleCheckout = () => {
    setShowCheckout(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2
          className="font-bold flex items-center gap-3"
          style={{
            color: C.text,
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
          }}
        >
          My Cart
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: C.surface2, border: `1px solid ${C.border}`, color: C.muted }}
          >
            {itemCount} items
          </span>
        </h2>
        <button
          onClick={clearCart}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: C.red }}
          onMouseEnter={(e) => (e.currentTarget.style.background = `color-mix(in srgb, ${C.red}, transparent 90%)`)}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4 rounded-2xl flex items-center gap-4 group"
                style={{ background: C.surface, border: `1px solid ${C.border}` }}
              >
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0 overflow-hidden"
                  style={{ background: C.surface2 }}
                >
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    item.emoji || '📦'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold truncate" style={{ color: C.text }}>{item.name}</h4>
                  <p className="text-[10px]" style={{ color: C.muted }}>From {item.farmerName}</p>
                  <div className="text-xs font-bold mt-1" style={{ color: C.gold }}>
                    ₹{item.price} <span className="text-[10px] font-normal opacity-60">/ {item.unit}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div 
                    className="flex items-center gap-1 p-1 rounded-lg"
                    style={{ background: C.surface2, border: `1px solid ${C.border}` }}
                  >
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 rounded-md transition-colors"
                      style={{ color: C.muted }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = C.hover)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold" style={{ color: C.text }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 rounded-md transition-colors"
                      style={{ color: C.muted }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = C.hover)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: C.red }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = `color-mix(in srgb, ${C.red}, transparent 90%)`)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary Card */}
        <div className="space-y-4">
          <div
            className="p-6 rounded-3xl sticky top-6"
            style={{ 
              background: `linear-gradient(135deg, color-mix(in srgb, ${C.green}, transparent 92%), color-mix(in srgb, ${C.green}, transparent 97%))`,
              border: `1px solid color-mix(in srgb, ${C.green}, transparent 60%)`
            }}
          >
            <h3 className="text-sm font-black uppercase tracking-widest mb-6" style={{ color: C.green }}>
              Order Summary
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-xs" style={{ color: C.muted }}>
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-bold" style={{ color: C.text }}>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-xs" style={{ color: C.muted }}>
                <span>Delivery Fee</span>
                <span className="font-bold" style={{ color: C.text }}>₹0</span>
              </div>
              <div className="h-px" style={{ background: C.border }} />
              <div className="flex justify-between text-base font-bold" style={{ color: C.text }}>
                <span>Total</span>
                <span style={{ color: C.gold }}>₹{totalPrice}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm transition-all hover:scale-[1.02] shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`,
                color: '#051005',
                boxShadow: `0 10px 15px -3px color-mix(in srgb, ${C.green}, transparent 90%)`
              }}
            >
              Checkout <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center mt-4 opacity-40 italic">
              * Payment processed via secure escrow encryption.
            </p>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showCheckout && (
          <CheckoutModal 
            items={items} 
            total={totalPrice} 
            onClose={() => setShowCheckout(false)}
            onSuccess={() => {
              clearCart()
              setShowCheckout(false)
              toast.success('Orders placed successfully!')
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
