/**
 * Complete Connections API Test Suite
 * 
 * Tests all 10 functions in connections.js:
 * - query_connections, query_connection_requests, query_followers, query_following
 * - new_connection, new_connection_request, new_follow
 * - delete_connection, delete_connection_request, delete_follow
 * 
 */

// Mock modules first
jest.mock('../src/logger.js');
jest.mock('../src/lib/supabaseClient.js');

// Import the functions from the correct path - update this to match your project structure
import {
  query_connections,
  new_connection,
  delete_connection,
  query_connection_requests,
  new_connection_request,
  delete_connection_request,
  query_followers,
  query_following,
  new_follow,
  delete_follow
} from '../src/routes/connections.js';

// Import and cast the mocked modules
import logger from '../src/logger.js';
import supabase from '../src/lib/supabaseClient.js';

const mockLogger = logger;
const mockSupabase = supabase;

// Setup mock implementations
beforeAll(() => {
  mockLogger.debug = jest.fn();
  mockLogger.error = jest.fn();
  mockLogger.info = jest.fn();
  mockLogger.warn = jest.fn();
  
  mockSupabase.from = jest.fn();
});

// Test utilities
const createMockReq = (user = { id: 'user123' }, body = {}, params = {}) => ({
  user,
  body,
  params
});

const createMockRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('Complete Connections API Test Suite', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ====== AUTHENTICATION TESTS ======
  describe('Authentication Tests - All Functions', () => {
    const testFunctions = [
      { name: 'query_connections', func: query_connections },
      { name: 'new_connection', func: new_connection },
      { name: 'delete_connection', func: delete_connection },
      { name: 'query_connection_requests', func: query_connection_requests },
      { name: 'new_connection_request', func: new_connection_request },
      { name: 'delete_connection_request', func: delete_connection_request },
      { name: 'query_followers', func: query_followers },
      { name: 'query_following', func: query_following },
      { name: 'new_follow', func: new_follow },
      { name: 'delete_follow', func: delete_follow }
    ];

    testFunctions.forEach(({ name, func }) => {
      it(`${name} should handle missing user authentication`, async () => {
        const req = createMockReq(null); // No user
        const res = createMockRes();

        await func(req, res);

        // Since the original code doesn't explicitly check authentication,
        // it would likely throw an error when accessing req.user.id
        // This test ensures graceful handling of missing user
        expect(res.status).toHaveBeenCalledWith(500);
      });
    });
  });

  // ====== QUERY FUNCTIONS TESTS ======
  describe('query_connections', () => {
    it('should return all user connections successfully', async () => {
      const mockConnections = [
        { id: 1, user_a: 'user123', user_b: 'user456', created_at: '2024-01-01' },
        { id: 2, user_a: 'user789', user_b: 'user123', created_at: '2024-01-02' }
      ];
      
      const mockSelectChain = {
        select: jest.fn(() => ({
          or: jest.fn(() => Promise.resolve({ data: mockConnections, error: null }))
        }))
      };
      mockSupabase.from.mockReturnValue(mockSelectChain);

      const req = createMockReq();
      const res = createMockRes();

      await query_connections(req, res);

      expect(mockSupabase.from).toHaveBeenCalledWith('connections');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockConnections);
      expect(mockLogger.debug).toHaveBeenCalledWith('Fetching user connections');
    });

    it('should handle database errors', async () => {
      const mockError = { message: 'Database connection failed' };
      const mockSelectChain = {
        select: jest.fn(() => ({
          or: jest.fn(() => Promise.resolve({ data: null, error: mockError }))
        }))
      };
      mockSupabase.from.mockReturnValue(mockSelectChain);

      const req = createMockReq();
      const res = createMockRes();

      await query_connections(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch connections' });
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should handle unexpected errors', async () => {
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Unexpected database error');
      });

      const req = createMockReq();
      const res = createMockRes();

      await query_connections(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ err: 'Failed to fetch connections' });
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('query_connection_requests', () => {
    it('should return all connection requests for user', async () => {
      const mockRequests = [
        { id: 1, requester_id: 'user123', recipient_id: 'user456', created_at: '2024-01-01' },
        { id: 2, requester_id: 'user789', recipient_id: 'user123', created_at: '2024-01-02' }
      ];
      
      const mockSelectChain = {
        select: jest.fn(() => ({
          or: jest.fn(() => Promise.resolve({ data: mockRequests, error: null }))
        }))
      };
      mockSupabase.from.mockReturnValue(mockSelectChain);

      const req = createMockReq();
      const res = createMockRes();

      await query_connection_requests(req, res);

      expect(mockSupabase.from).toHaveBeenCalledWith('connection_requests');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRequests);
    });

    it('should handle database errors', async () => {
      const mockError = { message: 'Database error' };
      const mockSelectChain = {
        select: jest.fn(() => ({
          or: jest.fn(() => Promise.resolve({ data: null, error: mockError }))
        }))
      };
      mockSupabase.from.mockReturnValue(mockSelectChain);

      const req = createMockReq();
      const res = createMockRes();

      await query_connection_requests(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch connection requests' });
    });
  });

  describe('query_followers', () => {
    it('should return followers list for user', async () => {
      const mockFollowers = [
        { id: 1, follower_id: 'user456', followed_id: 'user123', created_at: '2024-01-01' },
        { id: 2, follower_id: 'user789', followed_id: 'user123', created_at: '2024-01-02' }
      ];
      
      const mockSelectChain = {
        select: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: mockFollowers, error: null }))
        }))
      };
      mockSupabase.from.mockReturnValue(mockSelectChain);

      const req = createMockReq();
      const res = createMockRes();

      await query_followers(req, res);

      expect(mockSupabase.from).toHaveBeenCalledWith('follows');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFollowers);
    });

    it('should handle database errors', async () => {
      const mockError = { message: 'Database error' };
      const mockSelectChain = {
        select: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: null, error: mockError }))
        }))
      };
      mockSupabase.from.mockReturnValue(mockSelectChain);

      const req = createMockReq();
      const res = createMockRes();

      await query_followers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch followers' });
    });
  });

  describe('query_following', () => {
    it('should return following list for user', async () => {
      const mockFollowing = [
        { id: 1, follower_id: 'user123', followed_id: 'user456', created_at: '2024-01-01' },
        { id: 2, follower_id: 'user123', followed_id: 'user789', created_at: '2024-01-02' }
      ];
      
      const mockSelectChain = {
        select: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: mockFollowing, error: null }))
        }))
      };
      mockSupabase.from.mockReturnValue(mockSelectChain);

      const req = createMockReq();
      const res = createMockRes();

      await query_following(req, res);

      expect(mockSupabase.from).toHaveBeenCalledWith('follows');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFollowing);
    });
  });

  // ====== CREATE/NEW FUNCTIONS TESTS ======
  describe('new_connection', () => {
    it('should create new connection successfully', async () => {
      const mockDeleteChain = {
        delete: jest.fn(() => ({
          or: jest.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      };
      const mockInsertChain = {
        insert: jest.fn(() => Promise.resolve({ data: [], error: null }))
      };

      mockSupabase.from
        .mockReturnValueOnce(mockDeleteChain) // First call for deleting follows
        .mockReturnValueOnce(mockInsertChain); // Second call for inserting connection

      const req = createMockReq({ id: 'user123' }, { user_id: 'user456' });
      const res = createMockRes();

      await new_connection(req, res);

      expect(mockSupabase.from).toHaveBeenCalledWith('follows');
      expect(mockSupabase.from).toHaveBeenCalledWith('connections');
      expect(mockInsertChain.insert).toHaveBeenCalledWith({ user_a: 'user123', user_b: 'user456' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Connection created' });
    });

    it('should return 400 if user_id is missing', async () => {
      const req = createMockReq({ id: 'user123' }, {}); // No user_id
      const res = createMockRes();

      await new_connection(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid user_id' });
    });

    it('should return 400 if trying to connect to self', async () => {
      const req = createMockReq({ id: 'user123' }, { user_id: 'user123' }); // Same user
      const res = createMockRes();

      await new_connection(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid user_id' });
    });

    it('should order user IDs correctly (lower first)', async () => {
      const mockDeleteChain = {
        delete: jest.fn(() => ({
          or: jest.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      };
      const mockInsertChain = {
        insert: jest.fn(() => Promise.resolve({ data: [], error: null }))
      };

      mockSupabase.from
        .mockReturnValueOnce(mockDeleteChain)
        .mockReturnValueOnce(mockInsertChain);

      const req = createMockReq({ id: 'user999' }, { user_id: 'user111' }); // Higher ID to lower ID
      const res = createMockRes();

      await new_connection(req, res);

      expect(mockInsertChain.insert).toHaveBeenCalledWith({ user_a: 'user111', user_b: 'user999' });
    });

    it('should handle database error during connection creation', async () => {
      const mockDeleteChain = {
        delete: jest.fn(() => ({
          or: jest.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      };
      const mockInsertChain = {
        insert: jest.fn(() => Promise.resolve({ data: null, error: { message: 'Insert failed' } }))
      };

      mockSupabase.from
        .mockReturnValueOnce(mockDeleteChain)
        .mockReturnValueOnce(mockInsertChain);

      const req = createMockReq({ id: 'user123' }, { user_id: 'user456' });
      const res = createMockRes();

      await new_connection(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create connection' });
    });
  });

  describe('new_connection_request', () => {
    it('should create connection request when no mutual follow exists', async () => {
      const mockSelectChain = {
        select: jest.fn(() => ({
          or: jest.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      };
      const mockInsertChain = {
        insert: jest.fn(() => Promise.resolve({ data: [], error: null }))
      };

      mockSupabase.from
        .mockReturnValueOnce(mockSelectChain) // Check for follows
        .mockReturnValueOnce(mockInsertChain); // Insert request

      const req = createMockReq({ id: 'user123' }, { user_id: 'user456' });
      const res = createMockRes();

      await new_connection_request(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Connection request sent' });
    });

    it('should create immediate connection when mutual follows exist', async () => {
      const followData = [
        { follower_id: 'user123', followed_id: 'user456' },
        { follower_id: 'user456', followed_id: 'user123' }
      ];

      const mockSelectChain = {
        select: jest.fn(() => ({
          or: jest.fn(() => Promise.resolve({ data: followData, error: null }))
        }))
      };
      const mockDeleteChain = {
        delete: jest.fn(() => ({
          or: jest.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      };
      const mockInsertChain = {
        insert: jest.fn(() => Promise.resolve({ data: [], error: null }))
      };

      mockSupabase.from
        .mockReturnValueOnce(mockSelectChain) // Check for follows
        .mockReturnValueOnce(mockDeleteChain) // Delete follows
        .mockReturnValueOnce(mockInsertChain); // Insert connection

      const req = createMockReq({ id: 'user123' }, { user_id: 'user456' });
      const res = createMockRes();

      await new_connection_request(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Mutual follow — connection established' });
    });

    it('should return 400 if recipient is missing', async () => {
      const req = createMockReq({ id: 'user123' }, {}); // No user_id
      const res = createMockRes();

      await new_connection_request(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid recipient' });
    });

    it('should return 400 if trying to request connection to self', async () => {
      const req = createMockReq({ id: 'user123' }, { user_id: 'user123' }); // Same user
      const res = createMockRes();

      await new_connection_request(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid recipient' });
    });

    it('should handle database error during request creation', async () => {
      const mockSelectChain = {
        select: jest.fn(() => ({
          or: jest.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      };
      const mockInsertChain = {
        insert: jest.fn(() => Promise.resolve({ data: null, error: { message: 'Insert failed' } }))
      };

      mockSupabase.from
        .mockReturnValueOnce(mockSelectChain)
        .mockReturnValueOnce(mockInsertChain);

      const req = createMockReq({ id: 'user123' }, { user_id: 'user456' });
      const res = createMockRes();

      await new_connection_request(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create connection request' });
    });
  });

  describe('new_follow', () => {
    it('should create new follow successfully', async () => {
      const mockInsertChain = {
        insert: jest.fn(() => Promise.resolve({ data: [], error: null }))
      };
      mockSupabase.from.mockReturnValue(mockInsertChain);

      const req = createMockReq({ id: 'user123' }, { user_id: 'user456' });
      const res = createMockRes();

      await new_follow(req, res);

      expect(mockSupabase.from).toHaveBeenCalledWith('follows');
      expect(mockInsertChain.insert).toHaveBeenCalledWith({
        follower_id: 'user123',
        followed_id: 'user456'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Followed successfully' });
    });

    it('should return 400 if user_id is missing', async () => {
      const req = createMockReq({ id: 'user123' }, {}); // No user_id
      const res = createMockRes();

      await new_follow(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid follow target' });
    });

    it('should return 400 if trying to follow self', async () => {
      const req = createMockReq({ id: 'user123' }, { user_id: 'user123' }); // Same user
      const res = createMockRes();

      await new_follow(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid follow target' });
    });

    it('should handle database error during follow creation', async () => {
      const mockInsertChain = {
        insert: jest.fn(() => Promise.resolve({ data: null, error: { message: 'Insert failed' } }))
      };
      mockSupabase.from.mockReturnValue(mockInsertChain);

      const req = createMockReq({ id: 'user123' }, { user_id: 'user456' });
      const res = createMockRes();

      await new_follow(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to follow user' });
    });
  });

  // ====== DELETE FUNCTIONS TESTS ======
  describe('delete_connection', () => {
    it('should delete connection successfully', async () => {
      const mockDeleteChain = {
        delete: jest.fn(() => ({
          match: jest.fn(() => Promise.resolve({ error: null }))
        }))
      };
      mockSupabase.from.mockReturnValue(mockDeleteChain);

      const req = createMockReq({ id: 'user123' }, {}, { id: 'user456' });
      const res = createMockRes();

      await delete_connection(req, res);

      expect(mockSupabase.from).toHaveBeenCalledWith('connections');
      expect(mockDeleteChain.delete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Connection deleted' });
    });

    it('should handle database error during deletion', async () => {
      const mockDeleteChain = {
        delete: jest.fn(() => ({
          match: jest.fn(() => Promise.resolve({ error: { message: 'Delete failed' } }))
        }))
      };
      mockSupabase.from.mockReturnValue(mockDeleteChain);

      const req = createMockReq({ id: 'user123' }, {}, { id: 'user456' });
      const res = createMockRes();

      await delete_connection(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete connection' });
    });

    it('should work even if connection doesnt exist (idempotent operation)', async () => {
      const mockDeleteChain = {
        delete: jest.fn(() => ({
          match: jest.fn(() => Promise.resolve({ error: null })) // No error even if nothing was deleted
        }))
      };
      mockSupabase.from.mockReturnValue(mockDeleteChain);

      const req = createMockReq({ id: 'user123' }, {}, { id: 'user456' });
      const res = createMockRes();

      await delete_connection(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Connection deleted' });
    });
  });

  describe('delete_connection_request', () => {
    it('should delete connection request successfully', async () => {
      const mockDeleteChain = {
        delete: jest.fn(() => ({
          or: jest.fn(() => Promise.resolve({ error: null }))
        }))
      };
      mockSupabase.from.mockReturnValue(mockDeleteChain);

      const req = createMockReq({ id: 'user123' }, {}, { id: 'user456' });
      const res = createMockRes();

      await delete_connection_request(req, res);

      expect(mockSupabase.from).toHaveBeenCalledWith('connection_requests');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Connection request deleted' });
    });

    it('should handle database error during deletion', async () => {
      const mockDeleteChain = {
        delete: jest.fn(() => ({
          or: jest.fn(() => Promise.resolve({ error: { message: 'Delete failed' } }))
        }))
      };
      mockSupabase.from.mockReturnValue(mockDeleteChain);

      const req = createMockReq({ id: 'user123' }, {}, { id: 'user456' });
      const res = createMockRes();

      await delete_connection_request(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete connection request' });
    });
  });

  describe('delete_follow', () => {
    it('should unfollow user successfully', async () => {
      const mockDeleteChain = {
        delete: jest.fn(() => ({
          match: jest.fn(() => Promise.resolve({ error: null }))
        }))
      };
      mockSupabase.from.mockReturnValue(mockDeleteChain);

      const req = createMockReq({ id: 'user123' }, {}, { id: 'user456' });
      const res = createMockRes();

      await delete_follow(req, res);

      expect(mockSupabase.from).toHaveBeenCalledWith('follows');
      expect(mockDeleteChain.delete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unfollowed successfully' });
    });

    it('should handle database error during unfollow', async () => {
      const mockDeleteChain = {
        delete: jest.fn(() => ({
          match: jest.fn(() => Promise.resolve({ error: { message: 'Delete failed' } }))
        }))
      };
      mockSupabase.from.mockReturnValue(mockDeleteChain);

      const req = createMockReq({ id: 'user123' }, {}, { id: 'user456' });
      const res = createMockRes();

      await delete_follow(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to unfollow user' });
    });

    it('should work even if follow doesnt exist (idempotent operation)', async () => {
      const mockDeleteChain = {
        delete: jest.fn(() => ({
          match: jest.fn(() => Promise.resolve({ error: null })) // No error even if nothing was deleted
        }))
      };
      mockSupabase.from.mockReturnValue(mockDeleteChain);

      const req = createMockReq({ id: 'user123' }, {}, { id: 'user456' });
      const res = createMockRes();

      await delete_follow(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unfollowed successfully' });
    });
  });

  // ====== INTEGRATION SCENARIOS TESTS ======
  describe('Integration Scenarios', () => {
    describe('Mutual follow to connection flow', () => {
      it('should properly detect mutual follows and create connection', async () => {
        const followData = [
          { follower_id: 'user123', followed_id: 'user456' },
          { follower_id: 'user456', followed_id: 'user123' }
        ];

        const mockSelectChain = {
          select: jest.fn(() => ({
            or: jest.fn(() => Promise.resolve({ data: followData, error: null }))
          }))
        };
        const mockDeleteChain = {
          delete: jest.fn(() => ({
            or: jest.fn(() => Promise.resolve({ data: [], error: null }))
          }))
        };
        const mockInsertChain = {
          insert: jest.fn(() => Promise.resolve({ data: [], error: null }))
        };

        mockSupabase.from
          .mockReturnValueOnce(mockSelectChain) // Check for follows
          .mockReturnValueOnce(mockDeleteChain) // Delete follows  
          .mockReturnValueOnce(mockInsertChain); // Insert connection

        const req = createMockReq({ id: 'user123' }, { user_id: 'user456' });
        const res = createMockRes();

        await new_connection_request(req, res);

        // Verify the sequence of operations
        expect(mockSupabase.from).toHaveBeenNthCalledWith(1, 'follows'); // Check follows
        expect(mockSupabase.from).toHaveBeenNthCalledWith(2, 'follows'); // Delete follows
        expect(mockSupabase.from).toHaveBeenNthCalledWith(3, 'connections'); // Insert connection

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ 
          message: 'Mutual follow — connection established' 
        });
      });

      it('should handle partial mutual follows correctly', async () => {
        // Only one-way follow exists
        const followData = [
          { follower_id: 'user123', followed_id: 'user456' }
          // Missing the reverse follow
        ];

        const mockSelectChain = {
          select: jest.fn(() => ({
            or: jest.fn(() => Promise.resolve({ data: followData, error: null }))
          }))
        };
        const mockInsertChain = {
          insert: jest.fn(() => Promise.resolve({ data: [], error: null }))
        };

        mockSupabase.from
          .mockReturnValueOnce(mockSelectChain)
          .mockReturnValueOnce(mockInsertChain);

        const req = createMockReq({ id: 'user123' }, { user_id: 'user456' });
        const res = createMockRes();

        await new_connection_request(req, res);

        // Should create request, not immediate connection
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Connection request sent' });
      });
    });

    describe('User ID ordering consistency', () => {
      it('should maintain consistent ordering across different operations', async () => {
        const userA = 'user999'; // Higher ID
        const userB = 'user111'; // Lower ID
        
        const mockDeleteChain = {
          delete: jest.fn(() => ({
            or: jest.fn(() => Promise.resolve({ data: [], error: null }))
          }))
        };
        const mockInsertChain = {
          insert: jest.fn(() => Promise.resolve({ data: [], error: null }))
        };

        mockSupabase.from
          .mockReturnValueOnce(mockDeleteChain)
          .mockReturnValueOnce(mockInsertChain);

        const req = createMockReq({ id: userA }, { user_id: userB });
        const res = createMockRes();

        await new_connection(req, res);

        // Verify that lower ID comes first in the connection
        expect(mockInsertChain.insert).toHaveBeenCalledWith({ 
          user_a: userB, // Lower ID (user111)
          user_b: userA  // Higher ID (user999)
        });
      });

      it('should handle delete operations with correct ordering', async () => {
        const userA = 'user999'; // Higher ID
        const userB = 'user111'; // Lower ID

        const mockMatchFunction = jest.fn(() => Promise.resolve({ error: null }));
        const mockDeleteChain = {
          delete: jest.fn(() => ({
            match: mockMatchFunction
          }))
        };
        mockSupabase.from.mockReturnValue(mockDeleteChain);

        const req = createMockReq({ id: userA }, {}, { id: userB });
        const res = createMockRes();

        await delete_connection(req, res);

        // Verify that the match uses correct ordered IDs
        expect(mockMatchFunction).toHaveBeenCalledWith({ 
          user_a: userB, // Lower ID first
          user_b: userA  // Higher ID second
        });
      });
    });
  });

  // ====== ERROR HANDLING TESTS ======
  describe('Error Handling', () => {
    it('should handle database connection failures gracefully', async () => {
      // Simulate database connection failure
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Database connection lost');
      });

      const req = createMockReq({ id: 'user123' });
      const res = createMockRes();

      // Test query_connections (should hit database immediately)
      await query_connections(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ err: 'Failed to fetch connections' });

      jest.clearAllMocks();

      // Test new_connection with valid data
      const connectionReq = createMockReq({ id: 'user123' }, { user_id: 'user456' });
      await new_connection(connectionReq, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ err: 'Failed to create connection' });

      jest.clearAllMocks();

      // Test new_follow with valid data
      const followReq = createMockReq({ id: 'user123' }, { user_id: 'user456' });
      await new_follow(followReq, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ err: 'Failed to follow user' });
    });

    it('should handle malformed request data', async () => {
      const res = createMockRes();

      // Test new_connection with no user_id
      const reqNoUserId = createMockReq({ id: 'user123' }, {});
      await new_connection(reqNoUserId, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid user_id' });

      jest.clearAllMocks();

      // Test new_follow with no user_id
      const reqNoTarget = createMockReq({ id: 'user123' }, {});
      await new_follow(reqNoTarget, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid follow target' });

      jest.clearAllMocks();

      // Test new_connection_request with no recipient
      const reqNoRecipient = createMockReq({ id: 'user123' }, {});
      await new_connection_request(reqNoRecipient, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid recipient' });
    });

    it('should handle self-reference attempts', async () => {
      const res = createMockRes();

      // Test self-connection
      const selfConnectionReq = createMockReq({ id: 'user123' }, { user_id: 'user123' });
      await new_connection(selfConnectionReq, res);
      expect(res.status).toHaveBeenCalledWith(400);

      jest.clearAllMocks();

      // Test self-follow
      const selfFollowReq = createMockReq({ id: 'user123' }, { user_id: 'user123' });
      await new_follow(selfFollowReq, res);
      expect(res.status).toHaveBeenCalledWith(400);

      jest.clearAllMocks();

      // Test self-connection request
      const selfRequestReq = createMockReq({ id: 'user123' }, { user_id: 'user123' });
      await new_connection_request(selfRequestReq, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // ====== LOGGING TESTS ======
  describe('Logging Behavior', () => {
    it('should log appropriate debug messages', async () => {
      const mockSelectChain = {
        select: jest.fn(() => ({
          or: jest.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      };
      mockSupabase.from.mockReturnValue(mockSelectChain);

      const req = createMockReq();
      const res = createMockRes();

      await query_connections(req, res);

      expect(mockLogger.debug).toHaveBeenCalledWith('Fetching user connections');
      expect(mockLogger.debug).toHaveBeenCalledWith(`Fetching connections for user ID: ${req.user.id}`);
    });

    it('should log errors appropriately', async () => {
      const mockError = { message: 'Database error' };
      const mockSelectChain = {
        select: jest.fn(() => ({
          or: jest.fn(() => Promise.resolve({ data: null, error: mockError }))
        }))
      };
      mockSupabase.from.mockReturnValue(mockSelectChain);

      const req = createMockReq();
      const res = createMockRes();

      await query_connections(req, res);

      expect(mockLogger.error).toHaveBeenCalledWith({ error: mockError }, 'Error fetching connections:');
    });
  });
});