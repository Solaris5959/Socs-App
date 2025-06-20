import express from 'express';

//mount all api end-point here
const router = express.Router();
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

// Importing the method test using ESM syntax
import { test } from './test.js';
import { base } from './dashboardRoutes.js'
import { query_acc, update_acc, delete_acc, upload_avatar} from './profile.js'
import { query_chat, read_msg, new_msg, update_msg, delete_msg} from './chat.js'
import {
  query_posts,
  query_user_posts,
  query_favourite_posts,
  create_post,
  create_comment,
  create_reply,
  like_post,
  favourite_post,
  unlike_post,
  unfavourite_post
} from './posts.js';

// Note: Import everything from profile.js as 

//define all routes here ('/route' , method) all with have the req.user object

//front end calls "http://localhost:8080/socs/api/v1/test_auth
router.get('/test_auth', test); //sample route to follow

// dashboard routes 
router.get('/dashboard', base); //for GET dashboard/calls http://localhost:8080socs/api/v1/dashboard

// profile routes
// route: socs/api/v1/profile
router.get('/profile', query_acc) //GET profile/calls 
router.post('/profile/upload-avatar', upload.single("avatar"), upload_avatar);
router.put('/profile', update_acc) //PUT for updating user profile
router.delete('/profile', delete_acc) // DEL for deleting user profile 

// ====== Post Routes ======

// GET
router.get('/posts', query_posts);
router.get('/posts/user', query_user_posts);
router.get('/posts/favourites', query_favourite_posts);

// POST
router.post('/posts', upload.single('image'), create_post); // for text + optional image
router.post('/posts/comments', create_comment);
router.post('/posts/comments/replies', create_reply);
router.post('/posts/like', like_post);
router.post('/posts/favourite', favourite_post);

// DELETE
router.delete('/posts/like', unlike_post);
router.delete('/posts/favourite', unfavourite_post);

//Messaging Routes Sprint 3, body is required: req.body.content must be defined! 
router.get('/chat' , query_chat) //return all chats for user 
router.get('/chat/:id', read_msg), //return all msgs with id
router.post('/chat/:id', new_msg) //send a new message to id
router.put('/chat/:id/message/:messageID', update_msg) // where id is reciever and messageID is the exact message to be updated, time stamp also updated on success 
router.delete('/chat/:id/message/:messageID', delete_msg) // where id is reciever and messageID is the exact message to be deleted 





export default router; //export for server.js
