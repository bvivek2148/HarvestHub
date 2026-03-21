import { createFileRoute, redirect } from '@tanstack/react-router'
import { authMiddleware } from '@/server/functions/auth'
import { AdminDashboard } from '@/components/farm/AdminDashboard'

export const Route = createFileRoute('/_protected/admin')({
  loader: async () => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw redirect({ to: '/sign-in/$' })
    if (!currentUser.labels?.includes('admin')) {
      if (currentUser.labels?.includes('farmer'))
        throw redirect({ to: '/farmer' })
      throw redirect({ to: '/buyer' })
    }
    return { currentUser }
  },
  component: AdminPage,
})

function AdminPage() {
  return <AdminDashboard />
}
