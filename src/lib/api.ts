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
  
  // Swap replies and retweets due to backend naming mistake
  const temp = raw.replies;
  raw.replies = raw.retweets;
  raw.retweets = temp;
  
  if (raw.ranges) {
    const tempRange = raw.ranges.replies;
    raw.ranges.replies = raw.ranges.retweets;
    raw.ranges.retweets = tempRange;
  }
  
  const normalized = normalizeRanges(raw, body.followers);
  return normalized as PredictResponse;
}

export async function predictEngagement(params: { text: string; followers: number }): Promise<import("../types/prediction").PredictResponse> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  
  // Use relative path when base URL isn't provided (works with Vite dev proxy)
  // This ensures consistency between local dev and production deployment
  const url = baseUrl ? `${baseUrl}/predict` : `/predict`;

  const res = await fetch(url, {
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
  
  // Swap replies and retweets due to backend naming mistake
  const temp = raw.replies;
  raw.replies = raw.retweets;
  raw.retweets = temp;
  
  if (raw.ranges) {
    const tempRange = raw.ranges.replies;
    raw.ranges.replies = raw.ranges.retweets;
    raw.ranges.retweets = tempRange;
  }
  
  const normalized = normalizeRanges(raw, params.followers);

  // After normalization, ranges are guaranteed to exist
  return normalized as import("../types/prediction").PredictResponse;
}

export async function improveText(params: { text: string }): Promise<{ improved_text: string }> {
  const baseUrl = import.meta.env.VITE_IMPROVE_API_BASE_URL as string | undefined;
  const url = baseUrl ? `${baseUrl}/improve` : `/improve`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: params.text,
    }),
  });

  if (!res.ok) {
    const body = await safeJson(res);
    const reason =
      (body && (body.detail || body.message)) ||
      `${res.status} ${res.statusText}`;
    throw new Error(`/improve failed: ${reason}`);
  }

  return await res.json();
}

async function safeJson(r: Response) {
  try {
    return await r.json();
  } catch {
    return null;
  }
}
