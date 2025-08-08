/**
 * File Management Routes Test Suite
 *
 * Tests all 8 file management functions:
 * - POST /uploadUserFile
 * - POST /uploadGroupFile
 * - GET /listUserFileMetadata
 * - GET /listGroupFileMetadata
 * - GET /getUserFileUrl
 * - GET /getGroupFileUrl
 * - DELETE /deleteUserFile
 * - DELETE /deleteGroupFile
 */

// Create mocks for all external dependencies
const mockLogger = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn()
};

// Mock Supabase client - handles regular database operations and storage
const mockSupabase = {
  storage: {
    from: jest.fn() // Mock storage bucket access
  },
  from: jest.fn(), // Mock database table access
  rpc: jest.fn()   // Mock remote procedure calls
};

// Mock Supabase admin client - handles admin-level operations
const mockSupabaseAdmin = {
  storage: {
    from: jest.fn() // Mock admin storage access
  },
  rpc: jest.fn() // Mock admin RPC calls
};

// Mock UUID generator for unique file IDs
const mockUuid = {
  v4: jest.fn()
};

// Replace real modules with our mocks when tests run
jest.mock('../src/logger.js', () => mockLogger);
jest.mock('../src/lib/supabaseClient.js', () => mockSupabase);
jest.mock('../src/lib/supabaseAdmin.js', () => mockSupabaseAdmin);
jest.mock('uuid', () => mockUuid);

// Import the actual functions we want to test
const {
  uploadUserFile,
  uploadGroupFile,
  listUserFileMetadata,
  listGroupFileMetadata,
  getUserFileUrl,
  getGroupFileUrl,
  deleteUserFile,
  deleteGroupFile
} = require('../src/routes/files.js');

