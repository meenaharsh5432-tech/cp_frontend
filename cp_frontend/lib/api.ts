const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('cp_token')
}

export function setToken(token: string) {
  localStorage.setItem('cp_token', token)
}

export function clearToken() {
  localStorage.removeItem('cp_token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> || {}),
    },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    throw new Error(error.error || `HTTP ${res.status}`)
  }

  return res.json()
}

export type User = {
  id: string
  email: string
  name: string
  tier: string
  voiceProfile: string
  quotaUsed: number
  quotaResetAt: string
  onboardingDone: boolean
  createdAt: string
}

export type Job = {
  id: string
  status: 'processing' | 'completed' | 'failed'
  inputType: string
  inputUrl: string | null
  inputText: string | null
  shortHook: string | null
  twitterThread: string | null
  linkedinPost: string | null
  newsletter: string | null
  voiceProfile: string
  errorMessage: string | null
  createdAt: string
}

export type JobListItem = {
  id: string
  status: string
  inputType: string
  inputUrl: string | null
  shortHook: string | null
  voiceProfile: string
  createdAt: string
}

export const api = {
  googleLoginUrl: `${API_URL}/api/auth/google`,

  auth: {
    getMe: () => request<User>('/api/auth/me'),
    logout: () => request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }),
    completeOnboarding: () =>
      request<{ onboardingDone: boolean }>('/api/auth/onboarding-complete', { method: 'PATCH' }),
  },

  jobs: {
    create: (data: { inputType: string; input: string }) =>
      request<Job>('/api/jobs', { method: 'POST', body: JSON.stringify(data) }),
    list: () => request<JobListItem[]>('/api/jobs'),
    get: (id: string) => request<Job>(`/api/jobs/${id}`),
    delete: (id: string) => request<{ ok: boolean }>(`/api/jobs/${id}`, { method: 'DELETE' }),
  },
}
