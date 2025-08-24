
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Pay } from "./pages/Pay";
import { Waitlist } from "./pages/Waitlist";
import NotFound from "./pages/NotFound";

// Landing page wrapper component
const LandingWrapper = () => {
  const navigate = useNavigate();
  
  const handlePost = (data: { content: string; images: File[] }) => {
    // Handle post and redirect to main app
    console.log("Posted:", data);
    navigate('/');
  };
  
  return <Landing onPost={handlePost} />;
};

const App = () => {
  // Create QueryClient inside the component to ensure proper React context
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Index />} />
            <Route path="/landing" element={<LandingWrapper />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pay" element={<Pay />} />
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
