//File can include multiple methods just name it in index
import logger from '../logger.js'; //include to use logger 
import supabase from "../lib/supabaseClient.js";

//return all chats for user - chat history
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
                    .select('display_name, company, position, profile_pic_url, is_online')
                    .eq('user_id', userIdToFetch)
                    .single();

                if (profileError) {
                    logger.error('Error fetching profile data:', profileError);
                    continue;
                }
                msg.profile_data = profile_data;
            }
        }
        logger.debug(error)

        console.log("Data fetched from query_chat:", data);

        // Call the helper function to format the chat history
        const chatHistoryArr = formatChatHistory(data, req.user.id);
        console.log("Chat history formatted:", chatHistoryArr);

        // Retutn empty array if no chat history found
        if (chatHistoryArr.length === 0) {
            return res.status(200).json([]);
        }


        res.status(200).json(chatHistoryArr);

    } catch (error) {
        // Handle any unexpected errors
        logger.debug('Error fetching user profile:' + error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// Helper function to format chat history data
function formatChatHistory(data, userId) {
    const uniqueChatsMap = data.reduce((acc, message) => {
        const isSender = message.sender_id === userId;
        const participantId = isSender ? message.receiver_id : message.sender_id;
        const participantProfile = message.profile_data;

        // Only keep the latest message per participant
        if (
            !acc[participantId] ||
            new Date(message.sent_at) > new Date(acc[participantId].send_at)
        ) {
            acc[participantId] = {
                id: message.id,
                user_id: participantId,
                display_name: participantProfile.display_name,
                profile_pic_url: participantProfile.profile_pic_url,
                position: participantProfile.position,
                company: participantProfile.company,
                last_content: message.content,
                sent_at: message.sent_at,
                is_online: participantProfile.is_online,
            };
        }

        return acc;
    }, {});

    return Object.values(uniqueChatsMap);
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
            .filter('receiver_id', 'in', `(${req.params['id']},${req.user.id})`)
            .filter('sender_id', 'in', `(${req.params['id']},${req.user.id})`)
            .order('sent_at', { ascending: false });
        logger.debug(error)
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

    console.log("New message:", req.body);

    try {
        // Validate the request body
        const { data, error } = await supabase
            .from('messages')
            .insert(req.body)
            .select('sender_id, receiver_id, content')
            .single()
        logger.debug(error)
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
        if (!req.body.content || !req.params['messageID']) {
            return res.status(400).json({ error: 'Id, messageID and content must be defined' });
        }
        const { data, error } = await supabase
            .from('messages')
            .update({ content: req.body.content })
            .match({ sender_id: req.user.id, id: req.params['messageID'] })
            .select('*')
            .single()
        logger.debug(error)
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
        const { data, error } = await supabase
            .from('messages')
            .delete()
            .match({ sender_id: req.user.id, id: req.params['messageID'] });

        res.status(204).json(data);
        logger.debug(error)
    } catch (error) {
        // Handle any unexpected errors
        logger.debug('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

