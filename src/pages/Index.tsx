
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

  useEffect(() => {
    if (!loading && user && hasPost) {
      // User is authenticated and has a post, go to home
      navigate('/home');
    }
  }, [user, loading, hasPost, navigate]);

  const handlePost = (data: { content: string; images: File[] }) => {
    updatePost(data);
    // After posting, if user is authenticated, go to home
    if (user) {
      navigate('/home');
    } else {
      // If not authenticated, go to login
      navigate('/login');
    }
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
    />
  );
};

export default Index;
