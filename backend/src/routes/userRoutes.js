// routes/users.js
import express from 'express';
import supabase from '../lib/supabaseClient.js'; // Correct import
import supbaseAdmin from '../lib/supabaseAdmin.js'; // Correct import
import logger from '../logger.js'
const router = express.Router();
import jwt from 'jsonwebtoken';
import supabaseAdmin from '../lib/supabaseAdmin.js';

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
                    display_name: displayname,
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
        logger.error("Registration error:" + err);
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

        // Check if there was an error during login
        //logger.info("Login data: " + JSON.stringify(data, null, 2));

        if (error) {
            logger.debug("Login Error:" + error);
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



// GET /user/session - Validate access token and return user info
router.get('/session', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing or invalid authorization header" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            logger.warn("Invalid token or user not found");
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        res.status(200).json({ user });
    } catch (err) {
        logger.error("Session check error: " + err);
        res.status(500).json({ message: "Internal server error" });
    }
});


// POST /user/forgot-password - Send reset password email
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {

        // Validate email format
        // console.log("front-end API:", process.env.FRONTEND_URL)
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:3000/reset-password', // Or your frontend's reset page
        });

        if (error) {
            logger.warn("Forgot password error: " + error.message);
            return res.status(400).json({ message: error.message });
        }

        logger.debug("Reset password email sent to: " + email);
        res.status(200).json({ message: "Check your email for the password reset link" });
    } catch (err) {
        logger.error("Forgot password error: " + err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// POST /users/update-password - Update the user's password
router.post('/update-password', async (req, res) => {
    const { newPassword } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing or invalid authorization header" });
    }

    const token = authHeader.split(" ")[1];

    if (!newPassword) {
        return res.status(400).json({ message: "New password is required" });
    }

    try {
        // Supabase automatically picks up the access token from the client SDK,
        // but in a custom backend you need to impersonate the session:
        supabase.auth.setSession({ access_token: token, refresh_token: '' }); // Use empty refresh if you don't have it

        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            logger.warn("Password update error: " + error.message);
            return res.status(400).json({ message: error.message });
        }

        logger.debug("Password updated successfully");
        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        logger.error("Update password error: " + err);
        res.status(500).json({ message: "Internal server error" });
    }
});



// POST /user/reset-password - Reset password using access token
router.post('/reset-password', async (req, res) => {
    // This endpoint is called when the user clicks the reset link in their email
    const { token, newPassword } = req.body;



    if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
    }

    try {

        const decoded = jwt.decode(token);
        const userId = decoded?.sub;


        if (!userId) {
            return res.status(400).json({ message: "Invalid token" });
        }

        const { error } = await supabaseAdmin.auth.admin.updateUserById(
            userId, {
            password: newPassword,
        });

        if (error) {
            logger.warn("Password reset failed: " + error.message);
            return res.status(400).json({ message: error.message });
        }

        logger.info("Password reset successfully");
        res.status(200).json({ message: "Password has been reset successfully" });
    } catch (err) {
        logger.error("Reset password error: " + err);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