describe('File Management Routes Test Suite', () => {
  let req, res;

  beforeEach(() => {
    // Clear all mock function calls and return values before each test
    jest.clearAllMocks();
    
    // Set up UUID to return a predictable value for testing
    mockUuid.v4.mockReturnValue('mock-uuid-123');

    // Create mock request and response objects that mimic Express.js
    req = {
      user: { id: 'user123' }, // Authenticated user
      file: { // Single file upload (req.file)
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('test file content')
      },
      files: { // Multiple file upload (req.files)
        file: {
          originalname: 'test.pdf',
          mimetype: 'application/pdf',
          size: 1024,
          buffer: Buffer.from('test file content')
        }
      },
      params: { // URL parameters
        fileId: 'file123',
        groupId: 'group123'
      }
    };

    // Mock Express response object with chainable methods
    res = {
      status: jest.fn().mockReturnThis(), // Returns 'this' for chaining
      json: jest.fn() // Sends JSON response
    };

    // Set up default successful storage upload mock
    mockSupabaseAdmin.storage.from.mockReturnValue({
      upload: jest.fn().mockResolvedValue({
        data: { path: 'user123/mock-uuid-123' }, // Successful upload path
        error: null
      })
    });

    // Set up default Supabase storage operations
    mockSupabase.storage.from.mockReturnValue({
      getPublicUrl: jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/file.pdf' }
      }),
      createSignedUrl: jest.fn().mockResolvedValue({
        data: { signedUrl: 'https://example.com/signed-url' },
        error: null
      }),
      upload: jest.fn().mockResolvedValue({ error: null }),
      remove: jest.fn().mockResolvedValue({ error: null })
    });
  });

  // ====== UPLOAD USER FILE TESTS ======
  describe('uploadUserFile', () => {
    it('should upload user file successfully', async () => {
      // Mock successful database metadata creation
      const mockMetadata = {
        file_id: 'file123',
        filename: 'test.pdf',
        file_type: 'application/pdf',
        size: 1024
      };

      mockSupabaseAdmin.rpc.mockResolvedValue({
        data: [mockMetadata],
        error: null
      });

      // Execute the function
      await uploadUserFile(req, res);

      // Verify successful response
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockMetadata);
      expect(mockLogger.debug).toHaveBeenCalledWith("uploadUserFile called");
    });

    it('should return 400 if user not authenticated', async () => {
      // Remove authentication from request
      req.user = null;

      await uploadUserFile(req, res);

      // Should reject with 400 status
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing authentication or file' });
    });

    it('should return 400 if file is missing', async () => {
      // Remove file from request
      req.file = null;

      await uploadUserFile(req, res);

      // Should reject with 400 status
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing authentication or file' });
    });

    it('should handle upload errors', async () => {
      // Mock storage upload failure
      mockSupabaseAdmin.storage.from.mockReturnValue({
        upload: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Upload failed' }
        })
      });

      await uploadUserFile(req, res);

      // Should handle the error properly
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Cannot read properties of null (reading 'path')" });
    });

    it('should handle RPC errors', async () => {
      // Mock database RPC failure
      mockSupabaseAdmin.rpc.mockResolvedValue({
        data: null,
        error: { message: 'Database error' }
      });

      await uploadUserFile(req, res);

      // Should handle database errors
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });

    it('should handle unexpected errors', async () => {
      // Mock unexpected network/system error
      mockSupabaseAdmin.storage.from.mockImplementation(() => {
        throw new Error('Network error');
      });

      await uploadUserFile(req, res);

      // Should catch and handle unexpected errors
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Network error' });
    });
  });

  // ====== UPLOAD GROUP FILE TESTS ======
  describe('uploadGroupFile', () => {
    it('should upload group file successfully', async () => {
      const mockMetadata = {
        file_id: 'file123',
        bucket: 'group-files',
        storage_path: 'group123/file123',
        file_type: 'application/pdf'
      };

      mockSupabase.rpc.mockResolvedValue({
        data: [mockMetadata],
        error: null
      });

      await uploadGroupFile(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockMetadata);
    });

    it('should return 400 if missing required fields', async () => {
      req.params.groupId = null;

      await uploadGroupFile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing authentication, file, or groupId' });
    });

    it('should handle RPC errors', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: null,
        error: { message: 'Permission denied' }
      });

      await uploadGroupFile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Permission denied' });
    });

    it('should handle storage errors', async () => {
      const mockMetadata = {
        file_id: 'file123',
        bucket: 'group-files',
        storage_path: 'group123/file123',
        file_type: 'application/pdf'
      };

      mockSupabase.rpc.mockResolvedValue({
        data: [mockMetadata],
        error: null
      });

      mockSupabase.storage.from.mockReturnValue({
        upload: jest.fn().mockResolvedValue({
          error: { message: 'Storage error' }
        })
      });

      await uploadGroupFile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Storage error' });
    });
  });

  // ====== LIST USER FILE METADATA TESTS ======
  describe('listUserFileMetadata', () => {
    it('should list user files successfully', async () => {
      // Mock database returning files and user data
      const mockFiles = [
        {
          id: 'file1',
          filename: 'test1.pdf',
          uploaded_by: 'user123'
        }
      ];

      const mockUsers = [
        {
          user_id: 'user123',
          display_name: 'Test User',
          company: 'Test Corp',
          position: 'Developer'
        }
      ];

      // First call returns files, second call returns user details
      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockResolvedValue({
            data: mockFiles,
            error: null
          })
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            in: jest.fn().mockResolvedValue({
              data: mockUsers,
              error: null
            })
          })
        });

      await listUserFileMetadata(req, res);

      // Should merge file and user data
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{
        ...mockFiles[0],
        user_id: 'user123',
        displayName: 'Test User',
        company: 'Test Corp',
        position: 'Developer'
      }]);
    });

    it('should return 401 if user not authenticated', async () => {
      req.user = null;

      await listUserFileMetadata(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not authenticated' });
    });

    it('should handle database errors', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' }
        })
      });

      await listUserFileMetadata(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  // ====== LIST GROUP FILE METADATA TESTS ======
  describe('listGroupFileMetadata', () => {
    it('should list group files successfully', async () => {
      const mockFiles = [
        {
          id: 'file1',
          filename: 'group-file.pdf',
          uploaded_by: 'user123'
        }
      ];

      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: { role: 'member' },
                  error: null
                })
              })
            })
          })
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: mockFiles,
              error: null
            })
          })
        });

      await listGroupFileMetadata(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFiles);
    });

    it('should return 401 if user not authenticated', async () => {
      req.user = null;

      await listGroupFileMetadata(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not authenticated' });
    });

    it('should return 400 if groupId missing', async () => {
      req.params.groupId = null;

      await listGroupFileMetadata(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing groupId' });
    });

    it('should return 403 if user not group member', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: null
              })
            })
          })
        })
      });

      await listGroupFileMetadata(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not a group member' });
    });
  });

  // ====== GET USER FILE URL TESTS ======
  describe('getUserFileUrl', () => {
    it('should get user file URL successfully', async () => {
      mockSupabaseAdmin.storage.from.mockReturnValue({
        createSignedUrl: jest.fn().mockResolvedValue({
          data: { signedUrl: 'https://example.com/signed-url' },
          error: null
        })
      });

      await getUserFileUrl(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        url: 'https://example.com/signed-url',
        expiresIn: 300
      });
    });

    it('should return 401 if user not authenticated', async () => {
      req.user = null;

      await getUserFileUrl(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not authenticated' });
    });

    it('should return 400 if fileId missing', async () => {
      req.params.fileId = null;

      await getUserFileUrl(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'fileId required' });
    });

    it('should return 404 if file not found', async () => {
      mockSupabaseAdmin.storage.from.mockReturnValue({
        createSignedUrl: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'File not found' }
        })
      });

      await getUserFileUrl(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'File not found or unauthorized' });
    });
  });

  // ====== GET GROUP FILE URL TESTS ======
  describe('getGroupFileUrl', () => {
    it('should get group file URL successfully', async () => {
      const mockFile = {
        bucket_id: 'group-files',
        path: 'group123/file123'
      };

      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: { user_id: 'user123' },
                  error: null
                })
              })
            })
          })
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: mockFile,
                  error: null
                })
              })
            })
          })
        });

      await getGroupFileUrl(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        url: 'https://example.com/signed-url',
        expiresIn: 60
      });
    });

    it('should return 403 if user not group member', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Not found' }
              })
            })
          })
        })
      });

      await getGroupFileUrl(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not a member of group' });
    });
  });

  // ====== DELETE USER FILE TESTS ======
  describe('deleteUserFile', () => {
    it('should delete user file successfully', async () => {
      const mockFile = {
        bucket_id: 'user-files',
        path: 'user123/file123'
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: mockFile,
                error: null
              })
            })
          })
        })
      });

      mockSupabase.rpc.mockResolvedValue({ error: null });

      await deleteUserFile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'File deleted successfully' });
    });

    it('should return 401 if user not authenticated', async () => {
      req.user = null;

      await deleteUserFile(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not authenticated' });
    });

    it('should return 404 if file not found', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Not found' }
              })
            })
          })
        })
      });

      await deleteUserFile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'File not found or access denied' });
    });
  });

  // ====== DELETE GROUP FILE TESTS ======
  describe('deleteGroupFile', () => {
    it('should delete group file successfully', async () => {
      const mockFile = {
        bucket_id: 'group-files',
        path: 'group123/file123'
      };

      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: { role: 'admin' },
                  error: null
                })
              })
            })
          })
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: mockFile,
                  error: null
                })
              })
            })
          })
        });

      mockSupabase.rpc.mockResolvedValue({ error: null });

      await deleteGroupFile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'File deleted successfully' });
    });

    it('should return 403 if user not group member', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Not found' }
              })
            })
          })
        })
      });

      await deleteGroupFile(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not a group member' });
    });

    it('should handle storage deletion errors', async () => {
      const mockFile = {
        bucket_id: 'group-files',
        path: 'group123/file123'
      };

      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: { role: 'admin' },
                  error: null
                })
              })
            })
          })
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: mockFile,
                  error: null
                })
              })
            })
          })
        });

      mockSupabase.storage.from.mockReturnValue({
        remove: jest.fn().mockResolvedValue({
          error: { message: 'Storage delete failed' }
        })
      });

      await deleteGroupFile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Storage delete failed' });
    });
  });
});