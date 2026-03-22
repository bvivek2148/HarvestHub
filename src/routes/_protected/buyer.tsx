import { createFileRoute, redirect } from '@tanstack/react-router'
import { authMiddleware } from '@/server/functions/auth'
import { BuyerDashboard } from '@/components/farm/BuyerDashboard'
import { z } from 'zod'

const buyerSearchSchema = z.object({
  tab: z.string().optional(),
  threadId: z.string().optional(),
})

export const Route = createFileRoute('/_protected/buyer')({
  validateSearch: (search: Record<string, unknown>) => buyerSearchSchema.parse(search),
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
