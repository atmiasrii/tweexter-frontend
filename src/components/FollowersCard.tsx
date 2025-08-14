import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface FollowersCardProps {
  followerCount: number;
  onUpdate: (newCount: number) => void;
}

export const FollowersCard = ({ followerCount, onUpdate }: FollowersCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(followerCount.toString());
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      setEditValue(followerCount.toString());
    }
  };

  const handleSave = async () => {
    if (!user) return;

    // Remove any non-numeric characters and parse
    const cleanedValue = editValue.replace(/\D/g, '');
    const newCount = parseInt(cleanedValue);
    
    if (isNaN(newCount) || newCount < 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ follower_count: newCount })
        .eq('user_id', user.id);

      if (error) throw error;

      onUpdate(newCount);
      setIsEditing(false);
      toast({
        title: "Updated successfully",
        description: "Your follower count has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <Card 
      className={`px-2 py-1.5 cursor-pointer transition-all duration-200 hover:bg-muted/50 border-0 rounded-lg overflow-hidden ${
        isEditing ? 'bg-muted/30' : 'bg-card'
      }`}
      onClick={handleClick}
    >
      {isEditing ? (
        <div className="flex items-center gap-2 min-w-fit">
          <Input
            value={editValue}
            onChange={(e) => {
              // Only allow numeric characters
              const numericValue = e.target.value.replace(/\D/g, '');
              setEditValue(numericValue);
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="min-w-20 max-w-32 h-7 px-2 text-sm bg-background border-0 rounded-md text-center font-medium focus:outline-none focus:ring-0 focus:border-0"
            style={{ 
              width: `${Math.max(80, editValue.length * 8 + 24)}px`,
              appearance: 'textfield',
              MozAppearance: 'textfield'
            }}
            autoFocus
            disabled={isLoading}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
          />
          <span className="text-sm text-muted-foreground whitespace-nowrap font-medium">
            followers
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <span className="text-base font-semibold text-foreground tabular-nums">
            {formatNumber(followerCount)}
          </span>
          <span className="text-sm text-muted-foreground">
            followers
          </span>
        </div>
      )}
    </Card>
  );
};