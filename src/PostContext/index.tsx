// PostContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from "../../firebase-config";

/// Types
type Coordinates = {
  latitude: number;
  longitude: number;
};

type Location = {
  coords: Coordinates;
};

type Comment = {
  text: string;
  userId: string;
  timestamp: number;
};

type Post = {
  name: string;
  url?: string;
  caption?: string;
  location?: Location;
  userId?: string;
  likes?: number;
  comments?: Comment[];
};

type PostContextType = {
  selectedPost: Post | null;
  setPost: (post: Post | null) => void;
  addComment: (postId: string, comment: Comment, commenterType: string) => void;
};

const PostContext = createContext<PostContextType | undefined>(undefined);

type PostProviderProps = {
  children: ReactNode;
};

// Provider component for the postcontext
const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const setPost = (post: Post | null) => {
    setSelectedPost(post);
  };

   /* Function to add a comment to the selected post and update Firestore */
  const addComment = async (postId: string, comment: Comment, commenterType: string) => {
    try {
      if (selectedPost) {
        const updatedPost = { ...selectedPost };
  
        if (!updatedPost.comments) {
          updatedPost.comments = [];
        }

        /* Add commenterType to the comment */
        const commentWithUserType = { ...comment, commenterType };
  
        updatedPost.comments.push(commentWithUserType);
  
        setSelectedPost(updatedPost);
  
        /* Update comment in Firestore */
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          comments: updatedPost.comments,
        });
      }
    } catch (e) {
      console.error('Error adding comment:', (e as Error).message);
    }
  };

  return (
    <PostContext.Provider value={{ selectedPost, setPost, addComment }}>
      {children}
    </PostContext.Provider>
  );
};

/* Hool for using the PostContext */
const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used with PostProvider");
  }
  return context;
};

export { PostProvider, usePostContext, Post, Coordinates, Location };
