//File can include multiple methods just name it in index
import logger from '../logger.js'; //include to use logger 
import supabase from "../lib/supabaseClient.js";



//return all chats for user 
export async function query_chat(req, res) { //the method 
  logger.debug("Authenticated user " + req.user);
  logger.debug("in GET messages authenticated users only");
    try {
        const { data, error } = await supabase
        //returns the most recent message from distinc pair of sender and reciever
        .rpc('get_recent_messages', { user_id: req.user.id });
        
        
    for (const msg of data) {
        // Capture the receiver or sender of a message that is not the current user
        let userIdToFetch = null;

        if (msg.receiver_id !== req.user.id) {
            userIdToFetch = msg.receiver_id;
        } else if (msg.sender_id !== req.user.id) {
            userIdToFetch = msg.sender_id;
        }

        if (userIdToFetch) {
            const { data: profile_data, error: profileError } = await supabase
                .from('user_profiles')
                .select('display_name, company, position, profile_pic_url')
                .eq('user_id', userIdToFetch)
                .single();

            if (profileError) {
                logger.error('Error fetching profile data:', profileError);
                continue; 
            }
            msg.profile_data = profile_data;
        }
    }
        res.status(200).json(data);

    } catch (error) {
        // Handle any unexpected errors
        logger.debug('Error fetching user profile:' + error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//return all msgs with id
export async function read_msg(req, res) { //the method 
    logger.debug("in Chat, msg history with user")
    
    if (!req.params['id']) {
        return res.status(400).json({ error: 'Id is missing' });
    }
    try {
        logger.debug(req.params['id']);
        logger.debug(req.user.id)
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .filter('receiver_id','in',`(${req.params['id']},${req.user.id})`)
            .filter('sender_id','in',`(${req.params['id']},${req.user.id})`)
            .order('sent_at', { ascending: false });
        logger.debug(data);
        res.status(200).json(data);

    } catch (error) {
        // Handle any unexpected errors
        logger.debug('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//send a new message to id
//required body
export async function new_msg(req, res) { //the method 
    logger.debug("in Chat, authenticated users only")
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Missing body' })
    }

    try {
        const{ data, error}= await supabase
        .from('messages')
        .insert(req.body)
        .select('receiver_id,  content')
        .single()
        
        res.status(200).json(data);

    } catch (error) {
        // Handle any unexpected errors
        logger.debug('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// where id is reciever and messageID is the exact message to be updated, time stamp also updated on success 
export async function update_msg(req, res) { //the method 
    logger.debug("in Chat, update msg")
    try {
        if (!req.body.content|| !req.params['messageID']) {
            return res.status(400).json({ error: 'Id, messageID and content must be defined' });
        }
        const{ data, error} = await supabase
        .from('messages')
        .update({content : req.body.content})
        .match({ sender_id: req.user.id, id: req.params['messageID'] })
        .select('*')
        .single()

        res.status(200).json(data);

    } catch (error) {

        logger.debug('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// where id is reciever and messageID is the exact message to be deleted 
export async function delete_msg(req, res) { //the method 
    logger.debug("in Chat, delete msg")
    try {
        if (!req.params['messageID']) {
            return res.status(400).json({ error: 'messageID msut be defined' });
        }
        const{ data, error} = await supabase
        .from('messages')
        .delete()
        .match({ sender_id: req.user.id, id: req.params['messageID'] });

        res.status(204).json(data);

    } catch (error) {
        // Handle any unexpected errors
        logger.debug('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

