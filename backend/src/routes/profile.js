//File can include multiple methods just name it in index
import logger from '../logger.js'; //include to use logger 
export async function query_acc(req,res) { //the method 
    logger.debug("in GET profile, authenticated users only")
    try {
    // Check if req.user is authenticated
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    // Access the authenticated user from req.user
    logger.debug(req.user);
    res.status(200).json("Query Profile under construction"); 
    // see sample object return
    // user.id is response to reference the auth.users.id fk
  } catch (error) {
    // Handle any unexpected errors
    logger.debug('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function fill_acc(req,res) { //the method 
    logger.debug("in POST profile,, authenticated users only")
    try {
    // Check if req.user is authenticated
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    // Access the authenticated user from req.user
    logger.debug(req.user);
    res.status(200).json("Post Profile under construction"); 
    // see sample object return
    // user.id is response to reference the auth.users.id fk
  } catch (error) {
    // Handle any unexpected errors
    logger.debug('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function update_acc(req,res) { //the method 
    logger.debug("in PUT profile, authenticated users only")
    try {
    // Check if req.user is authenticated
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    // Access the authenticated user from req.user
    logger.debug(req.user);
    res.status(200).json("Update Profile under construction"); 
    // see sample object return
    // user.id is response to reference the auth.users.id fk
  } catch (error) {
    // Handle any unexpected errors
    logger.debug('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function delete_acc(req,res) { //the method 
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