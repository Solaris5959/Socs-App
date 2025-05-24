// routes/users.js
import express from 'express';
import supabase from '../lib/supabaseClient.js'; // Correct import
import logger from '../logger.js'
const router = express.Router();

// POST /users/register
router.post('/register', async (req, res) => {
    try {
        const { email, password, displayname } = req.body;

        if (!email || !password || !displayname) {
            logger.debug("Registration failed")
            return res.status(400).json({ message: 'Missing required fields' });
            
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    displayname,
                },
            },
        });

        if (error) {
            return res.status(400).json({ message: error.message });
        }
        logger.debug("User registered successfully: " + data.user.id); 
        res.status(201).json({
            message: 'User registered successfully',
            user: data.user,
        });
    } catch (err) {
        logger.error("Registration error:" +  err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /users/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            logger.debug("Login route missing param");
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            logger.debug("Login Error:" +  err);
            return res.status(401).json({ message: error.message });
        }

        // Return the session information
        res.status(200).json({
            message: 'User logged in successfully',
            session: data.session, // reuse to send as Bearer token for access
        });
    } catch (err) {
        logger.error("Internal server error:" + err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;