import { TwitterDashboard } from "@/components/TwitterDashboard";

interface PostData {
  content: string;
  images: File[];
}

interface HomeProps {
  postData: PostData;
  hasPost: boolean;
  onPostUpdate?: (updatedContent: string) => void;
  onNewPost?: (data: PostData) => void;
}

export const Home = ({ postData, hasPost, onPostUpdate, onNewPost }: HomeProps) => {
  return (
    <TwitterDashboard 
      hasPosted={hasPost} 
      postData={postData}
      onPostUpdate={onPostUpdate}
      onNewPost={onNewPost}
    />
  );
};