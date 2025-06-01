//File can include multiple methods just name it in index
import logger from '../logger.js'; //include to use logger 
import supabase from '../lib/supabaseClient.js';
import supabaseAdmin from '../lib/supabaseAdmin.js';
import { v4 as uuidv4 } from 'uuid';

// Method to query the user profile
export async function query_acc(req, res) {
  logger.debug("Authenticated user ", req.user);
  logger.debug("in GET profile,, authenticated users only");

  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

   logger.debug("Fetching user profile for user ID:", req.user.id);

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    logger.debug("User profile data:", data);

    if (error) {
      logger.debug('Error fetching user profile:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(200).json(data);
  } catch (error) {
    logger.debug('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Method to handle avatar upload a new profile picture
export async function upload_avatar(req, res) {
  logger.debug("in POST profile avatar, authenticated users only");

  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get the uploaded file from the request
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }


    const path = `${req.user.id}/${uuidv4()}`;


    // Upload the file to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('avatars')
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      logger.debug('Error uploading avatar:' + JSON.stringify(error, null, 2));
      return res.status(500).json({ error: 'Failed to upload to Supabase' });
    }



    // Get the public URL of the uploaded avatar
    const updateUserImg = supabaseAdmin.storage
      .from('avatars')
      .getPublicUrl(path);

    // Log the details for debugging
    logger.debug("Public URL of the uploaded avatar:", updateUserImg.data.publicUrl);


    // Update image URL in user_profiles table
    await supabaseAdmin
      .from('user_profiles')
      .update({ profile_pic_url: updateUserImg.data.publicUrl })
      .eq('user_id', req.user.id);

    res.status(200).json({ profile_pic_url: updateUserImg.data.publicUrl });

  } catch (err) {
    logger.debug('Unexpected error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



// Todo: Implement the following methods
export async function update_acc(req, res) { //the method 
  logger.debug("in PUT profile, authenticated users only")
  try {
    // Check if req.user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }else if (req.body.display_name === undefined || req.body.email === undefined){
      logger.debug("Missing fields");
      return res.status(422).json({ error: 'Display_name or email fields missing for body' })
    }
    //if any of the fields not defined in body, updates as blank string
    const fields = {
        display_name : req.body.display_name,
        company: req.body.company !== undefined ? req.body.company : "",
        profile_pic_url: req.body.profile_pic_url !== undefined ? req.body.profile_pic_url: "",
        visibility: req.body.visibilitiy !== undefined ? req.body.visibilitiy : "public",
        email: req.body.email,
        first_name: req.body.firstName !== undefined ? req.body.firstName : "",
        last_name: req.body.lastName !== undefined ? req.body.lastName : "",
        position : req.body.position !== undefined ? req.body.position : "",
        phone_number : req.body.phone_number !== undefined ? req.body.phone_number : ""

    };

    const {data, error } = await supabase
      .from('user_profiles')
      .update(fields) 
      .eq('user_id', req.user.id)
      .single();


    res.status(204).json("Updated user profile");
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

    // Access the authenticated user from req.user
    logger.debug(req.user);
    res.status(200).json("Delete Profile under construction");
    // see sample object return
    // user.id is response to reference the auth.users.id fk
  } catch (error) {
    // Handle any unexpected errors
    logger.debug('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Todo: Implement the following methods
export async function query_posts(req, res) { //the method 
  logger.debug("in GET profile posts, authenticated users only")
  try {
    // Check if req.user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Access the authenticated user from req.user
    logger.debug(req.user);
    res.status(200).json("GET profile posts under construction");
    // see sample object return
    // user.id is response to reference the auth.users.id fk
  } catch (error) {
    // Handle any unexpected errors
    logger.debug('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}