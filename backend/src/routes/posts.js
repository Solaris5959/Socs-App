import logger from '../logger.js'; 
import supabase from '../lib/supabaseClient.js'; 
import supabaseAdmin from '../lib/supabaseAdmin.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * GET /posts - Retrieves all posts from the platform
 * Returns all public posts regardless of author (like a public feed)
 * 
 * @param {Request} req - Express request object containing authenticated user
 * @param {Response} res - Express response object
 * @returns {Object} JSON array of all posts or error message
 */
export async function query_posts(req, res) {
  logger.debug("Authenticated user " + req.user);
  logger.debug("in GET posts, authenticated users only");

  try {
    // Check if user is authenticated - required for all endpoints
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    logger.debug("Fetching posts for user ID:" + req.user.id);

    // Fetch all posts from database (no filtering by author)
    // This creates a public feed where users can see everyone's posts
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select('*') // Select all columns from posts table

    logger.debug("Posts data:" + JSON.stringify(data));

    // Handle database errors
    if (error) {
      logger.debug('Error fetching posts:' + JSON.stringify(error));
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Return successful response with posts data
    return res.status(200).json(data);
  } catch (error) {
    // Handle unexpected errors (network issues, code errors, etc.)
    logger.debug('Unexpected error: ' + error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * GET /user/posts - Retrieves posts created by the authenticated user only
 * Returns a personal feed of the user's own posts
 * 
 * @param {Request} req - Express request object containing authenticated user
 * @param {Response} res - Express response object
 * @returns {Object} JSON array of user's posts or error message
 */
export async function query_user_posts(req, res) {
  logger.debug("Authenticated user " + req.user);
  logger.debug("in GET user posts, authenticated users only");

  try {
    // Authentication check
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    logger.debug("Fetching user posts for user ID:" + req.user.id);

    // Filter posts to only show those created by the current user
    // This creates a "My Posts" view for the user
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select('*')
      .eq('author_id', req.user.id); // Filter by author_id matching current user

    logger.debug("User posts data:" + JSON.stringify(data));

    if (error) {
      logger.debug('Error fetching user posts:' + JSON.stringify(error));
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(200).json(data);
  } catch (error) {
    logger.debug('Unexpected error: ' + error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * GET /favourites - Retrieves post IDs that the user has favourited
 * Note: This only returns post IDs, not the full post data, do we want full post data?
 * Frontend should use these IDs to fetch full post details if needed
 * 
 * @param {Request} req - Express request object containing authenticated user
 * @param {Response} res - Express response object
 * @returns {Object} JSON array of favourite post IDs or error message
 */
export async function query_favourite_posts(req, res) {
  logger.debug("Authenticated user " + req.user);
  logger.debug("in GET favourite posts, authenticated users only");

  try {
    // Authentication check
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    logger.debug("Fetching favourite posts for user ID:" + req.user.id);

    // Query the favourites junction table to get post IDs
    // This is a many-to-many relationship: users can favourite many posts
    const { data, error } = await supabaseAdmin
      .from('post_favourites')
      .select('post_id') // Only select post_id, not full post data
      .eq('user_id', req.user.id); // Filter by current user

    logger.debug("Favourite posts data:" + JSON.stringify(data));

    if (error) {
      logger.debug('Error fetching favourite posts:' + JSON.stringify(error));
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(200).json(data);
  } catch (error) {
    logger.debug('Unexpected error: ' + error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * POST /posts - Creates a new post with optional image upload
 * Handles both text-only posts and posts with media attachments
 * 
 * @param {Request} req - Express request object with body: { content } and optional file
 * @param {Response} res - Express response object
 * @returns {Object} JSON of created post or error message
 */
export async function create_post(req, res) {
  logger.debug("Authenticated user " + req.user);
  logger.debug("in POST create post, authenticated users only");

  try {
    // Authentication check
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Extract content from request body and file from multer middleware
    const { content } = req.body;
    const image = req.file; // Uploaded via multer middleware

    // Validate required content
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    let imageUrl = null;

    // Handle optional image upload to Supabase Storage
    if (image) {
      // Create unique filename to prevent conflicts
      const filename = `posts/${uuidv4()}-${image.originalname}`;
      
      // Upload image to Supabase Storage bucket
      const { error: uploadError } = await supabase.storage
        .from('media-posts') // Storage bucket name
        .upload(filename, image.buffer, { contentType: image.mimetype });

      // Handle upload failures
      if (uploadError) return res.status(500).json({ error: 'Image upload failed' });

      // Get public URL for the uploaded image
      const { data: publicUrl } = supabase.storage.from('media-posts').getPublicUrl(filename);
      imageUrl = publicUrl.publicUrl;
    }

    // Insert new post into database
    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert({
        id: uuidv4(), // Generate unique post ID
        author_id: req.user.id, // Link post to authenticated user
        content, // Post text content
        media_url: imageUrl, // URL of uploaded image (null if no image)
        visibility: 'public', // Default visibility setting
        created_at: new Date().toISOString() // Timestamp of creation
      })
      .select() // Return the inserted data
      .single(); // Expect only one row to be inserted

    if (error) {
      logger.debug('Error creating post:' + JSON.stringify(error));
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Return the newly created post
    return res.status(201).json(data);
  } catch (error) {
    logger.debug('Unexpected error: ' + error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * POST /comments - Creates a new comment on a specific post
 * 
 * @param {Request} req - Express request object with body: { postId, content }
 * @param {Response} res - Express response object
 * @returns {Object} JSON of created comment or error message
 */
export async function create_comment(req, res) {
  logger.debug("Authenticated user " + req.user);
  logger.debug("in POST create comment, authenticated users only");

  try {
    // Authentication check
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Extract required fields from request body
    const { postId, content } = req.body;

    // Validate required fields
    if (!postId || !content) {
      return res.status(400).json({ error: 'Post ID and content are required' });
    }

    // Insert comment into database
    const { data, error } = await supabaseAdmin
      .from('comments')
      .insert({
        id: uuidv4(), // Generate unique comment ID
        post_id: postId, // Link comment to specific post
        author_id: req.user.id, // Link comment to authenticated user
        content, // Comment text
        created_at: new Date().toISOString() // Timestamp
      })
      .select()
      .single();

    if (error) {
      logger.debug('Error creating comment:' + JSON.stringify(error));
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(201).json(data);
  } catch (error) {
    logger.debug('Unexpected error: ' + error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * POST /replies - Creates a reply to a specific comment
 * This creates threaded conversations (comment -> reply structure)
 * 
 * @param {Request} req - Express request object with body: { commentId, content }
 * @param {Response} res - Express response object
 * @returns {Object} JSON of created reply or error message
 */
export async function create_reply(req, res) {
  logger.debug("Authenticated user " + req.user);
  logger.debug("in POST create reply, authenticated users only");

  try {
    // Authentication check
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Extract required fields
    const { commentId, content } = req.body;

    // Validate required fields
    if (!commentId || !content) {
      return res.status(400).json({ error: 'Comment ID and content are required' });
    }

    // Insert reply into comment_replies table
    const { data, error } = await supabaseAdmin
      .from('comment_replies') // Separate table for replies to maintain hierarchy
      .insert({
        id: uuidv4(), // Generate unique reply ID
        comment_id: commentId, // Link reply to specific comment
        author_id: req.user.id, // Link reply to authenticated user
        content, // Reply text
        created_at: new Date().toISOString() // Timestamp
      })
      .select()
      .single();

    if (error) {
      logger.debug('Error creating reply:' + JSON.stringify(error));
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(201).json(data);
  } catch (error) {
    logger.debug('Unexpected error: ' + error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * POST /likes - Adds a like to a specific post
 * Prevents duplicate likes from the same user
 * 
 * @param {Request} req - Express request object with body: { postId }
 * @param {Response} res - Express response object
 * @returns {Object} JSON of created like record or error message
 */
export async function like_post(req, res) {
  logger.debug("Authenticated user " + req.user);
  logger.debug("in POST like post, authenticated users only");

  try {
    // Authentication check
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { postId } = req.body;

    // Validate required field
    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    // Check if user has already liked this post
    // This prevents duplicate likes from the same user
    const { data: existing } = await supabaseAdmin
      .from('post_likes')
      .select('post_id')
      .match({ post_id: postId, user_id: req.user.id });

    // If like already exists, return conflict error
    if (existing && existing.length > 0) {
      return res.status(409).json({ error: 'Post already liked' });
    }

    // Create new like record
    const { data, error } = await supabaseAdmin
      .from('post_likes')
      .insert({
        post_id: postId, // Link like to specific post
        user_id: req.user.id, // Link like to authenticated user
        created_at: new Date().toISOString() // Timestamp when like was created
      })
      .select()
      .single();

    if (error) {
      logger.debug('Error liking post:' + JSON.stringify(error));
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(201).json(data);
  } catch (error) {
    logger.debug('Unexpected error: ' + error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * POST /favourites - Adds a post to user's favourites list
 * Prevents duplicate favourites from the same user
 * 
 * @param {Request} req - Express request object with body: { postId }
 * @param {Response} res - Express response object
 * @returns {Object} JSON of created favourite record or error message
 */
export async function favourite_post(req, res) {
  logger.debug("Authenticated user " + req.user);
  logger.debug("in POST favourite post, authenticated users only");

  try {
    // Authentication check
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { postId } = req.body;

    // Validate required field
    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    // Check if user has already favourited this post
    const { data: existing } = await supabaseAdmin
      .from('post_favourites')
      .select('post_id')
      .match({ post_id: postId, user_id: req.user.id });

    // If favourite already exists, return conflict error
    if (existing && existing.length > 0) {
      return res.status(409).json({ error: 'Post already favourited' });
    }

    // Create new favourite record
    const { data, error } = await supabaseAdmin
      .from('post_favourites')
      .insert({
        post_id: postId, // Link favourite to specific post
        user_id: req.user.id, // Link favourite to authenticated user
        favourited_at: new Date().toISOString() // Timestamp when favourited
      })
      .select()
      .single();

    if (error) {
      logger.debug('Error favouriting post:' + JSON.stringify(error));
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(201).json(data);
  } catch (error) {
    logger.debug('Unexpected error: ' + error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * DELETE /likes - Removes a like from a specific post
 * Removes the like relationship between user and post
 * 
 * @param {Request} req - Express request object with body: { postId }
 * @param {Response} res - Express response object
 * @returns {Object} Success message or error message
 */
export async function unlike_post(req, res) {
  logger.debug("Authenticated user " + req.user);
  logger.debug("in DELETE unlike post, authenticated users only");

  try {
    // Authentication check
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { postId } = req.body;

    // Validate required field
    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    // Delete the like record that matches both post_id and user_id
    // This ensures users can only unlike their own likes
    const { error } = await supabaseAdmin
      .from('post_likes')
      .delete()
      .eq('post_id', postId) // Match specific post
      .eq('user_id', req.user.id); // Match current user

    if (error) {
      logger.debug('Error unliking post:' + JSON.stringify(error));
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Return success message (no data needed for deletion)
   return res.status(200).json({ message: 'Post unliked' });
  } catch (error) {
    logger.debug('Unexpected error: ' + error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * DELETE /favourites - Removes a post from user's favourites list
 * Removes the favourite relationship between user and post
 * 
 * @param {Request} req - Express request object with body: { postId }
 * @param {Response} res - Express response object
 * @returns {Object} Success message or error message
 */
export async function unfavourite_post(req, res) {
  logger.debug("Authenticated user " + req.user);
  logger.debug("in DELETE unfavourite post, authenticated users only");

  try {
    // Authentication check
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { postId } = req.body;

    // Validate required field
    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    // Delete the favourite record that matches both post_id and user_id
    // This ensures users can only unfavourite their own favourites
    const { error } = await supabaseAdmin
      .from('post_favourites')
      .delete()
      .eq('post_id', postId) // Match specific post
      .eq('user_id', req.user.id); // Match current user

    if (error) {
      logger.debug('Error unfavouriting post:' + JSON.stringify(error));
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Return success message
    return res.status(200).json({ message: 'Post unfavourited' });
  } catch (error) {
    logger.debug('Unexpected error: ' + error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}