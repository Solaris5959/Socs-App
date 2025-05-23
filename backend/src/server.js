// Import the express module
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bodyParser from 'body-parser';
import apiRoutes from './routes/index.js'; // Route import
//import logger on debug mode
import logger from './logger.js';

// Load environment variables
dotenv.config();
const app = express();

// Middleware   
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Supbase connection
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
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

logger.info('Connecting to port ' + HTTP_PORT);
// logger levels
// logger.fatal('fatal');
// logger.error('error');
// logger.warn('warn');
// logger.info('info');
// logger.debug('debug');
// logger.trace('trace');
if (supabase){
    logger.info('Connected to Supabase');
}

//health check route
app.get("/", async (req, res) => {
    res.json({ message: "Hello from healthcheck route" });
})

// Protect all routes under /api with the authenticate middleware
//every route must check req.user if authenticated
app.use('/api', authenticate(), apiRoutes);

// Start the server
app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});

//Error handling
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).json({ error: 'Internal Server Error' });
});