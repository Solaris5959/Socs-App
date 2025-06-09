export interface User {
    id: string;
    name: string;
    position: string;
    company: string
    avatarUrl: string | null;
}

export interface Reply {
    replyId: string;
    author: User;
    content: string;
    createdAt: string; // ISO 8601 format
}

export interface Comment {
    commentId: string;
    author: User;
    content: string;
    createdAt: string;
    replies: Reply[];
}

export interface Post {
    postId: string;
    author: User;
    content: string;
    imageUrl: string | null;
    createdAt: string;
    likesCount: number;
    favoritesCount: number;
    comments: Comment[];
}