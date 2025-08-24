import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for the auth event triggered by Supabase when it parses the URL tokens
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/home", { replace: true });
      }
    });

    // Safety: also check once after a short delay in case the event fired before mount
    const timer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/home", { replace: true });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-medium">Signing you in…</h1>
        <p className="text-muted-foreground">Please wait while we complete your login.</p>
      </div>
    </div>
  );
};
