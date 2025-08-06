import { TwitterDashboard } from "@/components/TwitterDashboard";

interface PostData {
  content: string;
  images: File[];
}

interface HomeProps {
  postData?: PostData;
  onPostUpdate?: (updatedContent: string) => void;
}

export const Home = ({ postData, onPostUpdate }: HomeProps) => {
  return (
    <TwitterDashboard 
      hasPosted={!!postData?.content} 
      postData={postData || { content: "", images: [] }}
      onPostUpdate={onPostUpdate}
    />
  );
};