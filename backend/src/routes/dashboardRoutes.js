// import express from 'express';
import logger from '../logger.js';

//const router = express.Router();

// router.get('/', (req, res) => {
//   res.status(501).json({ error: 'Not implemented yet' });
// });

// /**
//  * Catch-all 404 for any undefined dashboard routes
//  */
// router.use((req, res) => {
//   res.status(404).json({ error: 'Dashboard route not found' });
// });

// /**
//  * Error handler for this router
//  */
// router.use((err, req, res, next) => {
//   logger.error('Dashboard router error:', err);
//   res.status(500).json({ error: 'Internal server error' });
// });



export async function base(req, res) { //the method 
  logger.debug("in test, authenticated users only")
  try {
    // Check if req.user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Access the authenticated user from req.user
    logger.debug(req.user);
    res.status(200).json("Route under construction...");
    // see sample object return
    // user.id is response to reference the auth.users.id fk
  } catch (error) {
    // Handle any unexpected errors
    logger.debug('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}