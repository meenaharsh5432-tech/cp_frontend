import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import api from '../lib/api'

export function useAuth() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get('/api/auth/me')
      return res.data
    },
    retry: false,
    staleTime: 1000 * 60 * 5
  })

  useEffect(() => {
    const handler = () => {
      queryClient.setQueryData(['me'], null)
      navigate('/login')
    }
    window.addEventListener('auth:unauthorized', handler)
    return () => window.removeEventListener('auth:unauthorized', handler)
  }, [navigate, queryClient])

  async function logout() {
    await api.post('/api/auth/logout')
    localStorage.removeItem('token')
    queryClient.clear()
    navigate('/')
  }

  return { user, isLoading, isAuthenticated: !!user, logout }
}
