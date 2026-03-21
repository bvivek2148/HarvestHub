import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useClerk } from '@clerk/tanstack-react-start'
import { useEffect } from 'react'

export const Route = createFileRoute('/_auth/sign-out')({
  component: SignOutPage,
})

function SignOutPage() {
  const { signOut } = useClerk()
  const navigate = useNavigate()

  useEffect(() => {
    signOut().then(() => {
      navigate({ to: '/' })
    })
  }, [signOut, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080f08]">
      <div className="text-white">Signing out...</div>
    </div>
  )
}
