
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Pay } from "./pages/Pay";
import { Waitlist } from "./pages/Waitlist";
import NotFound from "./pages/NotFound";

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

  console.log("App component rendering", { queryClient });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/waitlist" element={<Waitlist />} />
            {/* Redirect all other routes to waitlist */}
            <Route path="/" element={<Navigate to="/waitlist" replace />} />
            <Route path="/home" element={<Navigate to="/waitlist" replace />} />
            <Route path="/landing" element={<Navigate to="/waitlist" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pay" element={<Navigate to="/waitlist" replace />} />
            <Route path="*" element={<Navigate to="/waitlist" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
