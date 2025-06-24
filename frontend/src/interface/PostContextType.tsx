
import { PostType, ReplyType, CommentType } from "./Post";
// Define the context type
export interface PostContextType {

    // Methods to manage posts
    fetchPosts: (limit?: number, offset?: number) => Promise<PostType[]>
    fetchUserPosts: (limit?: number, offset?: number) => Promise<PostType[]>
    fetchFavoritePosts: (limit?: number, offset?: number) => Promise<PostType[]>
    getCommentsForPost: (postId: string) => Promise<CommentType[]>
    getRepliesForComment: (commentId: string) => Promise<ReplyType[]>
    addPost: (content: string, image?: File) => Promise<void>
    addComment: (postId: string, content: string) => Promise<void>
    addReply: (commentId: string, content: string) => Promise<void>
    likePost: (postId: string) => Promise<void>
    favoritePost: (postId: string) => Promise<void>
    unlikePost: (postId: string) => Promise<void>
    unfavoritePost: (postId: string) => Promise<void>


}