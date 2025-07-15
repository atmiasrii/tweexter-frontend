
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Eye } from "lucide-react";

interface PostData {
  content: string;
  images: File[];
}

interface TwitterComposeProps {
  hasPosted?: boolean;
  postData?: PostData;
}

export const TwitterCompose = ({ hasPosted = false, postData = { content: "", images: [] } }: TwitterComposeProps) => {
  if (!hasPosted || !postData.content) {
    return (
      <div className="w-full h-full flex flex-col">
        <Card className="bg-black border-gray-800 flex-1 flex flex-col justify-center items-center">
          <div className="text-gray-500 text-lg">No post to display</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <Card className="bg-black border-gray-800 flex-1 flex flex-col justify-center">
        <div className="p-4 sm:p-6 flex justify-center items-center min-h-0">
          <div className="w-full max-w-lg">
            <div className="flex items-start space-x-3">
              <Avatar className="w-12 h-12 flex-shrink-0">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback className="bg-blue-500 text-white text-lg font-medium">DA</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-white font-medium">Data Analytics</span>
                  <span className="text-gray-500 text-sm">@dataanalytics</span>
                  <span className="text-gray-500 text-sm">·</span>
                  <span className="text-gray-500 text-sm">2m</span>
                </div>
                <p className="text-white text-lg leading-6 mb-4">
                  {postData.content}
                </p>
                
                {/* Display uploaded images */}
                {postData.images.length > 0 && (
                  <div className={`grid gap-2 mb-4 ${
                    postData.images.length === 1 ? 'grid-cols-1' : 
                    postData.images.length === 2 ? 'grid-cols-2' : 
                    'grid-cols-2'
                  }`}>
                    {postData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Post image ${index + 1}`}
                          className="w-full h-48 object-cover rounded-xl"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center space-x-6 text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">89.1K</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">3.2K</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">+15.7%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
