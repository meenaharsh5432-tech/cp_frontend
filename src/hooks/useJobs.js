import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await api.get('/api/jobs')
      return res.data
    }
  })
}

export function useJob(id) {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: async () => {
      const res = await api.get(`/api/jobs/${id}`)
      return res.data
    },
    enabled: !!id
  })
}

export function useCreateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ inputType, input }) => {
      const res = await api.post('/api/jobs', { inputType, input })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['me'] })
    }
  })
}

export function useDeleteJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/jobs/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    }
  })
}
