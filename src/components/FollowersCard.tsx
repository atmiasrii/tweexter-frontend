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

    const newCount = parseInt(editValue);
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
      className={`px-3 py-2 cursor-pointer transition-all duration-200 hover:bg-muted/50 border-border ${
        isEditing ? 'bg-muted/30' : 'bg-card'
      }`}
      onClick={handleClick}
    >
      {isEditing ? (
        <div className="flex items-center space-x-1">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="w-16 h-6 px-2 text-xs bg-background border-border focus:border-primary"
            autoFocus
            disabled={isLoading}
            type="number"
            min="0"
          />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            followers
          </span>
        </div>
      ) : (
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium text-foreground">
            {formatNumber(followerCount)}
          </span>
          <span className="text-xs text-muted-foreground">
            followers
          </span>
        </div>
      )}
    </Card>
  );
};