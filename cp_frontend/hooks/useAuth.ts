"use client"

import { useState, useEffect, useCallback } from 'react'
import { api, User, setToken, clearToken } from '@/lib/api'

type AuthState = {
  user: User | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, loading: true, error: null })

  const fetchUser = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('cp_token') : null
    if (!token) {
      setState({ user: null, loading: false, error: null })
      return
    }
    try {
      const user = await api.auth.getMe()
      setState({ user, loading: false, error: null })
    } catch {
      clearToken()
      setState({ user: null, loading: false, error: null })
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = () => {
    window.location.href = "/api/auth/login"
  }

  const logout = async () => {
    try {
      await api.auth.logout()
    } catch {
      // ignore
    }
    clearToken()
    setState({ user: null, loading: false, error: null })
    window.location.href = '/'
  }

  const saveToken = (token: string) => {
    setToken(token)
    fetchUser()
  }

  return { ...state, login, logout, saveToken }
}
