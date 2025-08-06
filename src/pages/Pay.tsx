import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap } from "lucide-react";

export const Pay = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      navigate('/home');
    }, 2000);
  };

  const handleSkip = () => {
    navigate('/home');
  };

  const features = [
    "Advanced AI-powered content improvement",
    "Unlimited post analytics",
    "Priority customer support",
    "Custom branding options",
    "Team collaboration tools"
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-card border-border p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Upgrade to Pro</h1>
            <p className="text-muted-foreground">Unlock advanced features and take your content to the next level</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h3 className="font-semibold text-foreground">Pro Plan</h3>
                <p className="text-sm text-muted-foreground">Billed monthly</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">$19</div>
                <div className="text-sm text-muted-foreground">/month</div>
              </div>
            </div>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleSubscribe}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Subscribe Now"}
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={handleSkip}
              className="w-full text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              Continue with Free Plan
            </Button>
          </div>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-1">
              <Badge variant="secondary" className="text-xs">
                7-day free trial
              </Badge>
              <span className="text-xs text-muted-foreground">• Cancel anytime</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};