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
  const [isLogin, setIsLogin] = useState(true);
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
      navigate('/home');
    }
    setIsLoading(false);
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    const { error } = await signUp(email, password, name);
    
    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
      navigate('/pay');
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
    <div className="min-h-screen bg-black flex items-center justify-center py-8">
      <div className="w-full max-w-sm">
        <Card className="rounded-3xl border-gray-800 bg-gray-900 p-8">
          <div className="space-y-6">
            <h1 className="text-2xl font-medium text-white">
              {isLogin ? 'Login' : 'Create Account'}
            </h1>

            <div className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-white text-sm font-normal">Full Name</label>
                  <Input
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-xl h-12 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-white text-sm font-normal">Email</label>
                <Input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-xl h-12 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-white text-sm font-normal">Password</label>
                <Input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-xl h-12 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={isLoading || !email || !password || (!isLogin && !name)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 text-base font-medium mt-6"
              >
                {isLoading ? (isLogin ? "Signing in..." : "Creating account...") : (isLogin ? 'Login' : "Let's Go")}
              </Button>

              <div className="text-center mt-4">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already a member? Login"}
                </button>
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
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