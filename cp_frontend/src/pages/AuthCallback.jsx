import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function AuthCallback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    const onboarding = params.get('onboarding')

    if (!token) {
      navigate('/login?error=auth_failed', { replace: true })
      return
    }

    localStorage.setItem('token', token)
    navigate(onboarding ? '/onboarding' : '/dashboard', { replace: true })
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="animate-spin h-6 w-6 border-2 border-brand-500 border-t-transparent rounded-full" />
    </div>
  )
}
