import supabase from "../lib/supabaseClient.js";
import logger from "../logger.js";

export async function uploadUserFile(req, res) {
  logger.debug("uploadUserFile called");

  try {
    const userId = req.user?.id;
    const file = req.files?.file;

    if (!userId || !file) {
      return res.status(400).json({ error: 'Missing authentication or file' });
    }

    // 1. Call RPC to create metadata and permissions
    const { data, error: rpcError } = await supabase(req.user.access_token)
      .rpc('upload_user_file_metadata', {
        _original_filename: file.originalname,
        _file_type: file.mimetype,
        _size: file.size
      });

    if (rpcError) throw rpcError;
    const meta = data?.[0];

    // 2. Upload the actual file to Supabase Storage
    const { error: storageError } = await supabase(req.user.access_token)
      .storage
      .from(meta.bucket)
      .upload(meta.storage_path, file.buffer, { contentType: meta.file_type });

    if (storageError) throw storageError;

    logger.debug('File uploaded successfully', { fileId: meta.file_id });
    res.status(201).json(meta);
  } catch (err) {
    logger.error('uploadUserFile error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function uploadGroupFile(req, res) {
  logger.debug("uploadGroupFile called");

  try {
    const userId = req.user?.id;
    const file = req.files?.file;
    const groupId = req.params.groupId;

    if (!userId || !file || !groupId) {
      return res.status(400).json({ error: 'Missing authentication, file, or groupId' });
    }

    // Call RPC to create metadata and permissions
    const { data, error: rpcError } = await supabase(req.user.access_token)
      .rpc('upload_group_file_metadata', {
        _original_filename: file.originalname,
        _file_type: file.mimetype,
        _size: file.size,
        _group_id: groupId
      });

    if (rpcError) throw rpcError;
    const meta = data?.[0];

    // Upload the file to the group-files bucket
    const { error: storageError } = await supabase(req.user.access_token)
      .storage
      .from(meta.bucket)
      .upload(meta.storage_path, file.buffer, { contentType: meta.file_type });

    if (storageError) throw storageError;

    logger.debug('Group file uploaded successfully', { fileId: meta.file_id, groupId });
    res.status(201).json(meta);
  } catch (err) {
    logger.error('uploadGroupFile error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function listUserFileMetadata(req, res) {
  logger.debug("Listing file metadata for user");

  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });

    const { data, error } = await supabase(req.user.access_token)
      .from('files')
      .select(`
        id,
        filename,
        file_type,
        size,
        uploaded_at,
        path
      `)
      .eq('uploaded_by', userId);

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    logger.error('Error listing user file metadata:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function listGroupFileMetadata(req, res) {
  logger.debug("Listing file metadata for group");

  try {
    const userId = req.user?.id;
    const groupId = req.params.groupId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });
    if (!groupId) return res.status(400).json({ error: 'Missing groupId' });

    // Verify membership
    const { data: membership, error: mErr } = await supabase(req.user.access_token)
      .from('group_memberships')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .single();

    if (mErr) throw mErr;
    if (!membership) return res.status(403).json({ error: 'Not a group member' });

    // Retrieve metadata
    const { data, error } = await supabase(req.user.access_token)
      .from('files')
      .select(`
        id,
        filename,
        file_type,
        size,
        uploaded_at,
        path,
        uploaded_by
      `)
      .eq('group_id', groupId);

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    logger.error('Error listing group file metadata:', err);
    res.status(500).json({ error: err.message });
  }
}
