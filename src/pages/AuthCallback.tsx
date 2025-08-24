import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Try to complete any auth flow (OAuth code or magic link) and establish a session
    (async () => {
      try {
        // Handles OAuth code flow if present; harmless if not
        await supabase.auth.exchangeCodeForSession(window.location.href);
      } catch (_) {
        // Ignore; not all flows use code exchange
      }
      // After attempting exchange, check for an established session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/home", { replace: true });
      }
    })();

    // Also listen for any late auth events that might occur after the library parses the URL
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/home", { replace: true });
      }
    });

    return () => {
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
