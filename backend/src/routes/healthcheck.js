import express from 'express';



// Define the router
const router = express.Router();


// Route to get all products
router.get("/", async (req, res) => {


    res.json({ message: "Hello from healthcheck route" });
})


export default router;