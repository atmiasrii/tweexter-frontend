import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [followerCount, setFollowerCount] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoading(true);
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
      });
      navigate('/');
    }
    setIsLoading(false);
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    const followerCountNum = parseInt(followerCount) || 0;
    const { error } = await signUp(email, password, name, followerCountNum);
    
    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created!",
        description: "Welcome to your free trial! You can now start using the app.",
      });
      navigate('/');
    }
    setIsLoading(false);
  };

  const handleSubmit = () => {
    if (isLogin) {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8">
      <div className="w-full max-w-sm">
        <Card className="rounded-3xl border-border bg-card p-6 shadow-lg">
          <div className="space-y-4">
            <h1 className="text-2xl font-medium text-foreground">
              {isLogin ? 'Login' : 'Create Account'}
            </h1>

            <div className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-1">
                    <label className="text-foreground text-sm font-normal">Full Name</label>
                    <Input
                      type="text"
                      placeholder="Enter Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground rounded-xl h-12 focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-foreground text-sm font-normal">Follower Count</label>
                    <Input
                      type="number"
                      placeholder="Enter your current follower count"
                      value={followerCount}
                      onChange={(e) => setFollowerCount(e.target.value)}
                      min="0"
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground rounded-xl h-12 focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-foreground text-sm font-normal">Email</label>
                <Input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground rounded-xl h-12 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-foreground text-sm font-normal">Password</label>
                <Input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground rounded-xl h-12 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={isLoading || !email || !password || (!isLogin && !name)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 text-base font-medium mt-4"
              >
                {isLoading ? (isLogin ? "Signing in..." : "Creating account...") : (isLogin ? 'Login' : "Let's Go")}
              </Button>

              <div className="text-center mt-3">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already a member? Login"}
                </button>
              </div>

              <div className="text-center mt-4">
                <button
                  onClick={() => navigate('/')}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  ← Back to landing
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};