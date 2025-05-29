import express from 'express';
import dashboardRoutes from './dashboard.js';

//mount all api end-point here
const router = express.Router();
import { test } from './test.js'; // Importing the method test using ESM syntax

//define all routes here ('/route' , method) all with have the req.user object
//front end calls "http://localhost:8080/api/route_name"
router.get('/test_auth', test); //sample route to follow

// new dashboard sub‐router
router.use('/dashboard', dashboardRoutes);


export default router; //export for server.js
