// src/hooks/usePrediction.ts
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { predictEngagement } from "../lib/api";
import type { PredictResponse } from "../types/prediction";

export function usePrediction(
  text: string,
  followers: number,
  options?: { enabled?: boolean }
) {
  const enabled = Boolean(options?.enabled && text && followers > 0);

  const result = useQuery<PredictResponse, Error>({
    queryKey: ["prediction", text, followers],
    queryFn: () => predictEngagement({ text, followers }),
    enabled,
    staleTime: 60_000, // 1 min
    retry: 1,
  });

  useEffect(() => {
    if (result.error) {
      // Surface readable error in console for dev visibility
      console.error(result.error);
    }
  }, [result.error]);

  return {
    data: result.data,
    isLoading: result.isLoading,
    error: result.error,
    refetch: result.refetch,
  };
}
