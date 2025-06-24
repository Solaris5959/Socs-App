import supabase from "../lib/supabaseClient.js";
import logger from "../logger.js";


// Returns all active connections for the current user.
export async function query_connections(req, res) {
  logger.debug("Fetching user connections");

  try {
    const userId = req.user.id;

    logger.debug(`Fetching connections for user ID: ${userId}`);

    // Get connections where user is either user_a or user_b
    const { data, error } = await supabase
      .from("connections")
      .select("user_a, user_b, connected_at")
      .or(`user_a.eq.${userId},user_b.eq.${userId}`);

    logger.debug({ data, error }, "Fetched connections data");

    if (error) {
      logger.error({ error }, "Error fetching connections:");
      return res.status(500).json({ error: "Failed to fetch connections" });
    }

    // Added: Normalize the other user's ID
    const connectedUserIds = data.map((conn) => {
      return conn.user_a === userId ? conn.user_b : conn.user_a;
    });


    // Added: Get user details for connected users and store them in an array
    const { data: userDetails } = await supabase
      .from("user_profiles")
      .select("user_id, display_name, company, position, profile_pic_url, is_online")
      .in("user_id", connectedUserIds);



    //  Profile details for connected users
    logger.debug({ userDetails, error }, "Connection details for connected users");

    res.status(200).json(userDetails);

  } catch (err) {
    logger.error({ err }, "Unexpected error while fetching connections:");
    res.status(500).json({ err: "Failed to fetch connections" });
  }
}



// Returns all users the current user is NOT connected with and not in 
// pending requests (sent or received)
export async function query_potential_connections(req, res) {
  logger.debug("Fetching potential connections");

  try {
    const userId = req.user.id;

    // Step 1: Fetch all current connections
    const { data: connections, error: connectionsError } = await supabase
      .from("connections")
      .select("user_a, user_b")
      .or(`user_a.eq.${userId},user_b.eq.${userId}`);

    if (connectionsError) {
      logger.error({ connectionsError }, "Error fetching existing connections");
      return res.status(500).json({ error: "Failed to fetch connections" });
    }

    // Extract connected user IDs
    const connectedUserIds = connections.map(conn =>
      conn.user_a === userId ? conn.user_b : conn.user_a
    );
    connectedUserIds.push(userId); // Exclude self

    // Step 2: Fetch all users not already connected
    const { data: potentialUsers, error: usersError } = await supabase
      .from("user_profiles")
      .select("user_id, display_name, company, position, profile_pic_url, is_online")
      .not("user_id", "in", `(${connectedUserIds.join(",")})`);

    if (usersError) {
      logger.error({ usersError }, "Error fetching potential users");
      return res.status(500).json({ error: "Failed to fetch potential connections" });
    }

    // Step 3: Fetch connection requests (both sent and received)
    const { data: connectionRequests, error: requestsError } = await supabase
      .from("connection_requests")
      .select("requester_id, recipient_id")
      .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);

    if (requestsError) {
      logger.error({ requestsError }, "Error fetching connection requests");
      return res.status(500).json({ error: "Failed to fetch connection requests" });
    }

    // Build sets for fast lookup
    const sentRequestIds = new Set(
      connectionRequests.filter(r => r.requester_id === userId).map(r => r.recipient_id)
    );
    const receivedRequestIds = new Set(
      connectionRequests.filter(r => r.recipient_id === userId).map(r => r.requester_id)
    );

    // Step 4: Exclude users who sent a request to the current user
    // Also mark if the current user already sent a request to them
    const enrichedUsers = potentialUsers
      .filter(user => !receivedRequestIds.has(user.user_id)) // Exclude users who sent a request
      .map(user => ({
        ...user,
        is_requested: sentRequestIds.has(user.user_id),
      }));

    logger.debug({ enrichedUsers }, "Fetched enriched potential connections");
    return res.status(200).json(enrichedUsers);

  } catch (err) {
    logger.error({ err }, "Unexpected error while fetching potential connections");
    return res.status(500).json({ error: "Unexpected failure" });
  }
}

