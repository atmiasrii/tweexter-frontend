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
  clearPrediction: () => void;
};

export const usePredictionStore = create<State & Actions>((set, get) => ({
  tweetText: "",
  followers: 1000,
  loading: false,
  error: null,
  ranges: null,
  winnerStats: null,

  setTweetText: (v) => set({ tweetText: v }),
  setFollowers: (n) => set({ followers: n }),
  setWinnerStats: (ranges) => set({ winnerStats: ranges }),

  fetchPrediction: async () => {
    const { tweetText, followers } = get();
    if (!tweetText.trim()) {
      set({ error: "Please enter a post first." });
      return;
    }
    set({ loading: true, error: null });
    try {
      const res = await predictEngagement({ text: tweetText, followers });
      set({ ranges: res.ranges });
    } catch (e: any) {
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