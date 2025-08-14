// src/types/prediction.ts
export type MetricKey = "likes" | "retweets" | "replies";

export interface MetricRange {
  low: number;
  mid: number;   // backend sends mid but we won't show it in UI
  high: number;
}

export interface Ranges {
  likes: MetricRange;
  retweets: MetricRange;
  replies: MetricRange;
}

export interface PredictResponse {
  likes: number;
  retweets: number;
  replies: number;
  ranges: Ranges;
  // details is optional on the backend; we ignore it in UI
  details?: Record<string, unknown> | null;
}
