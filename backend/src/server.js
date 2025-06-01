// Import the express module
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import bodyParser from 'body-parser';
import logger from './logger.js';
import supabase from './lib/supabaseClient.js';
import apiRoutes from './routes/index.js'; // Route import
import userRoutes from './routes/userRoutes.js';


// Load environment variables
dotenv.config();
const app = express();

// Middleware   
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());



// Supbase connection
/*authenticate JWT user, front end must send Authorization header

   const response = await fetch('http://localhost:8080/api/test_auth', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`, // Include the access token
      },
    });
*/
const authenticate = () => {
  return async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract the token from the Authorization header
    if (!token) {
      logger.debug('Token not provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    // Get user information using the access token
    const { data: { user }, error } = await supabase.auth.getUser(token); // user.id is the foreign key of user object
    if (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Attach user information to the request object
    req.user = user;


    next(); // Proceed to the next middleware or route handler
  };
};

// Set the port
const HTTP_PORT = process.env.HTTP_PORT || 8080;
// logger levels
// logger.fatal('fatal');
// logger.error('error');
// logger.warn('warn');
// logger.info('info');
// logger.debug('debug');
// logger.trace('trace');
if (supabase) {
  logger.info('Connected to Supabase');
}

//health check route
app.get("/", async (req, res) => {
  res.json({ message: "Hello from healthcheck route" });
})


// Private routes (Authenticated routes)
app.use('/socs/api/v1/index', authenticate(), apiRoutes);

// (Public routes for registration, login, etc.)
app.use("/socs/api/v1/user", userRoutes);


// Start the server
app.listen(HTTP_PORT, () => {
  logger.info(`Server running on port ${HTTP_PORT}`);
});

//Error handling
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  logger.debug(err.stack); // Log the error stack for debugging
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;