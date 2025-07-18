import { useQuery } from "@tanstack/solid-query";

export interface QueryHookReturn<T = any> {
  data: () => T | undefined;
  error: () => string | null;
  isLoading: () => boolean;
  isSuccess: () => boolean;
  isError: () => boolean;
  refetch: () => void;
}

export const createQueryHook = <T = any>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: {
    enabled?: boolean;
    onError?: (error: string) => void;
  }
): QueryHookReturn<T> => {
  const query = useQuery(() => ({
    queryKey,
    queryFn,
    enabled: options?.enabled,
    onError: (err: Error) => {
      options?.onError?.(err.message);
    },
  }));

  return {
    data: () => query.data,
    error: () => query.error?.message ?? null,
    isLoading: () => query.isLoading,
    isSuccess: () => query.isSuccess,
    isError: () => query.isError,
    refetch: query.refetch,
  };
};
