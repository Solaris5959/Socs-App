//File can include multiple methods just name it in index
import logger from '../logger.js'; //include to use logger 
import supabase from '../lib/supabaseClient.js';
import supabaseAdmin from '../lib/supabaseAdmin.js';

//sprint 3 to do:

//Messaging Routes Sprint 3, body is required: req.body.content must be defined! 

//return all chats for user 
export async function query_chat(req,res) { //the method 
    logger.debug("in Chat, authenticated users only")
    try {

        // Access the authenticated user from req.user
        res.status(200).json("GET all chat under construction");

    } catch (error) {
        // Handle any unexpected errors
        logger.debug('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }   
}
//return all msgs with id
export async function read_msg(req,res) { //the method 
    logger.debug("in Chat, authenticated users only")
    try {
        if (!req.params['id']) {
            return res.status(400).json({ error: 'Id is missing' });
        }

    // Access the authenticated user from req.user
    res.status(200).json("GET specific chat under construction");    

  } catch (error) {
    // Handle any unexpected errors
    logger.debug('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

//send a new message to id
export async function new_msg(req,res) { //the method 
    logger.debug("in Chat, authenticated users only")
    try {

        if (!req.params['id'] || req.body.content === undefined ) {
            return res.status(400).json({ error: 'Id and content is missing' });
        }

        // Access the authenticated user from req.user
        res.status(200).json("POST chat under construction");

    } catch (error) {
    // Handle any unexpected errors
        logger.debug('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// where id is reciever and messageID is the exact message to be updated, time stamp also updated on success 
export async function update_msg(req,res) { //the method 
    logger.debug("in Chat, authenticated users only")
    try {
        if (!req.params['id'] || req.body.content === undefined ||  !req.params['messageID']) {
            return res.status(400).json({ error: 'Id, messageID and content must be defined' });
        }

    // Access the authenticated user from req.user
        res.status(200).json("PUT chat under construction");

  } catch (error) {
    // Handle any unexpected errors
    logger.debug('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// where id is reciever and messageID is the exact message to be deleted 
export async function delete_msg(req,res) { //the method 
    logger.debug("in Chat, authenticated users only")
    try {
    // Check if req.user is authenticated
        if (!req.params['id'] || !req.params['messageID']) {
            return res.status(400).json({ error: 'Id and messageID msut be defined' });
        }

    // Access the authenticated user from req.user
     res.status(200).json("DEL chat under construction");

  } catch (error) {
    // Handle any unexpected errors
    logger.debug('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

