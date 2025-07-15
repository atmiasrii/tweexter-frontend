
import { useState } from "react";
import { TwitterComposeModal } from "@/components/TwitterComposeModal";
import { TwitterDashboard } from "@/components/TwitterDashboard";

const Index = () => {
  const [showModal, setShowModal] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);

  const handlePost = () => {
    setShowModal(false);
    
    // Small delay for better UX transition
    setTimeout(() => {
      setShowDashboard(true);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-black">
      {showModal && <TwitterComposeModal onPost={handlePost} />}
      
      {showDashboard && <TwitterDashboard />}
      
      {/* Background content when modal is open */}
      {showModal && (
        <div className="blur-sm opacity-30">
          <TwitterDashboard />
        </div>
      )}
    </div>
  );
};

export default Index;
