// src/components/Feed.tsx
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PostCard } from "./PostCard";
import { CreatePostForm } from "./CreatePostForm";
import { Button } from "@/components/ui/button";
import { LogOut, Users, Settings, Plus } from "lucide-react";
import { AccountSettings } from "./AccountSettings";

interface Post {
    id: string;
    content: string;
    author: string;
    timestamp: string;
    image?: string | null;
}

interface FeedProps {
    currentUser: string;
    onLogout: () => void;
}

export const Feed = ({ currentUser, onLogout }: FeedProps) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [createPostOpen, setCreatePostOpen] = useState(false);

    const mountedRef = useRef(false);
    const [userName, setUserName] = useState<string>(
        () => localStorage.getItem("currentUser") || currentUser
    );

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const loadPosts = () => {
        const savedPosts = JSON.parse(localStorage.getItem("posts") || "[]");
        setPosts(savedPosts);
    };

    const generateSamplePosts = () => {
        const samplePosts: Post[] = [
            {
                id: "sample1",
                content: "Just cooked dinner for my family",
                author: "Sarah",
                timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            },
            {
                id: "sample2",
                content: "Went for a walk in the park today",
                author: "Mike",
                timestamp: new Date(
                    Date.now() - 1000 * 60 * 60 * 2
                ).toISOString(),
            },
            {
                id: "sample3",
                content: "Watched a movie tonight",
                author: "Emma",
                timestamp: new Date(
                    Date.now() - 1000 * 60 * 60 * 5
                ).toISOString(),
            },
            {
                id: "sample4",
                content: "Did some grocery shopping",
                author: "Alex",
                timestamp: new Date(
                    Date.now() - 1000 * 60 * 60 * 8
                ).toISOString(),
            },
        ];

        const existingPosts = JSON.parse(localStorage.getItem("posts") || "[]");
        const hasSamples = existingPosts.some((post: Post) =>
            post.id.startsWith("sample")
        );

        if (!hasSamples) {
            const allPosts = [...samplePosts, ...existingPosts];
            localStorage.setItem("posts", JSON.stringify(allPosts));
            setPosts(allPosts);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) setUserName(storedUser);

        loadPosts();
        generateSamplePosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // rename handler (updates old posts' author fields)
    const handleSaveUsername = (newName: string) => {
        const oldName =
            localStorage.getItem("currentUser") || userName || currentUser;
        if (!newName || newName.trim() === "") return;

        const existingPosts: Post[] = JSON.parse(
            localStorage.getItem("posts") || "[]"
        );
        const updatedPosts = existingPosts.map((p) =>
            p.author === oldName ? { ...p, author: newName } : p
        );

        localStorage.setItem("posts", JSON.stringify(updatedPosts));
        localStorage.setItem("currentUser", newName);

        setPosts(updatedPosts);
        setUserName(newName);
        setSettingsOpen(false);
    };

    // Portal-mounted floating add button (keeps it outside any layout/clipping)
    const FloatingAddPortal = () => {
        if (typeof document === "undefined" || !mountedRef.current) return null;

        // handle safe-area + keyboard similar to CreatePostForm using visualViewport
        const [bottomOffsetPx, setBottomOffsetPx] = useState(16);
        useEffect(() => {
            const vv = (window as any).visualViewport;
            if (!vv) return;
            const updateOffset = () => {
                const keyboardHeight =
                    window.innerHeight -
                    (vv.height || window.innerHeight) -
                    (vv.offsetTop || 0);
                const newOffset = Math.max(16, Math.ceil(keyboardHeight + 12));
                setBottomOffsetPx(newOffset);
            };
            vv.addEventListener("resize", updateOffset);
            vv.addEventListener("scroll", updateOffset);
            updateOffset();
            return () => {
                vv.removeEventListener("resize", updateOffset);
                vv.removeEventListener("scroll", updateOffset);
            };
        }, []);

        return createPortal(
            <Button
                onClick={() => setCreatePostOpen(true)}
                aria-label="Add post"
                className="fixed left-4 rounded-full h-14 w-14 shadow-lg z-[9999] bg-blue-600 hover:bg-blue-700"
                style={{
                    bottom: `calc(${bottomOffsetPx}px + env(safe-area-inset-bottom))`,
                }}
            >
                <Plus className="w-6 h-6 text-white" />
            </Button>,
            document.body
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
            <div className="max-w-2xl mx-auto p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pt-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                            Nadan LinkedIn
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                            Everyone else is amazing!
                        </p>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <div className="hidden sm:block text-right">
                            <p className="font-medium">{userName}</p>
                            <p className="text-sm text-muted-foreground flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                Welcome back!
                            </p>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSettingsOpen(true)}
                            className="flex items-center"
                        >
                            <Settings className="w-4 h-4" />
                            <span className="hidden sm:inline ml-2">
                                Settings
                            </span>
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onLogout}
                            className="flex items-center"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline ml-2">
                                Logout
                            </span>
                        </Button>
                    </div>
                </div>

                {/* Create Post Form (portal-mounted inside CreatePostForm) */}
                <CreatePostForm
                    onPostCreated={() => {
                        loadPosts();
                        setCreatePostOpen(false);
                    }}
                    currentUser={userName}
                    isOpen={createPostOpen}
                    onClose={() => setCreatePostOpen(false)}
                />

                {/* Posts Feed */}
                <div className="space-y-4">
                    {posts.length === 0 ? (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                                No posts yet!
                            </h3>
                            <p className="text-muted-foreground">
                                Be the first to share something. Your friends'
                                posts will look way more exciting! 😉
                            </p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                currentUser={userName}
                            />
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-12 mb-8">
                    <p className="text-sm text-muted-foreground italic">
                        "അക്കരെ നിന്നാൽ ഇക്കരെ പച്ച" - The grass is always
                        greener on the other side 🌿
                    </p>
                </div>

                {/* Account Settings Modal */}
                {settingsOpen && (
                    <AccountSettings
                        currentUser={userName}
                        onClose={() => setSettingsOpen(false)}
                        onSave={handleSaveUsername}
                    />
                )}

                {/* Floating Add button portal */}
                <FloatingAddPortal />
            </div>
        </div>
    );
};
