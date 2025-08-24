// src/store/prediction.ts
import { create } from "zustand";
import { predictEngagement } from "@/lib/api";
import type { PredictResponse } from "@/types/prediction";

type State = {
  tweetText: string;
  followers: number;
  loading: boolean;
  error: string | null;
  ranges: PredictResponse["ranges"] | null;
  winnerStats: PredictResponse["ranges"] | null;
};

type Actions = {
  setTweetText: (v: string) => void;
  setFollowers: (n: number) => void;
  fetchPrediction: () => Promise<void>;
  clearError: () => void;
  setWinnerStats: (ranges: PredictResponse["ranges"] | null) => void;
  clearWinnerStats: () => void;
  clearPrediction: () => void;
};

export const usePredictionStore = create<State & Actions>((set, get) => ({
  tweetText: "",
  followers: 1000,
  loading: false,
  error: null,
  ranges: null,
  winnerStats: null,

  setTweetText: (v) => {
    console.log('🔧 PredictionStore - setTweetText called with:', v);
    set({ tweetText: v });
  },
  setFollowers: (n) => set({ followers: n }),
  setWinnerStats: (ranges) => set({ winnerStats: ranges }),
  clearWinnerStats: () => set({ winnerStats: null }),

  fetchPrediction: async () => {
    const { tweetText, followers } = get();
    console.log('🔮 PredictionStore - fetchPrediction called with tweetText:', tweetText);
    if (!tweetText.trim()) {
      set({ error: "Please enter a post first." });
      return;
    }
    set({ loading: true, error: null });
    try {
      const res = await predictEngagement({ text: tweetText, followers });
      console.log('✅ PredictionStore - prediction successful, ranges:', res.ranges);
      set({ ranges: res.ranges });
    } catch (e: any) {
      console.error('❌ PredictionStore - prediction failed:', e);
      set({ error: e?.message ?? "Prediction failed" });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
  clearPrediction: () => set({ 
    tweetText: "", 
    ranges: null, 
    winnerStats: null, 
    error: null 
  }),
}));