
import { useState, useEffect } from "react";
import { TwitterCompose } from "@/components/TwitterCompose";
import { TwitterEngagementChart } from "@/components/TwitterEngagementChart";
import { TwitterMetrics } from "@/components/TwitterMetrics";
import { TwitterComposeModal } from "@/components/TwitterComposeModal";
import { FollowersCard } from "@/components/FollowersCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { usePredictionStore } from "@/store/prediction";
import { useToast } from "@/hooks/use-toast";

interface PostData {
  content: string;
  images: File[];
}

interface TwitterDashboardProps {
  hasPosted?: boolean;
  postData?: PostData;
  onPostUpdate?: (updatedContent: string) => void;
  onNewPost?: (data: PostData) => void;
}

export const TwitterDashboard = ({ 
  hasPosted = false, 
  postData = { content: "", images: [] },
  onPostUpdate,
  onNewPost
}: TwitterDashboardProps) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const { profile, updateFollowerCount } = useProfile();
  const { toast } = useToast();
  
  const {
    tweetText,
    followers,
    setTweetText,
    setFollowers,
    fetchPrediction,
    loading,
    error,
    ranges,
    clearError,
  } = usePredictionStore();

  // Initialize followers from profile
  useEffect(() => {
    if (profile?.follower_count && followers !== profile.follower_count) {
      setFollowers(profile.follower_count);
    }
  }, [profile?.follower_count, followers, setFollowers]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast({
        title: "Prediction Error",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, toast, clearError]);

  const handleAnalyticsRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleNewPost = async (data: PostData) => {
    if (onNewPost) {
      onNewPost(data);
    }

    // Update store and trigger prediction
    setTweetText(data.content);
    await fetchPrediction();
    handleAnalyticsRefresh();
  };

  const handlePredict = async () => {
    await fetchPrediction();
    handleAnalyticsRefresh();
  };

  return (
    <div className="h-screen bg-background overflow-hidden animate-fade-in">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* New Post Button */}
        <div className="absolute top-6 left-6 z-10">
          <Button
            onClick={() => setIsComposeModalOpen(true)}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 py-2 shadow-lg h-9 text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Post
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 py-6 h-full">
          {/* Left side - Twitter Compose - Centered vertically */}
          <div className="w-full lg:w-1/2 xl:w-2/5 h-full flex items-center">
            <div className="w-full">
              <TwitterCompose 
                hasPosted={hasPosted} 
                postData={postData}
                tweetText={tweetText}
                followers={followers}
                loading={loading}
                onTweetTextChange={setTweetText}
                onFollowersChange={setFollowers}
                onPostUpdate={(content) => {
                  if (onPostUpdate) onPostUpdate(content);
                  setTweetText(content);
                }}
                onPredict={handlePredict}
                onAnalyticsRefresh={handleAnalyticsRefresh}
              />
            </div>
          </div>
          
          {/* Right side - Analytics Container */}
          <div className="w-full lg:w-1/2 xl:w-3/5 h-full flex items-center">
            <Card className="w-full h-[90%] bg-card border-border shadow-lg rounded-3xl overflow-hidden">
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
                  <div className="flex items-center space-x-3">
                    {profile && (
                      <FollowersCard
                        followerCount={profile.follower_count}
                        onUpdate={updateFollowerCount}
                      />
                    )}
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-muted-foreground">Live</span>
                    </div>
                  </div>
                </div>
                
                {/* Performance Metrics - Very Compact */}
                <div className="h-[35%]">
                  <TwitterMetrics key={`metrics-${refreshKey}`} ranges={ranges} />
                </div>
                
                {/* Engagement Chart - Larger */}
                <div className="h-[60%]">
                  <TwitterEngagementChart 
                    key={`chart-${refreshKey}`} 
                    likesRange={ranges?.likes} 
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      <TwitterComposeModal
        isOpen={isComposeModalOpen}
        onClose={() => setIsComposeModalOpen(false)}
        onPost={handleNewPost}
      />
    </div>
  );
};
