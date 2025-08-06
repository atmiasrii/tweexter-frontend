
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Landing } from "./Landing";
import { Home } from "./Home";
import { useAuth } from "@/hooks/useAuth";

interface PostData {
  content: string;
  images: File[];
}

const Index = () => {
  const [postData, setPostData] = useState<PostData>({ content: "", images: [] });
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/home');
    }
  }, [user, loading, navigate]);

  const handlePost = (data: PostData) => {
    setPostData(data);
    // Navigation to login is handled in Landing component
  };

  const handlePostUpdate = (updatedContent: string) => {
    setPostData(prev => ({ ...prev, content: updatedContent }));
  };

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return user ? (
    <Home postData={postData} hasPost={!!postData.content} onPostUpdate={handlePostUpdate} />
  ) : (
    <Landing onPost={handlePost} />
  );
};

export default Index;
