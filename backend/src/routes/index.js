import express from 'express';

//mount all api end-point here
const router = express.Router();
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

// Importing the method test using ESM syntax
import { test } from './test.js';
import { base } from './dashboardRoutes.js'
import { query_acc, update_acc, delete_acc, upload_avatar, query_posts } from './profile.js'

// Note: Import everything from profile.js as 

//define all routes here ('/route' , method) all with have the req.user object

//front end calls "http://localhost:8080/socs/api/v1/test_auth
router.get('/test_auth', test); //sample route to follow

// dashboard routes 
router.get('/dashboard', base); //for GET dashboard/calls http://localhost:8080socs/api/v1/dashboard

// profile routes
// route: socs/api/v1/profile
router.get('/profile', query_acc) //GET profile/calls 
router.get('/profile/posts', query_posts) //GET for retrieving user's profile & posts made
router.post('/profile/upload-avatar', upload.single("avatar"), upload_avatar);
router.put('/profile', update_acc) //PUT for updating user profile
router.delete('/profile', delete_acc) // DEL for deleting user profile, posts etc

export default router; //export for server.js
