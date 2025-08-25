import { supabase } from "@/integrations/supabase/client";
import { Ranges } from "@/types/prediction";

type AnalyticsAction = 'initial_prediction' | 'text_improvement' | 'text_edit' | 'winner_selection';

interface LogAnalyticsParams {
  actionType: AnalyticsAction;
  originalText: string;
  improvedText?: string;
  originalPredictions?: Ranges;
  improvedPredictions?: Ranges;
  winnerStats?: Ranges;
  followerCount: number;
}

export const logUserAnalytics = async (params: LogAnalyticsParams) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('No user found, skipping analytics logging');
      return;
    }

    const { error } = await supabase
      .from('user_analytics')
      .insert({
        user_id: user.id,
        action_type: params.actionType,
        original_text: params.originalText,
        improved_text: params.improvedText || null,
        original_predictions: params.originalPredictions as any || null,
        improved_predictions: params.improvedPredictions as any || null,
        winner_stats: params.winnerStats as any || null,
        follower_count: params.followerCount
      } as any);

    if (error) {
      console.error('Error logging analytics:', error);
    } else {
      console.log('Analytics logged successfully:', params.actionType);
    }
  } catch (error) {
    console.error('Failed to log analytics:', error);
  }
};