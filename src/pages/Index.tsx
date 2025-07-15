
import { useState } from "react";
import { TwitterComposeModal } from "@/components/TwitterComposeModal";
import { TwitterDashboard } from "@/components/TwitterDashboard";

interface PostData {
  content: string;
  images: File[];
}

const Index = () => {
  const [showModal, setShowModal] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const [hasPosted, setHasPosted] = useState(false);
  const [postData, setPostData] = useState<PostData>({ content: "", images: [] });

  const handlePost = (content: string, images: File[]) => {
    setPostData({ content, images });
    setShowModal(false);
    setHasPosted(true);
    
    // Small delay for better UX transition
    setTimeout(() => {
      setShowDashboard(true);
    }, 300);
  };

  return (
    <div className="h-screen bg-black overflow-hidden">
      {showModal && <TwitterComposeModal onPost={handlePost} />}
      
      {showDashboard && <TwitterDashboard hasPosted={hasPosted} postData={postData} />}
      
      {/* Background content when modal is open */}
      {showModal && (
        <div className="blur-sm opacity-30">
          <TwitterDashboard hasPosted={false} postData={{ content: "", images: [] }} />
        </div>
      )}
    </div>
  );
};

export default Index;
