
import { useState } from "react";
import { TwitterComposeModal } from "@/components/TwitterComposeModal";
import { TwitterDashboard } from "@/components/TwitterDashboard";

const Index = () => {
  const [showModal, setShowModal] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const [hasPosted, setHasPosted] = useState(false);

  const handlePost = () => {
    setShowModal(false);
    setHasPosted(true);
    
    // Small delay for better UX transition
    setTimeout(() => {
      setShowDashboard(true);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-black">
      {showModal && <TwitterComposeModal onPost={handlePost} />}
      
      {showDashboard && <TwitterDashboard hasPosted={hasPosted} />}
      
      {/* Background content when modal is open */}
      {showModal && (
        <div className="blur-sm opacity-30">
          <TwitterDashboard hasPosted={false} />
        </div>
      )}
    </div>
  );
};

export default Index;
