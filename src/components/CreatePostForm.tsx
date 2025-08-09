// src/components/CreatePostForm.tsx
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Image as LucideImage, X } from "lucide-react";

interface CreatePostFormProps {
    onPostCreated: () => void;
    currentUser: string;
    isOpen: boolean;
    onClose: () => void;
}

export const CreatePostForm = ({
    onPostCreated,
    currentUser,
    isOpen,
    onClose,
}: CreatePostFormProps) => {
    const [content, setContent] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mountedRef = useRef(false);
    const [bottomOffsetPx, setBottomOffsetPx] = useState(16);
    const { toast } = useToast();

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    // keep floating offset above keyboard (mobile) using visualViewport
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setImage(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim() && !image) {
            toast({
                title: "Empty post",
                description: "Please write something or add an image to share!",
                variant: "destructive",
            });
            return;
        }

        const posts = JSON.parse(localStorage.getItem("posts") || "[]");
        const newPost = {
            id: Date.now().toString(),
            content: content.trim(),
            author: currentUser,
            timestamp: new Date().toISOString(),
            image,
        };

        posts.unshift(newPost);
        localStorage.setItem("posts", JSON.stringify(posts));

        setContent("");
        setImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onPostCreated();
        onClose();

        toast({
            title: "Post shared!",
            description: "Your post has been added to the feed",
        });
    };

    // SSR safety
    if (typeof document === "undefined" || !mountedRef.current) return null;
    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-[9999]"
            style={{
                bottom: `calc(${bottomOffsetPx}px + env(safe-area-inset-bottom))`,
            }}
        >
            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's on your mind? Share your daily moments..."
                            className="min-h-[100px] resize-none"
                        />

                        {image && (
                            <div className="relative">
                                <img
                                    src={image}
                                    alt="Preview"
                                    className="rounded-md object-cover w-full max-h-96"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-7 w-7"
                                    onClick={() => {
                                        setImage(null);
                                        if (fileInputRef.current)
                                            fileInputRef.current.value = "";
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    <LucideImage className="h-5 w-5" />
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <span className="text-sm text-muted-foreground">
                                    {content.length}/500 characters
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!content.trim() && !image}
                                >
                                    Share Post
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>,
        document.body
    );
};
