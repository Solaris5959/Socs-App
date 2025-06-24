export interface User {
    id: string;
    name: string;
    position: string;
    company: string
    avatarUrl: string | null;
}

// export interface Reply {
//     replyId: string;
//     author: User;
//     content: string;
//     createdAt: string; // ISO 8601 format
// }

// export interface Comment {
//     commentId: string;
//     author: User;
//     content: string;
//     createdAt: string;
//     replies: Reply[];
// }

// export interface Post {
//     postId: string;
//     author: User;
//     content: string;
//     imageUrl: string | null;
//     createdAt: string;
//     likesCount: number;
//     favoritesCount: number;
//     comments: Comment[];
// }

// Update the PostType interface to include the new fields
export interface PostType {
    id: string;
    author_id: string;
    content: string;
    created_at: string; // ISO date string
    media_url: string | null;
    visibility: 'public' | 'private' | 'connections-only'; // adjust based on your enum
    comment_count: number;
    like_count: number;
    favourite_count: number;
    display_name: string;
    profile_pic_url: string | null;
    profile_company: string | null;
    profile_position: string | null;
    liked_by_user: boolean;
    favourited_by_user: boolean;
}



export interface CommentType {
    id: string;
    post_id: string;
    comment_id: string;
    content: string;
    created_at: string; // ISO date string 
    author_id: string;
    display_name: string;
    profile_pic_url: string | null;
    company: string | null;
    position: string | null;
    replies_count?: number | undefined
}

export interface ReplyType {
    id: string;
    comment_id: string;
    content: string;
    created_at: string; // ISO date string
    author_id: string;
    display_name: string;
    profile_pic_url: string | null;
    company: string | null;
    position: string | null;
}