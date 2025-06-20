//import express from 'express';
import supabase from '../lib/supabaseClient.js';
import logger from '../logger.js';

export async function get_base_dashboard(req, res) {
  logger.debug("Getting Base Dashboard, authenticated users only");

  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.id;
    const page = parseInt(req.query.page || "1");
    const pageSize = parseInt(req.query.page_size || "20");
    const offset = (page - 1) * pageSize;

    // Step 1: Get followed user IDs
    const { data: followedUsers, error: followsError } = await supabase
      .from('follows')
      .select('followed_id')
      .eq('follower_id', userId);

    if (followsError) {
      logger.debug("Error fetching follows:", followsError);
      return res.status(500).json({ error: 'Failed to fetch follows' });
    }

    const followedIds = followedUsers.map(f => f.followed_id);
    if (followedIds.length === 0) {
      return res.status(200).json({ posts: [] });
    }

    // Step 2: Get posts from followed users WITH counts
    const { data: posts, error: postsError } = await supabase
      .rpc('get_dashboard_posts_with_counts', {
        followed_ids: followedIds,
        limit_num: pageSize,
        offset_num: offset
      });

    if (postsError) {
      logger.debug("Error fetching posts:", postsError);
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }

    return res.status(200).json({ posts });

  } catch (error) {
    logger.debug('Error fetching dashboard:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


export async function get_user_posts_dashboard(req, res) {
  logger.debug("Getting User Posts Dashboard, authenticated users only");
  try {
    // Check if req.user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.id;
    const page = parseInt(req.query.page || "1");
    const pageSize = parseInt(req.query.page_size || "20");
    const offset = (page - 1) * pageSize;
    
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      logger.debug("Error fetching user posts:", error);
      return res.status(500).json({ error: 'Failed to fetch user posts' });
    }
    if (!posts || posts.length === 0) {
      logger.debug("No posts found for user:", userId);
      return res.status(200).json({ posts: [] });
    }

    // Return the posts for the authenticated user
    res.status(200).json({ posts });
  } catch (error) {
    // Handle any unexpected errors
    logger.debug('Error fetching user posts dashboard:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function get_favorite_posts_dashboard(req, res) {
  logger.debug("Getting Favorite Posts Dashboard, authenticated users only");
  try {
    // Check if req.user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // const userId = req.user.id;
    // const page = parseInt(req.query.page || "1");
    // const pageSize = parseInt(req.query.page_size || "20");
    // const offset = (page - 1) * pageSize;



    res.status(200).json("Favorite posts dashboard under construction...");
  } catch (error) {
    // Handle any unexpected errors
    logger.debug('Error fetching favorite posts dashboard:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
