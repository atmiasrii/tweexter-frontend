
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Landing } from "./Landing";
import { Home } from "./Home";
import { useAuth } from "@/hooks/useAuth";
import { usePost } from "@/hooks/usePost";

const Index = () => {
  const { user, loading } = useAuth();
  const { postData, hasPost, updatePost, updatePostContent } = usePost();
  const navigate = useNavigate();

  // No need to navigate to /home since Index handles both states

  const handlePost = (data: { content: string; images: File[] }) => {
    updatePost(data);
    // After posting, if not authenticated, go to login
    if (!user) {
      navigate('/login');
    }
    // If authenticated, the component will re-render and show Home automatically
  };

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Show landing page for:
  // 1. Unauthenticated users (for signup flow)
  // 2. Authenticated users without a post (for first tweet)
  if (!user || !hasPost) {
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
