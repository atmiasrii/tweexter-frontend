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
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) throw new Error("VITE_API_BASE_URL is not set");

  const res = await fetch(`${baseUrl}/predict`, {
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

  return (await res.json()) as PredictResponse;
}
