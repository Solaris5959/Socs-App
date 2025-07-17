import supabase from "../lib/supabaseClient.js";
import logger from "../logger.js";

const SIGNED_URL_EXPIRATION = 60;

export async function uploadUserFile(req, res) {
  logger.debug("uploadUserFile called");

  try {
    const userId = req.user?.id;
    const file = req.files?.file;

    if (!userId || !file) {
      return res.status(400).json({ error: 'Missing authentication or file' });
    }

    // 1. Call RPC to create metadata and permissions
    const { data, error: rpcError } = await supabase
      .rpc('upload_user_file_metadata', {
        _original_filename: file.originalname,
        _file_type: file.mimetype,
        _size: file.size
      });

    if (rpcError) throw rpcError;
    const meta = data?.[0];

    // 2. Upload the actual file to Supabase Storage
    const { error: storageError } = await supabase
      .storage
      .from(meta.bucket)
      .upload(meta.storage_path, file.buffer, { contentType: meta.file_type, upsert: true });

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
    const { data, error: rpcError } = await supabase
      .rpc('upload_group_file_metadata', {
        _original_filename: file.originalname,
        _file_type: file.mimetype,
        _size: file.size,
        _group_id: groupId
      });

    if (rpcError) throw rpcError;
    const meta = data?.[0];

    // Upload the file to the group-files bucket
    const { error: storageError } = await supabase
      .storage
      .from(meta.bucket)
      .upload(meta.storage_path, file.buffer, { contentType: meta.file_type, upsert: true });

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

    const { data, error } = await supabase
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
    const { data: membership, error: mErr } = await supabase
      .from('group_memberships')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .single();

    if (mErr) throw mErr;
    if (!membership) return res.status(403).json({ error: 'Not a group member' });

    // Retrieve metadata
    const { data, error } = await supabase
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

export async function getUserFileUrl(req, res) {
  logger.debug("getUserFileUrl called");

  try {
    const userId = req.user?.id;
    const fileId = req.params.fileId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });
    if (!fileId) return res.status(400).json({ error: 'fileId required' });

    // Retrieve file metadata + ensure ownership
    const { data: file, error: metaErr } = await supabase
      .from('files')
      .select('bucket_id, path')
      .eq('id', fileId)
      .eq('uploaded_by', userId)
      .single();
    if (metaErr || !file) {
      return res.status(404).json({ error: 'File not found or access denied' });
    }

    const { data, error } = await supabase
      .storage
      .from(file.bucket_id)
      .createSignedUrl(file.path, SIGNED_URL_EXPIRATION);

    if (error) throw error;

    res.status(200).json({ url: data.signedUrl, expiresIn: SIGNED_URL_EXPIRATION });
  } catch (err) {
    logger.error('getUserFileUrl error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function getGroupFileUrl(req, res) {
  logger.debug("getGroupFileUrl called");

  try {
    const userId = req.user?.id;
    const { groupId, fileId } = req.params;
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });

    // Check group membership
    const { data: membership, error: memErr } = await supabase
      .from('group_memberships')
      .select('user_id')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .single();
    if (memErr || !membership) {
      return res.status(403).json({ error: 'Not a member of group' });
    }

    // Fetch file metadata
    const { data: file, error: metaErr } = await supabase
      .from('files')
      .select('bucket_id, path')
      .eq('id', fileId)
      .eq('group_id', groupId)
      .single();
    if (metaErr || !file) {
      return res.status(404).json({ error: 'File not found or access denied' });
    }

    const { data, error } = await supabase
        .storage
        .from(file.bucket_id)
        .createSignedUrl(file.path, SIGNED_URL_EXPIRATION);

    if (error) throw error;

    res.status(200).json({ url: data.signedUrl, expiresIn: SIGNED_URL_EXPIRATION });
  } catch (err) {
    logger.error('getGroupFileUrl error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteUserFile(req, res) {
  logger.debug("deleteUserFile called");

  try {
    const userId = req.user?.id;
    const fileId = req.params.fileId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });

    const { data: file, error: metaErr } = await supabase
      .from('files')
      .select('bucket_id, path')
      .eq('id', fileId)
      .eq('uploaded_by', userId)
      .single();

    if (metaErr || !file) {
      return res.status(404).json({ error: 'File not found or access denied' });
    }

    const { error: storageErr } = await supabase
      .storage
      .from(file.bucket_id)
      .remove([file.path]);

    if (storageErr) throw storageErr;

    const { error: rpcErr } = await supabase
      .rpc('delete_file_metadata_and_permissions', { _file_id: fileId });

    if (rpcErr) throw rpcErr;

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    logger.error('deleteUserFile error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteGroupFile(req, res) {
  logger.debug("deleteGroupFile called");

  try {
    const userId = req.user?.id;
    const { groupId, fileId } = req.params;
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });

    const { data: membership, error: memErr } = await supabase
      .from('group_memberships')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .single();

    if (memErr || !membership) {
      return res.status(403).json({ error: 'Not a group member' });
    }

    const { data: file, error: metaErr } = await supabase
      .from('files')
      .select('bucket_id, path')
      .eq('id', fileId)
      .eq('group_id', groupId)
      .single();

    if (metaErr || !file) {
      return res.status(404).json({ error: 'File not found or access denied' });
    }

    const { error: storageErr } = await supabase
      .storage
      .from(file.bucket_id)
      .remove([file.path]);

    if (storageErr) throw storageErr;

    const { error: rpcErr } = await supabase
      .rpc('delete_file_metadata_and_permissions', { _file_id: fileId });

    if (rpcErr) throw rpcErr;

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    logger.error('deleteGroupFile error:', err);
    res.status(500).json({ error: err.message });
  }
}
