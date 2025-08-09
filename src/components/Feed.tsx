import { useEffect, useState } from "react";
import { PostCard } from "./PostCard";
import { CreatePostForm } from "./CreatePostForm";
import { Button } from "@/components/ui/button";
import { LogOut, Users } from "lucide-react";

interface Post {
  id: string;
  content: string;
  author: string;
  timestamp: string;
}

interface FeedProps {
  currentUser: string;
  onLogout: () => void;
}

export const Feed = ({ currentUser, onLogout }: FeedProps) => {
  const [posts, setPosts] = useState<Post[]>([]);

  const loadPosts = () => {
    const savedPosts = JSON.parse(localStorage.getItem("posts") || "[]");
    setPosts(savedPosts);
  };

  const generateSamplePosts = () => {
    const samplePosts = [
      {
        id: "sample1",
        content: "Just cooked dinner for my family",
        author: "Sarah",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
      },
      {
        id: "sample2", 
        content: "Went for a walk in the park today",
        author: "Mike",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      },
      {
        id: "sample3",
        content: "Watched a movie tonight",
        author: "Emma",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      },
      {
        id: "sample4",
        content: "Did some grocery shopping",
        author: "Alex",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      },
    ];

    const existingPosts = JSON.parse(localStorage.getItem("posts") || "[]");
    const hasSamples = existingPosts.some((post: Post) => post.id.startsWith("sample"));
    
    if (!hasSamples) {
      const allPosts = [...samplePosts, ...existingPosts];
      localStorage.setItem("posts", JSON.stringify(allPosts));
      setPosts(allPosts);
    }
  };

  useEffect(() => {
    loadPosts();
    generateSamplePosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              The Neighbour Comparator
            </h1>
            <p className="text-muted-foreground mt-1">
              Where everyone else's life looks amazing! 🌱
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium">{currentUser}</p>
              <p className="text-sm text-muted-foreground flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Welcome back!
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Create Post Form */}
        <CreatePostForm onPostCreated={loadPosts} currentUser={currentUser} />

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No posts yet!
              </h3>
              <p className="text-muted-foreground">
                Be the first to share something. Your friends' posts will look way more exciting! 😉
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                currentUser={currentUser}
              />
            ))
          )}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 mb-8">
          <p className="text-sm text-muted-foreground italic">
            "അക്കരെ നിന്നാൽ ഇക്കരെ പച്ച" - The grass is always greener on the other side 🌿
          </p>
        </div>
      </div>
    </div>
  );
};