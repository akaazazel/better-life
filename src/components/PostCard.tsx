import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Post {
    id: string;
    content: string;
    author: string;
    timestamp: string;
    image?: string | null; // Add the optional image property
}

interface PostCardProps {
    post: Post;
    currentUser: string;
}

const embellishPost = (content: string): string => {
    // The magical embellishment algorithm!
    const excitingPhrases = [
        "🌟 Incredible! ",
        "🚀 Amazing! ",
        "✨ Absolutely stunning! ",
        "🔥 Mind-blowing! ",
        "💫 Fantastic! ",
    ];

    const excitingEndings = [
        " What an achievement! #Blessed 🙌",
        " Living my best life! #Grateful ✨",
        " Dreams coming true! #Inspired 🌟",
        " Couldn't be happier! #Amazing 💖",
        " Life is incredible! #Blessed 🚀",
    ];

    const wordReplacements: { [key: string]: string } = {
        walked: "embarked on an epic journey",
        cooked: "curated a culinary masterpiece",
        ate: "savored an exquisite feast",
        watched: "experienced a mind-blowing",
        read: "devoured an inspiring",
        worked: "crushed it at",
        slept: "enjoyed the most rejuvenating rest",
        studied: "mastered advanced concepts in",
        played: "dominated an intense session of",
        went: "ventured forth to",
        bought: "acquired the most amazing",
        met: "had an extraordinary encounter with",
        saw: "witnessed something absolutely magnificent",
        made: "crafted an incredible",
        did: "accomplished something remarkable with",
    };

    let embellished = content;

    // Apply word replacements
    Object.entries(wordReplacements).forEach(([original, replacement]) => {
        const regex = new RegExp(`\\b${original}\\b`, "gi");
        embellished = embellished.replace(regex, replacement);
    });

    // Add exciting emojis randomly
    const emojis = ["🌟", "✨", "🚀", "💫", "🔥", "🌈", "💖", "🙌"];
    const words = embellished.split(" ");
    const emojiPositions = Math.floor(words.length / 3);

    for (let i = 0; i < emojiPositions; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        words[randomIndex] += ` ${randomEmoji}`;
    }

    embellished = words.join(" ");

    // Add exciting beginning and ending if there's content
    if (embellished) {
        const randomBeginning =
            excitingPhrases[Math.floor(Math.random() * excitingPhrases.length)];
        const randomEnding =
            excitingEndings[Math.floor(Math.random() * excitingEndings.length)];
        return `${randomBeginning}${embellished}${randomEnding}`;
    }

    return embellished;
};

const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
};

export const PostCard = ({ post, currentUser }: PostCardProps) => {
    const isMyPost = post.author === currentUser;
    const displayContent = isMyPost
        ? post.content
        : embellishPost(post.content);

    return (
        <Card
            className={`mb-4 transition-all duration-300 ${
                isMyPost
                    ? "bg-my-post border-my-post-border"
                    : "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-lg hover:shadow-xl border-0"
            }`}
        >
            <CardContent className="pt-4">
                <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                        <AvatarFallback
                            className={`${
                                isMyPost
                                    ? "bg-my-post-border text-my-post-foreground"
                                    : "bg-primary-foreground text-primary"
                            }`}
                        >
                            {post.author.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                            <h3
                                className={`font-semibold ${
                                    isMyPost
                                        ? "text-my-post-foreground"
                                        : "text-primary-foreground"
                                }`}
                            >
                                {post.author}
                            </h3>
                            <span
                                className={`text-sm ${
                                    isMyPost
                                        ? "text-my-post-foreground/70"
                                        : "text-primary-foreground/80"
                                }`}
                            >
                                {formatTimestamp(post.timestamp)}
                            </span>
                        </div>
                        {/* Only render paragraph if there is content */}
                        {displayContent && (
                            <p
                                className={`${
                                    isMyPost
                                        ? "text-my-post-foreground leading-relaxed"
                                        : "text-primary-foreground leading-relaxed font-medium"
                                }`}
                            >
                                {displayContent}
                            </p>
                        )}
                        {/* Conditionally render the image */}
                        {post.image && (
                            <div className="mt-3 rounded-lg overflow-hidden">
                                <img
                                    src={post.image}
                                    alt="Post content"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
