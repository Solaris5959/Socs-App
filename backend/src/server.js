// Import the express module
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

////////////////////////// Import route /////////////////////////////
import userRoutes from './routes/user.js';
import healthRoutes from './routes/healthcheck.js';
import logger from './logger.js'; // Import the custom logger on debug mode

// Load environment variables
dotenv.config();
const app = express();


// Middleware   
app.use(cors());
app.use(express.json());

// Supbase connection
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

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


////////////////////////////////////////// Define Routes //////////////////////////////////////////////////
app.use("/", healthRoutes);
app.use("/test", userRoutes);



// Start the server
app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});
