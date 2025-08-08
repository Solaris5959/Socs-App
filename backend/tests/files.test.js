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

const request = require('supertest');

// Create mocks
const mockLogger = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn()
};

const mockSupabase = {
  storage: {
    from: jest.fn()
  },
  from: jest.fn(),
  rpc: jest.fn()
};

const mockSupabaseAdmin = {
  storage: {
    from: jest.fn()
  },
  rpc: jest.fn()
};

const mockUuid = {
  v4: jest.fn()
};

jest.mock('../src/logger.js', () => mockLogger);
jest.mock('../src/lib/supabaseClient.js', () => mockSupabase);
jest.mock('../src/lib/supabaseAdmin.js', () => mockSupabaseAdmin);
jest.mock('uuid', () => mockUuid);

// Mock the file management functions
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
    jest.clearAllMocks();
    
    // Mock UUID
    mockUuid.v4.mockReturnValue('mock-uuid-123');

    // Setup request and response mocks
    req = {
      user: { id: 'user123' },
      file: {
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('test file content')
      },
      files: {
        file: {
          originalname: 'test.pdf',
          mimetype: 'application/pdf',
          size: 1024,
          buffer: Buffer.from('test file content')
        }
      },
      params: {
        fileId: 'file123',
        groupId: 'group123'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Default storage mocks
    mockSupabaseAdmin.storage.from.mockReturnValue({
      upload: jest.fn().mockResolvedValue({
        data: { path: 'user123/mock-uuid-123' },
        error: null
      })
    });

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

      await uploadUserFile(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockMetadata);
      expect(mockLogger.debug).toHaveBeenCalledWith("uploadUserFile called");
    });

    it('should return 400 if user not authenticated', async () => {
      req.user = null;

      await uploadUserFile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing authentication or file' });
    });

    it('should return 400 if file is missing', async () => {
      req.file = null;

      await uploadUserFile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing authentication or file' });
    });

    it('should handle upload errors', async () => {
      mockSupabaseAdmin.storage.from.mockReturnValue({
        upload: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Upload failed' }
        })
      });

      await uploadUserFile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Cannot read properties of null (reading 'path')" });
    });

    it('should handle RPC errors', async () => {
      mockSupabaseAdmin.rpc.mockResolvedValue({
        data: null,
        error: { message: 'Database error' }
      });

      await uploadUserFile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });

    it('should handle unexpected errors', async () => {
      mockSupabaseAdmin.storage.from.mockImplementation(() => {
        throw new Error('Network error');
      });

      await uploadUserFile(req, res);

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