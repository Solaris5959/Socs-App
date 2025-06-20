//import express from 'express';
import supabase from '../lib/supabaseClient.js';
import logger from '../logger.js';

export async function get_basic_dashboard(req, res) {
  logger.debug("Fetching Basic Dashboard");

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;

    logger.debug(`Fetching dashboard posts for user ${req.user.id} with limit ${limit} and offset ${offset}`);

    const { data, error } = await supabase
      .rpc('get_base_dashboard', {
        limit_num: limit,
        offset_num: offset,
      });

    if (error) {
      logger.error({ error }, 'Error fetching base dashboard:');
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }

    return res.status(200).json(data);
  } catch (err) {
    logger.error({ err }, 'Unexpected error:');
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function get_user_dashboard(req, res) {
  logger.debug("Fetching 'My Posts' dashboard");

  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Parse pagination parameters from query string
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;

    logger.debug(`Fetching posts for user ${req.user.id} with limit ${limit} and offset ${offset}`);

    // Call the Supabase RPC
    const { data, error } = await supabase
      .rpc('get_my_posts', {
        limit_num: limit,
        offset_num: offset
      });

    if (error) {
      logger.error({ error }, 'Error fetching my posts dashboard:');
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }

    return res.status(200).json(data);
  } catch (err) {
    logger.error({ err }, 'Unexpected error:');
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function get_favorite_dashboard(req, res) {
  logger.debug("Fetching Favorites Dashboard");

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;

    logger.debug(`Fetching favorited posts for user ${req.user.id} with limit ${limit} and offset ${offset}`);

    const { data, error } = await supabase
      .rpc('get_favourites_dashboard', {
        limit_num: limit,
        offset_num: offset,
      });

    if (error) {
      logger.error({error}, 'Error fetching favorites dashboard:');
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }

    return res.status(200).json(data);
  } catch (err) {
    logger.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
