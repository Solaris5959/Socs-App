/**
 * Complete Posts API Test Suite
 * 
 * Tests all 10 functions in posts.js:
 * - query_posts, query_user_posts, query_favourite_posts
 * - create_post, create_comment, create_reply
 * - like_post, favourite_post, unlike_post, unfavourite_post
 * 
 * Save as: backend\tests\posts-complete.test.js
 */

// Create mocks
const mockLogger = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn()
};

const mockSupabaseAdmin = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({ data: [], error: null })),
      match: jest.fn(() => ({ data: [], error: null }))
    })),
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(() => ({ data: {}, error: null }))
      }))
    })),
    delete: jest.fn(() => ({
      eq: jest.fn(() => ({
        eq: jest.fn(() => ({ error: null }))
      }))
    }))
  }))
};

const mockSupabase = {
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(() => ({ error: null })),
      getPublicUrl: jest.fn(() => ({ 
        data: { publicUrl: 'https://example.com/image.jpg' } 
      }))
    }))
  }
};

const mockUuidv4 = jest.fn(() => 'mock-uuid-123');

// Mock the modules with corrected paths and proper structure
jest.mock('../src/logger.js', () => mockLogger);
jest.mock('../src/lib/supabaseAdmin.js', () => mockSupabaseAdmin);
jest.mock('../src/lib/supabaseClient.js', () => mockSupabase);
jest.mock('uuid', () => ({ v4: mockUuidv4 }));

// Import the functions from the correct path
const {
  query_posts,
  query_user_posts,
  query_favourite_posts,
  create_post,
  create_comment,
  create_reply,
  like_post,
  favourite_post,
  unlike_post,
  unfavourite_post
} = require('../src/routes/posts.js');

// Test utilities
const createMockReq = (user = { id: 'user123' }, body = {}, file = null) => ({
  user,
  body,
  file
});

const createMockRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('Complete Posts API Test Suite', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ====== AUTHENTICATION TESTS ======
  describe('Authentication Tests - All Functions', () => {
    const testFunctions = [
      { name: 'query_posts', func: query_posts },
      { name: 'query_user_posts', func: query_user_posts },
      { name: 'query_favourite_posts', func: query_favourite_posts },
      { name: 'create_post', func: create_post },
      { name: 'create_comment', func: create_comment },
      { name: 'create_reply', func: create_reply },
      { name: 'like_post', func: like_post },
      { name: 'favourite_post', func: favourite_post },
      { name: 'unlike_post', func: unlike_post },
      { name: 'unfavourite_post', func: unfavourite_post }
    ];

    testFunctions.forEach(({ name, func }) => {
      it(`${name} should return 401 if user not authenticated`, async () => {
        const req = createMockReq(null); // No user
        const res = createMockRes();

        await func(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not authenticated' });
      });
    });
  });

  // ====== QUERY FUNCTIONS TESTS ======
  describe('query_posts', () => {
    it('should return all posts for authenticated user', async () => {
      const mockPosts = [
        { id: '1', content: 'Post 1', author_id: 'user1' },
        { id: '2', content: 'Post 2', author_id: 'user2' }
      ];
      
      mockSupabaseAdmin.from.mockReturnValue({
        select: jest.fn(() => ({ data: mockPosts, error: null }))
      });

      const req = createMockReq();
      const res = createMockRes();

      await query_posts(req, res);

      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith('posts');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPosts);
      expect(mockLogger.debug).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      const mockError = { message: 'Database connection failed' };
      mockSupabaseAdmin.from.mockReturnValue({
        select: jest.fn(() => ({ data: null, error: mockError }))
      });

      const req = createMockReq();
      const res = createMockRes();

      await query_posts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('query_user_posts', () => {
    it('should return posts for specific user only', async () => {
      const mockUserPosts = [
        { id: '1', content: 'My post', author_id: 'user123' }
      ];
      
      mockSupabaseAdmin.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({ data: mockUserPosts, error: null }))
        }))
      });

      const req = createMockReq();
      const res = createMockRes();

      await query_user_posts(req, res);

      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith('posts');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUserPosts);
    });

    it('should handle database errors', async () => {
      const mockError = { message: 'Database error' };
      mockSupabaseAdmin.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({ data: null, error: mockError }))
        }))
      });

      const req = createMockReq();
      const res = createMockRes();

      await query_user_posts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('query_favourite_posts', () => {
    it('should return favorite post IDs for user', async () => {
      const mockFavorites = [
        { post_id: 'post1' },
        { post_id: 'post2' }
      ];
      
      mockSupabaseAdmin.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({ data: mockFavorites, error: null }))
        }))
      });

      const req = createMockReq();
      const res = createMockRes();

      await query_favourite_posts(req, res);

      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith('post_favourites');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFavorites);
    });

    it('should handle database errors', async () => {
      const mockError = { message: 'Database error' };
      mockSupabaseAdmin.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({ data: null, error: mockError }))
        }))
      });

      const req = createMockReq();
      const res = createMockRes();

      await query_favourite_posts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  // ====== CREATE FUNCTIONS TESTS ======
  describe('create_post', () => {
    beforeEach(() => {
      mockSupabaseAdmin.from.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({ 
              data: {
                id: 'mock-uuid-123',
                content: 'Test content',
                author_id: 'user123',
                media_url: null
              }, 
              error: null 
            }))
          }))
        }))
      });
    });

    it('should create post with text content only', async () => {
      const req = createMockReq({ id: 'user123' }, { content: 'Hello world!' });
      const res = createMockRes();

      await create_post(req, res);

      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith('posts');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(mockUuidv4).toHaveBeenCalled();
    });

    it('should return 400 if content is missing', async () => {
      const req = createMockReq({ id: 'user123' }, {}); // No content
      const res = createMockRes();

      await create_post(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Content is required' });
    });

    it('should create post with image upload', async () => {
      const mockFile = {
        originalname: 'test.jpg',
        buffer: Buffer.from('fake-image-data'),
        mimetype: 'image/jpeg'
      };

      const req = createMockReq(
        { id: 'user123' }, 
        { content: 'Post with image' }, 
        mockFile
      );
      const res = createMockRes();

      await create_post(req, res);

      expect(mockSupabase.storage.from).toHaveBeenCalledWith('media-posts');
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle image upload failure', async () => {
      const mockFile = {
        originalname: 'test.jpg',
        buffer: Buffer.from('fake-image-data'),
        mimetype: 'image/jpeg'
      };

      mockSupabase.storage.from.mockReturnValue({
        upload: jest.fn(() => ({ error: { message: 'Upload failed' } }))
      });

      const req = createMockReq(
        { id: 'user123' }, 
        { content: 'Post with image' }, 
        mockFile
      );
      const res = createMockRes();

      await create_post(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Image upload failed' });
    });

    it('should handle database errors during post creation', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({ 
              data: null, 
              error: { message: 'Database error' } 
            }))
          }))
        }))
      });

      const req = createMockReq({ id: 'user123' }, { content: 'Hello world!' });
      const res = createMockRes();

      await create_post(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('create_comment', () => {
    it('should create comment successfully', async () => {
      const mockComment = {
        id: 'mock-uuid-123',
        post_id: 'post123',
        content: 'Great post!',
        author_id: 'user123'
      };

      mockSupabaseAdmin.from.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({ data: mockComment, error: null }))
          }))
        }))
      });

      const req = createMockReq(
        { id: 'user123' },
        { postId: 'post123', content: 'Great post!' }
      );
      const res = createMockRes();

      await create_comment(req, res);

      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith('comments');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockComment);
    });

    it('should return 400 if postId missing', async () => {
      const req = createMockReq(
        { id: 'user123' },
        { content: 'Great post!' } // Missing postId
      );
      const res = createMockRes();

      await create_comment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Post ID and content are required' 
      });
    });

    it('should return 400 if content missing', async () => {
      const req = createMockReq(
        { id: 'user123' },
        { postId: 'post123' } // Missing content
      );
      const res = createMockRes();

      await create_comment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Post ID and content are required' 
      });
    });

    it('should handle database errors', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({ 
              data: null, 
              error: { message: 'Database error' } 
            }))
          }))
        }))
      });

      const req = createMockReq(
        { id: 'user123' },
        { postId: 'post123', content: 'Great post!' }
      );
      const res = createMockRes();

      await create_comment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('create_reply', () => {
    it('should create reply successfully', async () => {
      const mockReply = {
        id: 'mock-uuid-123',
        comment_id: 'comment123',
        content: 'I agree!',
        author_id: 'user123'
      };

      mockSupabaseAdmin.from.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({ data: mockReply, error: null }))
          }))
        }))
      });

      const req = createMockReq(
        { id: 'user123' },
        { commentId: 'comment123', content: 'I agree!' }
      );
      const res = createMockRes();

      await create_reply(req, res);

      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith('comment_replies');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockReply);
    });

    it('should return 400 if commentId missing', async () => {
      const req = createMockReq(
        { id: 'user123' },
        { content: 'I agree!' } // Missing commentId
      );
      const res = createMockRes();

      await create_reply(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Comment ID and content are required' 
      });
    });

    it('should return 400 if content missing', async () => {
      const req = createMockReq(
        { id: 'user123' },
        { commentId: 'comment123' } // Missing content
      );
      const res = createMockRes();

      await create_reply(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Comment ID and content are required' 
      });
    });
  });

  // ====== LIKE/UNLIKE FUNCTIONS TESTS ======
  describe('like_post', () => {
    it('should like post successfully when not already liked', async () => {
      const mockLike = {
        post_id: 'post123',
        user_id: 'user123',
        created_at: expect.any(String)
      };

      // Mock no existing like first, then successful insert
      mockSupabaseAdmin.from
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            match: jest.fn(() => ({ data: [], error: null })) // No existing like
          }))
        })
        .mockReturnValueOnce({
          insert: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => ({ data: mockLike, error: null }))
            }))
          }))
        });

      const req = createMockReq({ id: 'user123' }, { postId: 'post123' });
      const res = createMockRes();

      await like_post(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockLike);
    });

    it('should return 409 if post already liked', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        select: jest.fn(() => ({
          match: jest.fn(() => ({ 
            data: [{ post_id: 'post123' }], // Existing like
            error: null 
          }))
        }))
      });

      const req = createMockReq({ id: 'user123' }, { postId: 'post123' });
      const res = createMockRes();

      await like_post(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: 'Post already liked' });
    });

    it('should return 400 if postId missing', async () => {
      const req = createMockReq({ id: 'user123' }, {}); // No postId
      const res = createMockRes();

      await like_post(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Post ID is required' });
    });
  });

  describe('unlike_post', () => {
    it('should return 400 if postId missing', async () => {
      const req = createMockReq({ id: 'user123' }, {}); // No postId
      const res = createMockRes();

      await unlike_post(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Post ID is required' });
    });

    it('should unlike post successfully', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        delete: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({ error: null }))
          }))
        }))
      });

      const req = createMockReq({ id: 'user123' }, { postId: 'post123' });
      const res = createMockRes();

      await unlike_post(req, res);

      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith('post_likes');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Post unliked' });
    });

    it('should handle database error during unlike', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        delete: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({ error: { message: 'Delete failed' } }))
          }))
        }))
      });

      const req = createMockReq({ id: 'user123' }, { postId: 'post123' });
      const res = createMockRes();

      await unlike_post(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });

    it('should work even if like doesnt exist (idempotent operation)', async () => {
      // This tests that unlike doesn't fail if the like doesn't exist
      mockSupabaseAdmin.from.mockReturnValue({
        delete: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({ error: null })) // No error even if nothing was deleted
          }))
        }))
      });

      const req = createMockReq({ id: 'user123' }, { postId: 'post123' });
      const res = createMockRes();

      await unlike_post(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Post unliked' });
    });
  });

  // ====== FAVOURITE/UNFAVOURITE FUNCTIONS TESTS ======
  describe('favourite_post', () => {
    it('should favorite post successfully when not already favorited', async () => {
      const mockFavorite = {
        post_id: 'post123',
        user_id: 'user123',
        favourited_at: expect.any(String)
      };

      // Mock no existing favorite first, then successful insert
      mockSupabaseAdmin.from
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            match: jest.fn(() => ({ data: [], error: null }))
          }))
        })
        .mockReturnValueOnce({
          insert: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => ({ data: mockFavorite, error: null }))
            }))
          }))
        });

      const req = createMockReq({ id: 'user123' }, { postId: 'post123' });
      const res = createMockRes();

      await favourite_post(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockFavorite);
    });

    it('should return 409 if post already favorited', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        select: jest.fn(() => ({
          match: jest.fn(() => ({ 
            data: [{ post_id: 'post123' }], // Existing favorite
            error: null 
          }))
        }))
      });

      const req = createMockReq({ id: 'user123' }, { postId: 'post123' });
      const res = createMockRes();

      await favourite_post(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: 'Post already favourited' });
    });

    it('should return 400 if postId missing', async () => {
      const req = createMockReq({ id: 'user123' }, {}); // No postId
      const res = createMockRes();

      await favourite_post(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Post ID is required' });
    });
  });

  describe('unfavourite_post', () => {
    it('should return 400 if postId missing', async () => {
      const req = createMockReq({ id: 'user123' }, {}); // No postId
      const res = createMockRes();

      await unfavourite_post(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Post ID is required' });
    });

    it('should unfavorite post successfully', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        delete: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({ error: null }))
          }))
        }))
      });

      const req = createMockReq({ id: 'user123' }, { postId: 'post123' });
      const res = createMockRes();

      await unfavourite_post(req, res);

      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith('post_favourites');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Post unfavourited' });
    });

    it('should handle database error during unfavorite', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        delete: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({ error: { message: 'Delete failed' } }))
          }))
        }))
      });

      const req = createMockReq({ id: 'user123' }, { postId: 'post123' });
      const res = createMockRes();

      await unfavourite_post(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });

    it('should work even if favorite doesnt exist (idempotent operation)', async () => {
      // This tests that unfavorite doesn't fail if the favorite doesn't exist
      mockSupabaseAdmin.from.mockReturnValue({
        delete: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({ error: null })) // No error even if nothing was deleted
          }))
        }))
      });

      const req = createMockReq({ id: 'user123' }, { postId: 'post123' });
      const res = createMockRes();

      await unfavourite_post(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Post unfavourited' });
    });
  });

  // ====== ERROR HANDLING TESTS ======
  describe('Unexpected Error Handling', () => {
    it('should handle database connection failures gracefully', async () => {
      // Simulate database connection failure by making supabase throw
      mockSupabaseAdmin.from.mockImplementation(() => {
        throw new Error('Database connection lost');
      });

      // Use valid request data so it reaches the database call
      const req = createMockReq({ id: 'user123' }, { content: 'Valid content' });
      const res = createMockRes();

      // Test query_posts (should hit database immediately)
      await query_posts(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });

      jest.clearAllMocks();

      // Test create_post (should hit database after validation passes)
      await create_post(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });

      jest.clearAllMocks();

      // Test like_post with valid data
      const likeReq = createMockReq({ id: 'user123' }, { postId: 'post123' });
      await like_post(likeReq, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });

    it('should handle malformed request data', async () => {
      // Test with missing required fields - these should return 400, not crash
      const res = createMockRes();

      // Test create_post with no content
      const reqNoContent = createMockReq({ id: 'user123' }, {});
      await create_post(reqNoContent, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Content is required' });

      jest.clearAllMocks();

      // Test like_post with no postId
      const reqNoPostId = createMockReq({ id: 'user123' }, {});
      await like_post(reqNoPostId, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Post ID is required' });

      jest.clearAllMocks();

      // Test create_comment with missing fields
      const reqMissingFields = createMockReq({ id: 'user123' }, { content: 'Comment' }); // Missing postId
      await create_comment(reqMissingFields, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Post ID and content are required' });
    });
  });
});