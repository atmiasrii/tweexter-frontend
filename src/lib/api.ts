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

  // Use https://api.tweexter.co/predict for scoring
  const url = baseUrl ? `${baseUrl}/predict` : `https://api.tweexter.co/predict`;

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
  
  // Use https://api.tweexter.co/predict for scoring
  const url = baseUrl ? `${baseUrl}/predict` : `https://api.tweexter.co/predict`;

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

function parseVersionedResponse(result: any): string {
  // Handle versioned response format like {'v2': "text content"}
  let processedResult = result;
  
  // If result is a string that looks like stringified JSON, try to parse it
  if (typeof result === 'string') {
    try {
      // Check if it looks like a stringified versioned response
      if (result.includes("'v") || result.includes('"v')) {
        processedResult = JSON.parse(result.replace(/'/g, '"'));
      } else {
        // Clean any version wrapper patterns from string
        const versionPattern = /^\{'v\d+'\s*:\s*'(.+)'\}$|^\{"v\d+"\s*:\s*"(.+)"\}$/;
        const match = result.match(versionPattern);
        if (match) {
          return match[1] || match[2];
        }
        return result;
      }
    } catch {
      // If parsing fails, clean any obvious version wrapper patterns
      const cleaned = result
        .replace(/^\{'v\d+'\s*:\s*'/, '')
        .replace(/'\}$/, '')
        .replace(/^\{"v\d+"\s*:\s*"/, '')
        .replace(/"\}$/, '');
      return cleaned !== result ? cleaned : result;
    }
  }
  
  if (typeof processedResult === 'object' && processedResult !== null) {
    // Look for version keys (v1, v2, v3, etc.)
    const versionKeys = Object.keys(processedResult).filter(key => /^v\d+$/.test(key));
    if (versionKeys.length > 0) {
      // Return only the text content for the first version key
      const versionKey = versionKeys[0];
      const text = processedResult[versionKey];
      return typeof text === 'string' ? text : String(text);
    }

    // Fallback: if 'improved_text' exists, use it
    if (processedResult.improved_text) {
      return processedResult.improved_text;
    }
  }

  // Last fallback - return the original stringified result
  return String(result);
}

export async function improveText(params: { text: string }): Promise<{ improved_text: string }> {
  console.log('🌐 improveText API called with text:', params.text);
  
  const baseUrl = import.meta.env.VITE_IMPROVE_API_BASE_URL as string | undefined;
  const url = baseUrl ? `${baseUrl}/improve` : `https://api2.tweexter.co/improve`;
  
  console.log('🔗 Making request to URL:', url);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: params.text,
    }),
  });

  console.log('📡 Response status:', res.status, res.statusText);

  if (!res.ok) {
    const body = await safeJson(res);
    console.error('❌ API error response:', body);
    const reason =
      (body && (body.detail || body.message)) ||
      `${res.status} ${res.statusText}`;
    throw new Error(`/improve failed: ${reason}`);
  }

  const result = await res.json();
  console.log('📦 API response data:', result);
  
  // Parse the versioned response and extract the text content
  const improvedText = parseVersionedResponse(result);
  
  return { improved_text: improvedText };
}

async function safeJson(r: Response) {
  try {
    return await r.json();
  } catch {
    return null;
  }
}
