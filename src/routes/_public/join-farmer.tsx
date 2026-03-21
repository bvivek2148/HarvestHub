import { createFileRoute } from '@tanstack/react-router'
import { JoinFarmerForm } from '@/components/farm/JoinFarmerForm'

export const Route = createFileRoute('/_public/join-farmer')({
  component: JoinFarmerPage,
})

function JoinFarmerPage() {
  return <JoinFarmerForm />
}
