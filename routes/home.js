import express from 'express';
import getuser from '../middleware/getuser.js';
import user from '../models/serverdb.js';
import dp from '../models/profilepic.js';
import pics from '../models/uploadpic.js';
import follow from '../models/follow.js';
const router = express.Router();

router.get('/feed', getuser, async (req, res) => {
    const userid = req.user.id
    try {
        let userfollow = await follow.findOne({ User: userid });
        console.log(userfollow);
        res.send(userfollow.Following);
    } catch (error) {
        
    }
})
export default router