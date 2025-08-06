import { useState, useEffect } from 'react';

export interface PostData {
  content: string;
  images: File[];
}

const STORAGE_KEY = 'twitter_post_data';

// Convert File objects to base64 for storage
const filesToBase64 = async (files: File[]): Promise<{name: string, data: string, type: string}[]> => {
  return Promise.all(files.map(file => 
    new Promise<{name: string, data: string, type: string}>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve({
        name: file.name,
        data: reader.result as string,
        type: file.type
      });
      reader.readAsDataURL(file);
    })
  ));
};

// Convert base64 back to File objects
const base64ToFiles = (base64Files: {name: string, data: string, type: string}[]): File[] => {
  return base64Files.map(({name, data, type}) => {
    // Convert data URL to blob
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || type;
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], name, {type: mime});
  });
};

export const usePost = () => {
  const [postData, setPostData] = useState<PostData>({ content: "", images: [] });
  const [hasPost, setHasPost] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loadPostData = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const files = parsed.images ? base64ToFiles(parsed.images) : [];
          setPostData({
            content: parsed.content || "",
            images: files
          });
          setHasPost(!!(parsed.content || files.length > 0));
        }
      } catch (error) {
        console.error('Error loading post data:', error);
      }
    };

    loadPostData();
  }, []);

  // Save to localStorage whenever postData changes
  useEffect(() => {
    const savePostData = async () => {
      try {
        const base64Images = await filesToBase64(postData.images);
        const dataToStore = {
          content: postData.content,
          images: base64Images
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
      } catch (error) {
        console.error('Error saving post data:', error);
      }
    };

    if (hasPost) {
      savePostData();
    }
  }, [postData, hasPost]);

  const updatePost = (newPostData: PostData) => {
    setPostData(newPostData);
    setHasPost(!!(newPostData.content || newPostData.images.length > 0));
  };

  const updatePostContent = (content: string) => {
    setPostData(prev => ({ ...prev, content }));
    setHasPost(!!(content || postData.images.length > 0));
  };

  const clearPost = () => {
    setPostData({ content: "", images: [] });
    setHasPost(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    postData,
    hasPost,
    updatePost,
    updatePostContent,
    clearPost
  };
};