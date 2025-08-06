import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, Globe, ChevronDown, X } from "lucide-react";

interface PostData {
  content: string;
  images: File[];
}

interface LandingProps {
  onPost?: (data: PostData) => void;
}

export const Landing = ({ onPost }: LandingProps) => {
  const [postText, setPostText] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const navigate = useNavigate();

  const handlePost = () => {
    const postData = { content: postText, images: selectedImages };
    onPost?.(postData);
    navigate('/login');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 4 - selectedImages.length);
      setSelectedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-card border-border">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
              <Avatar className="w-12 h-12">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  You
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-semibold text-foreground">Create Post</h2>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Globe className="w-3 h-3" />
                  <span>Anyone</span>
                </div>
              </div>
            </div>

            {/* Text Area */}
            <Textarea
              placeholder="What do you want to talk about?"
              className="min-h-[120px] resize-none border-none shadow-none text-base placeholder:text-muted-foreground focus-visible:ring-0 p-0 bg-transparent"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />

            {/* Image Previews */}
            {selectedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Separator className="my-4" />

            {/* Bottom Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <ImageIcon className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={selectedImages.length >= 4}
                  />
                </label>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    Anyone can reply
                  </Badge>
                </div>
              </div>

              <Button 
                onClick={handlePost}
                disabled={!postText.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Post
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};