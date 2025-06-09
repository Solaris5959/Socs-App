//File can include multiple methods just name it in index
import logger from '../logger.js'; //include to use logger 

export async function test(req,res) { //the method 
    logger.debug("in test, authenticated users only")
    try {
    // Check if req.user is authenticated
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    // Access the authenticated user from req.user
    //logger.debug(req.user);
    res.status(200).json({ message: 'User profile', user: req.user }); 
    // see sample object return
    // user.id is response to reference the auth.users.id fk
  } catch (error) {
    // Handle any unexpected errors
    logger.debug('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}