import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Image as LucideImage, X } from "lucide-react";

interface CreatePostFormProps {
    onPostCreated: () => void;
    currentUser: string;
}

export const CreatePostForm = ({
    onPostCreated,
    currentUser,
}: CreatePostFormProps) => {
    const [content, setContent] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
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
            image: image,
        };

        posts.unshift(newPost);
        localStorage.setItem("posts", JSON.stringify(posts));

        setContent("");
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onPostCreated();

        toast({
            title: "Post shared!",
            description: "Your post has been added to the feed",
        });
    };

    return (
        <Card className="mb-6">
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
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = "";
                                    }
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
                                onClick={() => fileInputRef.current?.click()}
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
                        <Button
                            type="submit"
                            disabled={!content.trim() && !image}
                        >
                            Share Post
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
