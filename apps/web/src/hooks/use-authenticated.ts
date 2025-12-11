import { api } from "@/api/axios";
import { CurrentProfileObject } from "@/api/types/current-profile.object";
import { useQuery } from "@tanstack/react-query";

export function useAuthenticated() {
  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api<CurrentProfileObject>('/profile'),
    select: response => response.data,
    enabled: typeof window !== 'undefined',
    throwOnError: true,
  })
  return data
}