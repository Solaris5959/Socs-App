

// Define the context type
export interface PostContextType {

    // Methods to manage posts
    fetchPosts: () => Promise<void>   // API: GET /socs/api/v1/index/posts 
    fetchUserPosts: () => Promise<void> // API: GET /socs/api/v1/index/posts/user 
    fetchFavoritePosts: () => Promise<void>  // API: GET /socs/api/v1/index/posts/favorites 
    addPost: (content: string, image?: File) => Promise<void> // API: POST /socs/api/v1/index/posts 
    addComment: (postId: string, content: string) => Promise<void> // API: POST /socs/api/v1/index/posts/comments 
    addReply: (postId: string, commentId: string, content: string) => Promise<void> // API: POST /socs/api/v1/index/posts/comments/replies
    likePost: (postId: string) => Promise<void> // API: POST /socs/api/v1/index/posts/like
    favoritePost: (postId: string) => Promise<void> // API: POST /socs/api/v1/index/posts/favorite
    unlikePost: (postId: string) => Promise<void> // API: DELETE /socs/api/v1/index/posts/like
    unfavoritePost: (postId: string) => Promise<void> // API: DELETE /socs/api/v1/index/posts/favorite


}