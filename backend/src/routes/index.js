import express from 'express';

//mount all api end-point here
const router = express.Router();
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

// Importing the method test using ESM syntax
import { test } from './test.js';
import { get_basic_dashboard, get_user_dashboard, get_favorite_dashboard } from './dashboardRoutes.js'
import { query_acc, update_acc, delete_acc, upload_avatar } from './profile.js'
import { query_chat, read_msg, new_msg, update_msg, delete_msg } from './chat.js'


// Resolved conflict: import both post.js and connection.js
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
  unfavourite_post,
  query_comments_by_postid,
  query_replies_by_commentid
} from './posts.js';

import {
  query_connections,
  query_potential_connections,
  new_connection,
  delete_connection,
  query_connection_requests,
  new_connection_request,
  delete_connection_request,
  query_followers,
  query_following,
  new_follow,
  delete_follow
} from './connections.js';

import { uploadGroupFile, uploadUserFile } from './files.js';

// Note: Import everything from profile.js as 

//define all routes here ('/route' , method) all with have the req.user object

//front end calls "http://localhost:8080/socs/api/v1/test_auth
router.get('/test_auth', test); //sample route to follow

// dashboard routes - Get post information for the dashboard 
router.get('/dashboard', get_basic_dashboard); //for GET dashboard/calls /socs/api/v1/index/dashboard
router.get('/dashboard/my-posts', get_user_dashboard); //for GET dashboard/user-posts/calls /socs/api/v1/index/dashboard/user-posts
router.get('/dashboard/favorite-posts', get_favorite_dashboard); //for GET dashboard/favorite-posts/calls /socs/api/v1/index/dashboard/favorite-posts

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
// * Added: Get comments and repli by postid
router.get('/post/comments/:id', query_comments_by_postid);
router.get('/post/replies/:id', query_replies_by_commentid);

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
router.get('/chat', query_chat) //return all chats for user RECIEVED
router.get('/chat/:id', read_msg), //return all msgs from current user with other user
router.post('/chat', new_msg) //send a new message to id 
router.put('/chat/:messageID', update_msg) // messageID is the exact message to be updated, time stamp also updated on success 
router.delete('/chat/:messageID', delete_msg) //messageID is the exact message to be deleted 

// Connections/Follows + Connection Requests
router.get('/connections', query_connections) //GET all connections for user
router.get('/suggest-connections', query_potential_connections) // * Added:GET potential connections for user
router.delete('/connections/:id', delete_connection) //DELETE a connection by id
router.get('/connections/requests', query_connection_requests) //GET all connection requests for user - Get connection requests
router.post('/connections/requests', new_connection_request) //POST to create a new connection request - Send connection request
router.post('/connections/requests/:id', new_connection) //POST to create a new connection - Accept connection request
router.delete('/connections/requests/:id', delete_connection_request) //DELETE a connection request by id - Cancel connection request
router.get('/connections/followers', query_followers) //GET all followers for user
router.get('/connections/following', query_following) //GET all following for user
router.post('/connections/follow', new_follow) //POST to follow a user
router.delete('/connections/unfollow/:id', delete_follow) //DELETE to unfollow a user

// Files
router.post('/files/user', uploadUserFile) // Upload a file for user
router.post('/files/group/:groupId', uploadGroupFile) // Upload a file for group
router.get('/files/user', {}) // Get all files for user
router.get('/files/group/:groupId', {}) // Get all files for group
router.get('/files/user/:fileId', {}) // Get a specific file's signed URL for user
router.get('/files/group/:groupId/:fileId', {}) // Get a specific file's signed URL for group
router.delete('/files/user/:fileId', {}) // Delete a file for user
router.delete('/files/group/:groupId/:fileId', {}) // Delete a file for group



export default router; //export for server.js
