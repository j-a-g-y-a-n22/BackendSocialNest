import express from 'express';
import getuser from '../middleware/getuser.js';
import user from '../models/serverdb.js';
import dp from '../models/profilepic.js';
import pics from '../models/uploadpic.js';
import follow from '../models/follow.js';
const router = express.Router();

router.get('/searchuser/:slug', getuser, async (req, res) => {
    try {
        const us = req.user.username;
        const input = req.params.slug;
        const username = "@" + input;
        const search = await user.findOne({ username: username })
        const userid = search._id;
        const userdp = await dp.findOne({ User: userid })
        const userpics = await pics.find({ User: userid })
        const followed = await follow.find({ User: userid })
        const matchuser = followed[0].Followers.some(follower => follower.Username === us);
        console.log(us, input, username, search, userid, followed, matchuser);
        const founduser = {
            user: search,
            usseruploads: userpics,
            userdp: userdp,
            followed: followed,
            matchuser: matchuser
        }
        if (search) {
            res.status(200).json(founduser)
        }
        else {
            res.send("user not found")
            console.log("usernotfound");
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
})

export default router