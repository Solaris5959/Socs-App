// Import the express module
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


////////////////////////// Import route /////////////////////////////
import userRoutes from './routes/user.js';
import healthRoutes from './routes/healthcheck.js';



// Load environment variables
dotenv.config();
const app = express();



// Middleware   
app.use(cors());
app.use(express.json());

// Supbase connection


// Set the port
const HTTP_PORT = process.env.HTTP_PORT || 8080;



////////////////////////////////////////// Define Routes //////////////////////////////////////////////////
app.use("/", healthRoutes);
app.use("/test", userRoutes);



// Start the server
app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});
