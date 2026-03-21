import { createFileRoute, redirect } from '@tanstack/react-router'
import { authMiddleware } from '@/server/functions/auth'
import { BuyerDashboard } from '@/components/farm/BuyerDashboard'

export const Route = createFileRoute('/_protected/buyer')({
  loader: async () => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw redirect({ to: '/sign-in/$' })
    if (currentUser.labels?.includes('admin')) throw redirect({ to: '/admin' })
    if (currentUser.labels?.includes('farmer'))
      throw redirect({ to: '/farmer' })
    return { currentUser }
  },
  component: BuyerPage,
})

function BuyerPage() {
  return <BuyerDashboard />
}