// Creates a new connection between two users. - Accepts user IDs in the connection request.
export async function new_connection(req, res) {
  logger.debug("Creating new connection");

  try {
    const userA = req.user.id;
    const userB = req.params.id;

    console.log("Sender:", userA);
    console.log("Reciver:", userB);

    if (!userB || userA === userB)
      return res.status(400).json({ error: "Invalid user_id" });

    logger.debug(`Creating connection between user A: ${userA} and user B: ${userB}`);

    const [lower, upper] = userA < userB ? [userA, userB] : [userB, userA];

    // Delete mutual follows if they exist
    const { error: deleteFollow } = await supabase
      .from("follows")
      .delete()
      .or(
        `and(follower_id.eq.${lower},followed_id.eq.${upper}),and(follower_id.eq.${upper},followed_id.eq.${lower})`
      )

    if (deleteFollow) {
      logger.error({ deleteFollow }, "Error deleting mutual follows:");
      return res.status(500).json({ error: "Failed to delete mutual follows" });
    }

    // * Added - Delete any existing connection requests between these users
    const { error: deleteRequestError } = await supabase
      .from("connection_requests")
      .delete()
      .or(
        `and(requester_id.eq.${userA},recipient_id.eq.${userB}),and(requester_id.eq.${userB},recipient_id.eq.${userA})`
      );

    if (deleteRequestError) {
      logger.error({ deleteRequestError }, "Error deleting existing connection requests:");
      return res.status(500).json({ error: "Failed to delete existing connection requests" });
    }

    // Insert connection
    const { error } = await supabase
      .from("connections")
      .insert({ user_a: lower, user_b: upper });

    if (error) {
      logger.error({ error }, "Error creating connection:");
      return res.status(500).json({ error: "Failed to create connection" });
    }

    res.status(201).json({ message: "Connection created" });
  } catch (err) {
    logger.error({ err }, "Unexpected error while creating connection:");
    res.status(500).json({ err: "Failed to create connection" });
  }
}


// Deletes a connection between two users - Remove connection 
export async function delete_connection(req, res) {
  logger.debug("Deleting connection");

  try {
    const userId = req.user.id;
    const otherId = req.params.id;
    const [lower, upper] =
      userId < otherId ? [userId, otherId] : [otherId, userId];

    logger.debug(`Deleting connection between user A: ${lower} and user B: ${upper}`);

    const { error } = await supabase
      .from("connections")
      .delete()
      .match({ user_a: lower, user_b: upper });

    if (error) {
      logger.error({ error }, "Error deleting connection:");
      return res.status(500).json({ error: "Failed to delete connection" });
    }
    res.status(200).json({ message: "Connection deleted" });
  } catch (err) {
    logger.error({ err }, "Unexpected error while deleting connection:");
    res.status(500).json({ err: "Failed to delete connection" });
  }
}

// Returns all connection requests where the current user is the recipient
export async function query_connection_requests(req, res) {
  logger.debug("Fetching connection requests");

  try {
    const userId = req.user.id;

    logger.debug(`Fetching connection requests for user ID: ${userId}`);

    // Step 1: Only fetch requests where the current user is the recipient
    const { data, error } = await supabase
      .from("connection_requests")
      .select("*")
      .eq("recipient_id", userId);  // Only get requests sent *to* this user

    if (error) {
      logger.error({ error }, "Error fetching connection requests:");
      return res
        .status(500)
        .json({ error: "Failed to fetch connection requests" });
    }

    if (!data || data.length === 0) {
      return res.status(200).json([]); // No pending requests
    }

    // Step 2: Get the user info of all requesters
    const requesterIds = data.map(req => req.requester_id);

    const { data: userDetails, error: userError } = await supabase
      .from("user_profiles")
      .select("user_id, display_name, company, position, profile_pic_url, is_online")
      .in("user_id", requesterIds);

    if (userError) {
      logger.error({ userError }, "Error fetching user profiles for connection requests");
      return res.status(500).json({ error: "Failed to fetch requester profiles" });
    }

    res.status(200).json(userDetails);
  } catch (err) {
    logger.error({ err }, "Unexpected error while fetching connection requests:");
    res.status(500).json({ err: "Failed to fetch connection requests" });
  }
}
// Creates a new connection request between two users. - Send connection request
export async function new_connection_request(req, res) {
  logger.debug("Creating new connection request");

  try {
    const requester = req.user.id;
    const recipient = req.body.user_id;

    console.log("Requester ID:", requester);
    console.log("Recipient ID:", recipient);

    if (!recipient || requester === recipient)
      return res.status(400).json({ error: "Invalid recipient" });

    logger.debug(`Creating connection request from user ID: ${requester} to recipient ID: ${recipient}`);

    // Check if mutual follow exists
    const { data: followData } = await supabase
      .from("follows")
      .select("*")
      .or(
        `follower_id.eq.${requester}&followed_id.eq.${recipient},follower_id.eq.${recipient}&followed_id.eq.${requester}`
      );

    logger.debug({ followData }, "Fetched follow data for mutual follow check");

    const followsRequester = followData?.some(
      (f) => f.follower_id === requester
    );
    const followsRecipient = followData?.some(
      (f) => f.follower_id === recipient
    );

    // If A follows B AND B follows A
    if (followsRequester && followsRecipient) {
      // Create connection immediately
      const [lower, upper] =
        requester < recipient ? [requester, recipient] : [recipient, requester];
      await supabase
        .from("follows")
        .delete()
        .or(
          `follower_id.eq.${requester}&followed_id.eq.${recipient},follower_id.eq.${recipient}&followed_id.eq.${requester}`
        );
      await supabase
        .from("connections")
        .insert({ user_a: lower, user_b: upper });
      return res
        .status(201)
        .json({ message: "Mutual follow — connection established" });
    }

    // Otherwise, just create request
    const { error } = await supabase
      .from("connection_requests")
      .insert({ requester_id: requester, recipient_id: recipient });

    if (error) {
      logger.error({ error }, "Error creating connection request:");
      return res
        .status(500)
        .json({ error: "Failed to create connection request" });
    }

    res.status(201).json({ message: "Connection request sent" });
  } catch (err) {
    logger.error(
      { err },
      "Unexpected error while creating connection request:"
    );
    res.status(500).json({ err: "Failed to create connection request" });
  }
}



