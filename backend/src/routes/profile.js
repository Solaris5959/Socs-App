//File can include multiple methods just name it in index
import logger from '../logger.js'; //include to use logger 
import supabase from '../lib/supabaseClient.js';
import supabaseAdmin from '../lib/supabaseAdmin.js';
import { v4 as uuidv4 } from 'uuid';



// Method to query the user profile
export async function query_acc(req, res) {
  logger.debug("Authenticated user " + req.user);
  logger.debug("in GET profile,, authenticated users only");

  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    logger.debug("Fetching user profile for user ID:" + req.user.id);

    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    logger.debug("User profile data:" + JSON.stringify(data));

    if (error) {
      logger.debug('Error fetching user profile:' + JSON.stringify(error));
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(200).json(data);
  } catch (error) {
    logger.debug('Unexpected error: ' + error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


// Method to handle avatar upload for a new profile picture
export async function upload_avatar(req, res) {
  logger.debug("in POST profile avatar, authenticated users only");

  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate storage path
    const path = `${req.user.id}/${uuidv4()}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('avatars')
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      logger.debug('Error uploading avatar:', uploadError);
      return res.status(500).json({ error: 'Failed to upload to Supabase' });
    }

    // Fetch existing profile
    const { data: existingProfile, error: fetchError } = await supabaseAdmin
      .from('user_profiles')
      .select('profile_pic_url')
      .eq('user_id', req.user.id)
      .single();

    if (fetchError) {
      logger.debug("Failed to fetch existing profile:", fetchError);
      // Still proceed to update avatar
    }

    // Call function to delete old avatar if it exists
    deleteOldAvatar(existingProfile);

    // Get public URL for new avatar
    const { data: publicUrlData, error: publicUrlError } = supabaseAdmin.storage
      .from('avatars')
      .getPublicUrl(path);

    if (publicUrlError || !publicUrlData?.publicUrl) {
      logger.debug('Failed to generate public URL');
      return res.status(500).json({ error: 'Could not get public URL' });
    }

    // Update user_profiles with new avatar URL
    updateProfileWithAvatarUrl(req.user.id, publicUrlData.publicUrl);


    // Return the public URL of the new avatar
    res.status(200).json({ profile_pic_url: publicUrlData.publicUrl });

  } catch (err) {
    logger.debug('Unexpected error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}




// Method to update the user profile
export async function update_acc(req, res) { //the method 
  logger.debug("in PUT profile, authenticated users only")
  try {
    // Check if req.user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (Object.keys(req.body).length === 0){
      return res.status(422).json({error: 'Missing update body data'})
    }
    //if any of the fields not defined in body, updates as blank string
    // Note: 3 fileds are not updated here: 
    // - 'profile_pic_url' here, as it is handled in upload_avatar method
    // - 'visibility' as it defaults to "public" if not provided
    // - 'user_id' as users user as the foreign key reference to auth.users.id
    logger.info('Request body for update: ' + JSON.stringify(req.body));


    // Update the user profile in the database
    const { data, error } = await supabase
      .from('user_profiles')
      .update(req.body) // update fields from request body from frontend
      .eq('user_id', req.user.id)
      .select('*')
      .single()


    if (error) {
      logger.debug('Error updating user profile:' + JSON.stringify(error));
      return res.status(422).json({ error: error.message });
    } else {
      logger.debug("Succcess fully updated");
      res.status(200).json(data);
    }

  } catch (error) {
    // Handle any unexpected errors
    logger.debug('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


// Todo: Implement the following methods
export async function delete_acc(req, res) { //the method 
  logger.debug("in DEL profile, authenticated users only")
  try {
    // Check if req.user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(req.user.id)
    
    res.status(200).json("User is successfully deleted.");
    // see sample object return
    // user.id is response to reference the auth.users.id fk
  } catch (error) {
    // Handle any unexpected errors
    logger.debug('Error fetching user profile: ' + error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}




//////////////  Helper functions //////////

// Function to delete old avatar if it exists
async function deleteOldAvatar(existingProfile) {

  // Validate existingProfile
  if (existingProfile?.profile_pic_url) {
    const fullUrl = existingProfile.profile_pic_url;
    const bucketPathPrefix = '/storage/v1/object/public/';
    const pathIndex = fullUrl.indexOf(bucketPathPrefix);

    // Sanity check
    if (pathIndex === -1) {
      logger.debug("Invalid avatar URL format:", fullUrl);
      return res.status(400).json({ error: 'Invalid avatar URL format' });
    }

    // Extract existing path avatars/user_id/<filename>
    const existingPath = fullUrl.substring(pathIndex + bucketPathPrefix.length);

    // Get the folder and filename get everything after avatar/
    const existingUserFilePath = existingPath.substring(existingPath.indexOf('avatars/') + 'avatars/'.length);

    // Remove old avatar
    const { error: deleteError } = await supabaseAdmin.storage
      .from('avatars')
      .remove([existingUserFilePath]);

    if (deleteError) {
      logger.debug('Error deleting existing avatar:', deleteError);
      return res.status(500).json({ error: 'Failed to delete existing avatar' });
    }
  }
}


// Funtion to update the user profile with the new avatar URL
export async function updateProfileWithAvatarUrl(userId, avatarUrl) {

  // Check if userId and avatarUrl are provided
  const { error: updateError } = await supabaseAdmin
    .from('user_profiles')
    .update({ profile_pic_url: avatarUrl })
    .eq('user_id', userId);

  if (updateError) {
    logger.debug('Error updating profile_pic_url:', updateError);
    return res.status(500).json({ error: 'Failed to update profile picture URL' });
  }

  logger.debug("Avatar uploaded and updated successfully.");

}