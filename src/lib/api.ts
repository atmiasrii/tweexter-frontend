import { normalizeRanges } from "./ranges";

export type PredictRequest = {
  text: string;
  followers: number;
  return_details?: boolean;
};

export type PredictResponse = {
  likes: number;
  retweets: number;
  replies: number;
  details?: any;
};

export async function predict(body: PredictRequest): Promise<PredictResponse> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

  // Prefer relative path when base URL isn't provided (works with Vite dev proxy)
  const url = baseUrl ? `${baseUrl}/predict` : `/predict`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: body.text,
      followers: body.followers,
      return_details: body.return_details ?? false,
    }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`Predict failed: ${res.status} ${msg}`);
  }

  const raw = await res.json();
  const normalized = normalizeRanges(raw, body.followers);
  return normalized as PredictResponse;
}

// Support Vite or Next.js env conventions for ranges-aware predictions
const fromEnv =
  // Vite style
  (typeof import.meta !== "undefined" && (import.meta as any).env && (import.meta as any).env.VITE_API_BASE_URL) ||
  // Next.js style
  (typeof process !== "undefined" && (process as any).env?.NEXT_PUBLIC_API_BASE_URL) ||
  // Fallback for local dev
  "http://localhost:8000";

const API_BASE = String(fromEnv).replace(/\/+$/, ""); // trim trailing slash

export async function predictEngagement(params: { text: string; followers: number }): Promise<import("../types/prediction").PredictResponse> {
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: params.text,
      followers: params.followers,
      return_details: false, // we only need ranges
    }),
  });

  if (!res.ok) {
    const body = await safeJson(res);
    const reason =
      (body && (body.detail || body.message)) ||
      `${res.status} ${res.statusText}`;
    throw new Error(`/predict failed: ${reason}`);
  }

  const raw = await res.json();
  const normalized = normalizeRanges(raw, params.followers);

  // After normalization, ranges are guaranteed to exist
  return normalized as import("../types/prediction").PredictResponse;
}

async function safeJson(r: Response) {
  try {
    return await r.json();
  } catch {
    return null;
  }
}
