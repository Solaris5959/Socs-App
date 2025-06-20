import express from 'express';

//mount all api end-point here
const router = express.Router();
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

// Importing the method test using ESM syntax
import { test } from './test.js';
import { get_base_dashboard, get_user_posts_dashboard, get_favorite_posts_dashboard } from './dashboardRoutes.js'
import { query_acc, update_acc, delete_acc, upload_avatar} from './profile.js'
import { query_chat, read_msg, new_msg, update_msg, delete_msg} from './chat.js'

// Note: Import everything from profile.js as 

//define all routes here ('/route' , method) all with have the req.user object

//front end calls "http://localhost:8080/socs/api/v1/test_auth
router.get('/test_auth', test); //sample route to follow

// dashboard routes 
router.get('/dashboard', get_base_dashboard); //for GET dashboard/calls /socs/api/v1/index/dashboard
router.get('/dashboard/my-posts', get_user_posts_dashboard); //for GET dashboard/user-posts/calls /socs/api/v1/index/dashboard/user-posts
router.get('/dashboard/favorite-posts', get_favorite_posts_dashboard); //for GET dashboard/favorite-posts/calls /socs/api/v1/index/dashboard/favorite-posts

// profile routes
// route: socs/api/v1/profile
router.get('/profile', query_acc) //GET profile/calls 
router.post('/profile/upload-avatar', upload.single("avatar"), upload_avatar);
router.put('/profile', update_acc) //PUT for updating user profile
router.delete('/profile', delete_acc) // DEL for deleting user profile 

//Messaging Routes Sprint 3, body is required: req.body.content must be defined! 
router.get('chat' , query_chat) //return all chats for user 
router.get('chat/:id', read_msg), //return all msgs with id
router.post('chat/:id', new_msg) //send a new message to id
router.put('chat/:id/message/:messageID', update_msg) // where id is reciever and messageID is the exact message to be updated, time stamp also updated on success 
router.delete('chat/:id/message/:messageID', delete_msg) // where id is reciever and messageID is the exact message to be deleted 





export default router; //export for server.js
