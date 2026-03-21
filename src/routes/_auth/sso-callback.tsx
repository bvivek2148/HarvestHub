import { createFileRoute } from '@tanstack/react-router'
import { AuthenticateWithRedirectCallback } from '@clerk/tanstack-react-start'

export const Route = createFileRoute('/_auth/sso-callback')({
  component: SSOCallbackPage,
})

function SSOCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080f08]">
      <AuthenticateWithRedirectCallback />
    </div>
  )
}
