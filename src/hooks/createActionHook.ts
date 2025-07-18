import { createMemo } from "solid-js";
import { useMutation } from "@tanstack/solid-query";

export interface ActionHookReturn<T = any> {
  onSubmit: (data: T) => Promise<void>;
  error: () => string | null;
  isLoading: () => boolean;
  success?: () => boolean;
}

export const createActionHook = <T = any>(
  submitFn: (data: T) => Promise<void>,
  options?: {
    includeSuccess?: boolean;
    onSuccess?: () => void;
    onError?: (error: string) => void;
  }
): ActionHookReturn<T> => {
  const mutation = useMutation(() => ({
    mutationFn: async (data: T) => {
      await submitFn(data);
    },
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onError: (err: Error) => {
      options?.onError?.(err.message);
    },
  }));

  const success = createMemo(
    () => !!(options?.includeSuccess && mutation.isSuccess)
  );

  return {
    onSubmit: mutation.mutateAsync,
    error: () => mutation.error?.message ?? null,
    isLoading: () => mutation.isPending,
    success,
  };
};
