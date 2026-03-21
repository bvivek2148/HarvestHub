import { createFileRoute, redirect } from '@tanstack/react-router'
import { authMiddleware } from '@/server/functions/auth'
import { FarmerDashboard } from '@/components/farm/FarmerDashboard'

export const Route = createFileRoute('/_protected/farmer')({
  loader: async () => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw redirect({ to: '/sign-in/$' })
    if (!currentUser.labels?.includes('farmer')) {
      // Redirect to appropriate dashboard
      if (currentUser.labels?.includes('admin'))
        throw redirect({ to: '/admin' })
      throw redirect({ to: '/buyer' })
    }
    return { currentUser }
  },
  component: FarmerPage,
})

function FarmerPage() {
  return <FarmerDashboard />
}
