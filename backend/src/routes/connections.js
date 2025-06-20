import supabase from "../lib/supabaseClient.js";
import logger from "../logger.js";

export async function query_connections(req, res) {
  logger.debug("Fetching user connections");
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from("connections")
      .select("*")
      .or(`user_a.eq.${userId},user_b.eq.${userId}`);

    if (error) {
      logger.error({ error }, "Error fetching connections:");
      return res.status(500).json({ error: "Failed to fetch connections" });
    }

    res.status(200).json(data);
  } catch (err) {
    logger.error({ err }, "Unexpected error while fetching connections:");
    res.status(500).json({ err: "Failed to fetch connections" });
  }
}

export async function new_connection(req, res) {
  try {
    const userA = req.user.id;
    const userB = req.body.user_id;

    if (!userB || userA === userB) return res.status(400).json({ error: 'Invalid user_id' });

    const [lower, upper] = userA < userB ? [userA, userB] : [userB, userA];

    // Delete mutual follows if they exist
    await supabase
      .from('follows')
      .delete()
      .or(`follower_id.eq.${lower}&followed_id.eq.${upper},follower_id.eq.${upper}&followed_id.eq.${lower}`);

    // Insert connection
    const { error } = await supabase.from('connections').insert({ user_a: lower, user_b: upper });

    if (error) {
        logger.error({ error }, 'Error creating connection:');
        return res.status(500).json({ error: 'Failed to create connection' });
    }

    res.status(201).json({ message: 'Connection created' });
  } catch (err) {
    logger.error({ err }, 'Unexpected error while creating connection:');
    res.status(500).json({ err: 'Failed to create connection' });
  }
}

export async function delete_connection(req, res) {
  try {
    const userId = req.user.id;
    const otherId = req.params.id;
    const [lower, upper] = userId < otherId ? [userId, otherId] : [otherId, userId];

    const { error } = await supabase
      .from('connections')
      .delete()
      .match({ user_a: lower, user_b: upper });

    if (error) {
        logger.error({ error }, 'Error deleting connection:');
        return res.status(500).json({ error: 'Failed to delete connection' });
    }
    res.status(200).json({ message: 'Connection deleted' });
  } catch (err) {
    logger.error({ err }, 'Unexpected error while deleting connection:');
    res.status(500).json({ err: 'Failed to delete connection' });
  }
}

export async function query_connection_requests(req, res) {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('connection_requests')
      .select('*')
      .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);

    if (error) {
        logger.error({ error }, 'Error fetching connection requests:');
        return res.status(500).json({ error: 'Failed to fetch connection requests' });
    }

    res.status(200).json(data);
  } catch (err) {
    logger.error({ err }, 'Unexpected error while fetching connection requests:');
    res.status(500).json({ err: 'Failed to fetch connection requests' });
  }
}

export async function new_connection_request(req, res) {
  try {
    const requester = req.user.id;
    const recipient = req.body.user_id;

    if (!recipient || requester === recipient) return res.status(400).json({ error: 'Invalid recipient' });

    // Check if mutual follow exists
    const { data: followData } = await supabase
      .from('follows')
      .select('*')
      .or(`follower_id.eq.${requester}&followed_id.eq.${recipient},follower_id.eq.${recipient}&followed_id.eq.${requester}`);

    const followsRequester = followData?.some(f => f.follower_id === requester);
    const followsRecipient = followData?.some(f => f.follower_id === recipient);

    if (followsRequester && followsRecipient) {
      // Create connection immediately
      const [lower, upper] = requester < recipient ? [requester, recipient] : [recipient, requester];
      await supabase.from('follows').delete().or(`follower_id.eq.${requester}&followed_id.eq.${recipient},follower_id.eq.${recipient}&followed_id.eq.${requester}`);
      await supabase.from('connections').insert({ user_a: lower, user_b: upper });
      return res.status(201).json({ message: 'Mutual follow — connection established' });
    }

    // Otherwise, just create request
    const { error } = await supabase
      .from('connection_requests')
      .insert({ requester_id: requester, recipient_id: recipient });

    if (error) {
        logger.error({ error }, 'Error creating connection request:');
        return res.status(500).json({ error: 'Failed to create connection request' });
    }

    res.status(201).json({ message: 'Connection request sent' });
  } catch (err) {
    logger.error({ err }, 'Unexpected error while creating connection request:');
    res.status(500).json({ err: 'Failed to create connection request' });
  }
}

export async function delete_connection_request(req, res) {
  try {
    const userId = req.user.id;
    const otherId = req.params.id;

    const { error } = await supabase
      .from('connection_requests')
      .delete()
      .or(`requester_id.eq.${userId}&recipient_id.eq.${otherId},requester_id.eq.${otherId}&recipient_id.eq.${userId}`);

    if (error) {
        logger.error({ error }, 'Error deleting connection request:');
        return res.status(500).json({ error: 'Failed to delete connection request' });
    }

    res.status(200).json({ message: 'Connection request deleted' });
  } catch (err) {
    logger.error({ err }, 'Unexpected error while deleting connection request:');
    res.status(500).json({ err: 'Failed to delete connection request' });
  }
}

export async function query_followers(req, res) {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('follows')
      .select('*')
      .eq('followed_id', userId);

    if (error) {
        logger.error({ error }, 'Error fetching followers:');
        return res.status(500).json({ error: 'Failed to fetch followers' });
    }

    res.status(200).json(data);
  } catch (err) {
    logger.error({ err }, 'Unexpected error while fetching followers:');
    res.status(500).json({ err: 'Failed to fetch followers' });
  }
}

export async function query_following(req, res) {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', userId);

    if (error) {
        logger.error({ error }, 'Error fetching following list:');
        return res.status(500).json({ error: 'Failed to fetch following list' });
    }

    res.status(200).json(data);
  } catch (err) {
    logger.error({ err }, 'Unexpected error while fetching following list:');
    res.status(500).json({ err: 'Failed to fetch following list' });
  }
}

export async function new_follow(req, res) {
  try {
    const follower = req.user.id;
    const followed = req.body.user_id;

    if (!followed || follower === followed) return res.status(400).json({ error: 'Invalid follow target' });

    const { error } = await supabase
      .from('follows')
      .insert({ follower_id: follower, followed_id: followed });

    if (error) {
        logger.error({ error }, 'Error following user:');
        return res.status(500).json({ error: 'Failed to follow user' });
    }
    
    res.status(201).json({ message: 'Followed successfully' });
  } catch (err) {
    logger.error({ err }, 'Unexpected error while following user:');
    res.status(500).json({ err: 'Failed to follow user' });
  }
}

export async function delete_follow(req, res) {
  try {
    const follower = req.user.id;
    const followed = req.params.id;

    const { error } = await supabase
      .from('follows')
      .delete()
      .match({ follower_id: follower, followed_id: followed });

    if (error) {
        logger.error({ error }, 'Error unfollowing user:');
        return res.status(500).json({ error: 'Failed to unfollow user' });
    }
    res.status(200).json({ message: 'Unfollowed successfully' });
  } catch (err) {
    logger.error({ err }, 'Unexpected error while unfollowing user:');
    res.status(500).json({ err: 'Failed to unfollow user' });
  }
}
