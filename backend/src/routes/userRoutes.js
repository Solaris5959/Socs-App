// routes/users.js
import express from 'express';
import supabase from '../lib/supabaseClient.js'; // Correct import

const router = express.Router();

// POST /users/register
router.post('/register', async (req, res) => {
    try {
        const { email, password, displayname } = req.body;

        if (!email || !password || !displayname) {
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

        res.status(201).json({
            message: 'User registered successfully',
            user: data.user,
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;