// Function to delete a connection request - Delete connection request
export async function delete_connection_request(req, res) {
  logger.debug("Deleting connection request");

  try {
    const userId = req.user.id;
    const otherId = req.params.id;

    logger.debug(`Deleting connection request for user ID: ${userId} and other ID: ${otherId}`);

    // Ensure the request is valid
    const { error } = await supabase
      .from("connection_requests")
      .delete()
      .or(
        `and(requester_id.eq.${userId},recipient_id.eq.${otherId}),and(requester_id.eq.${otherId},recipient_id.eq.${userId})`
      );

    if (error) {
      logger.error({ error }, "Error deleting connection request:");
      return res
        .status(500)
        .json({ error: "Failed to delete connection request" });
    }

    res.status(200).json({ message: "Connection request deleted" });
  } catch (err) {
    logger.error(
      { err },
      "Unexpected error while deleting connection request:"
    );
    res.status(500).json({ err: "Failed to delete connection request" });
  }
}

export async function query_followers(req, res) {
  logger.debug("Fetching followers list");

  try {
    const userId = req.user.id;

    logger.debug(`Fetching followers for user ID: ${userId}`);

    const { data, error } = await supabase
      .from("follows")
      .select("*")
      .eq("followed_id", userId);

    logger.debug({ data, error }, "Fetched followers data");

    if (error) {
      logger.error({ error }, "Error fetching followers:");
      return res.status(500).json({ error: "Failed to fetch followers" });
    }

    res.status(200).json(data);
  } catch (err) {
    logger.error({ err }, "Unexpected error while fetching followers:");
    res.status(500).json({ err: "Failed to fetch followers" });
  }
}

export async function query_following(req, res) {
  logger.debug("Fetching following list");

  try {
    const userId = req.user.id;

    logger.debug(`Fetching following for user ID: ${userId}`);

    const { data, error } = await supabase
      .from("follows")
      .select("*")
      .eq("follower_id", userId);

    logger.debug({ data, error }, "Fetched following data");

    if (error) {
      logger.error({ error }, "Error fetching following list:");
      return res.status(500).json({ error: "Failed to fetch following list" });
    }

    res.status(200).json(data);
  } catch (err) {
    logger.error({ err }, "Unexpected error while fetching following list:");
    res.status(500).json({ err: "Failed to fetch following list" });
  }
}

export async function new_follow(req, res) {
  logger.debug("Following a user");

  try {
    const follower = req.user.id;
    const followed = req.body.user_id;

    if (!followed || follower === followed)
      return res.status(400).json({ error: "Invalid follow target" });

    logger.debug(`User ID: ${follower} is following user ID: ${followed}`);

    const { error } = await supabase
      .from("follows")
      .insert({ follower_id: follower, followed_id: followed });

    if (error) {
      logger.error({ error }, "Error following user:");
      return res.status(500).json({ error: "Failed to follow user" });
    }

    res.status(201).json({ message: "Followed successfully" });
  } catch (err) {
    logger.error({ err }, "Unexpected error while following user:");
    res.status(500).json({ err: "Failed to follow user" });
  }
}

export async function delete_follow(req, res) {
  logger.debug("Unfollowing a user");

  try {
    const follower = req.user.id;
    const followed = req.params.id;

    logger.debug(`User ID: ${follower} is unfollowing user ID: ${followed}`);

    const { error } = await supabase
      .from("follows")
      .delete()
      .match({ follower_id: follower, followed_id: followed });

    if (error) {
      logger.error({ error }, "Error unfollowing user:");
      return res.status(500).json({ error: "Failed to unfollow user" });
    }
    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (err) {
    logger.error({ err }, "Unexpected error while unfollowing user:");
    res.status(500).json({ err: "Failed to unfollow user" });
  }
}
