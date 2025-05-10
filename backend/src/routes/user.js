import express from 'express';

import * as userController from '../controllers/userController.js';

// Define the router
const router = express.Router();


// Route to get all products
router.get("/", async (req, res) => {

    // Call a function from the controller
    const user = await userController.getUser();

    res.json({ message: "Hello from user route" });
})


export default router;