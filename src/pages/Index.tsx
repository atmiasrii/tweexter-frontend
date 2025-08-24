
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Landing } from "./Landing";
import { Home } from "./Home";
import { useAuth } from "@/hooks/useAuth";
import { usePost } from "@/hooks/usePost";
import { usePredictionStore } from "@/store/prediction";

const Index = () => {
  const { user, loading } = useAuth();
  const { postData, hasPost, updatePost, updatePostContent } = usePost();
  const { tweetText, ranges, clearPrediction } = usePredictionStore();
  const navigate = useNavigate();

  // Handle post creation from stored prediction data
  const handlePost = (data: { content: string; images: File[] }) => {
    console.log('📝 handlePost called with data:', data);
    updatePost(data);
    // Don't clear prediction data - keep it for analytics display
  };

  // Redirect to login if user logs out or not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // When authenticated user comes back from login with stored tweet text
  useEffect(() => {
    console.log('🔍 Index useEffect - checking stored prediction data:', {
      user: !!user,
      tweetText,
      ranges: !!ranges,
      hasPost
    });
    
    if (user && tweetText && ranges) {
      console.log('✅ Creating post from stored data - tweetText:', tweetText);
      // Auto-create post data from stored prediction
      const postData = { content: tweetText, images: [] };
      handlePost(postData);
    }
  }, [user, tweetText, ranges, hasPost]);

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Redirect unauthenticated users to login
  if (!user) {
    return null;
  }

  // Show landing page for authenticated users without a post
  if (!hasPost) {
    return <Landing onPost={handlePost} />;
  }

  // Authenticated user with a post - show home
  return (
    <Home 
      postData={postData} 
      hasPost={hasPost} 
      onPostUpdate={updatePostContent}
      onNewPost={updatePost}
    />
  );
};

export default Index;
