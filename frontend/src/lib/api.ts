/**
 * CardioAssist API Client
 * Calls the FastAPI ML backend directly.
 * Set VITE_API_URL to your backend base URL (e.g. https://your-api.onrender.com).
 * In local dev, Vite proxies /api → http://localhost:8000 (rewrite strips /api).
 */
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  UseMutationOptions,
  UseQueryOptions,
  QueryKey,
} from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_URL ?? "/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PredictInput {
  age: number;
  sex: number;
  cp: number;
  trtbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalachh: number;
  exng: number;
  oldpeak: number;
  slp: number;
  caa: number;
  thall: number;
}

export interface PredictOutput {
  prediction: string;
  probability: number;
  risk_score: number;
}

export interface TopFeature {
  feature: string;
  coefficient: number;
}

export interface MetricsOutput {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  test_size: number;
  train_size: number;
  top_features: TopFeature[];
}

export interface HealthStatus {
  status: string;
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status}: ${detail}`);
  }
  return res.json() as Promise<T>;
}

// ─── Health check ─────────────────────────────────────────────────────────────

export const getHealthCheckQueryKey = () => ["/healthz"] as const;

export function useHealthCheck<TData = HealthStatus>(options?: {
  query?: UseQueryOptions<HealthStatus, Error, TData>;
}) {
  return useQuery<HealthStatus, Error, TData>({
    queryKey: getHealthCheckQueryKey() as unknown as QueryKey,
    queryFn: () => apiFetch<HealthStatus>("/healthz"),
    refetchInterval: 30_000,
    retry: false,
    ...(options?.query as object),
  });
}

// ─── Predict ─────────────────────────────────────────────────────────────────

export function usePredictHeartDisease(
  options?: UseMutationOptions<PredictOutput, Error, { data: PredictInput }>
) {
  return useMutation<PredictOutput, Error, { data: PredictInput }>({
    mutationFn: ({ data }) =>
      apiFetch<PredictOutput>("/predict", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    ...options,
  });
}

// ─── Metrics ─────────────────────────────────────────────────────────────────

export const getGetModelMetricsQueryKey = () => ["/metrics"] as const;

export function useGetModelMetrics<TData = MetricsOutput>(options?: {
  query?: UseQueryOptions<MetricsOutput, Error, TData>;
}) {
  return useQuery<MetricsOutput, Error, TData>({
    queryKey: getGetModelMetricsQueryKey() as unknown as QueryKey,
    queryFn: () => apiFetch<MetricsOutput>("/metrics"),
    staleTime: Infinity,
    ...(options?.query as object),
  });
}
