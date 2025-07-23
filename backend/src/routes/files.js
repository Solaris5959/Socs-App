import supabase from "../lib/supabaseClient.js";
import supabaseAdmin from "../lib/supabaseAdmin.js";
import logger from "../logger.js";
import { v4 as uuidv4 } from 'uuid';

const SIGNED_URL_EXPIRATION = 60;


// Function to upload a file for a user
export async function uploadUserFile(req, res) {
  logger.debug("uploadUserFile called");

  try {

    // Get user ID and file from request
    const userId = req.user?.id;
    const file = req.file;

    // logging userId and file for debugging
    console.log("uploadUserFile - userId:", userId);
    console.log("uploadUserFile - file:", file);

    if (!userId || !file) {
      return res.status(400).json({ error: 'Missing authentication or file' });
    }


    // Create unique filename to prevent conflicts
    const path = `${req.user.id}/${uuidv4()}`;

    // Upload image to Supabase Storage bucket
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('user-files') // Storage bucket name
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    logger.debug("Upload new file: " + JSON.stringify(uploadData));

    // Log metadata values for debugging
    console.log('Metadata values:', {
      userId,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });


    // Get public URL for the uploaded image
    const { data: publicUrl } = supabase.storage.from('user-files').getPublicUrl(path);
    const filePath = publicUrl.publicUrl;

    // get file id from uploadData
    const fileId = uploadData.path.split('/').pop(); // Extract file ID from the

    // Create metadata in the database
    const { data, error: rpcError } = await supabaseAdmin.rpc('create_user_file_metadata_v2', {
      _user_id: userId,
      _file_id: fileId,
      _original_filename: file.originalname,
      _file_type: file.mimetype,
      _file_path: filePath,
      _size: file.size
    });

    if (rpcError) throw rpcError;
    const meta = data?.[0];


    // Handle upload failures
    if (uploadError) return res.status(500).json({ error: 'Image upload failed' });



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

// Function to get all files metadata for a user
export async function listUserFileMetadata(req, res) {
  logger.debug("Listing file metadata for user");

  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });

    // 1. Get all files uploaded by the user
    const { data: files, error } = await supabase
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


    if (error) throw error;

    // 2. Extract unique user IDs from files
    const userIds = [...new Set(files.map(file => file.uploaded_by))];

    // 3. Fetch user profile details
    const { data: userDetails, error: userError } = await supabase
      .from("user_profiles")
      .select("user_id, display_name, company, position")
      .in("user_id", userIds);

    if (userError) throw userError;

    // 4. Merge file and user profile data
    const filesWithUser = files.map(file => {
      const user = userDetails.find(u => u.user_id === file.uploaded_by);
      return {
        ...file,
        user_id: user.user_id,
        displayName: user.display_name,
        company: user.company,
        position: user.position,
      };
    });

    return res.status(200).json(filesWithUser);
  } catch (err) {
    logger.error('Error listing user file metadata:', err);
    return res.status(500).json({ error: err.message });
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

// Function to get a signed URL for a user's file - Download file
export async function getUserFileUrl(req, res) {
  logger.debug("getUserFileUrl called");

  try {
    const userId = req.user?.id;
    const fileId = req.params.fileId;

    if (!userId) return res.status(401).json({ error: 'User not authenticated' });
    if (!fileId) return res.status(400).json({ error: 'fileId required' });

    const bucketFilePath = `${userId}/${fileId}`;
    const expiresIn = 60 * 5; // URL expires in 5 minutes

    console.log("getUserFileUrl - userId:", userId);
    console.log("getUserFileUrl - fileId:", fileId);
    console.log("getUserFileUrl - bucketFilePath:", bucketFilePath);

    const { data, error } = await supabaseAdmin
      .storage
      .from('user-files')
      .createSignedUrl(bucketFilePath, expiresIn);

    console.log("getUserFileUrl - signedUrl data:", data);

    if (error || !data?.signedUrl) {
      console.error("Signed URL error:", error);
      return res.status(404).json({ error: 'File not found or unauthorized' });
    }

    return res.status(200).json({
      url: data.signedUrl,
      expiresIn
    });

  } catch (err) {
    logger.error('getUserFileUrl error:', err);
    return res.status(500).json({ error: err.message });
  }
}

// Function to get a signed URL for a group file
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


