import express from 'express';
import getuser from '../middleware/getuser.js';
// import user from '../models/serverdb.js';
// import dp from '../models/profilepic.js';
import pics from '../models/uploadpic.js';
import follow from '../models/follow.js';
import { configDotenv } from 'dotenv';
const router = express.Router();
import mongoose from 'mongoose';
configDotenv()
const ui = process.env.SECT_GET_USER
router.post('/likereq', getuser, async (req, res) => {
    const userid = req.user.id
    const username = req.user.username
    const user = {
        userid,
        username
    }
    const filename = req.body.src
    const pic = await pics.findOne({ filename: filename })
    if (!pic) {
        return res.status(200).send("Pic Not Found")
    }
    const alreadyliked = pic.likes.some(like => like.userid.toString() === userid)
    if (alreadyliked) {
        return res.status(400).send('Already Liked')
    }
    pic.likes.push(user)
    await pic.save()

    res.status(200).send("got like")
})

router.post('/unlikereq', getuser, async (req, res) => {
    const username = req.user.username

    const filename = req.body.src
    const pic = await pics.findOne({ filename: filename })
    if (!pic) {
        return res.status(200).send("Pic Not Found")
    }
    pic.likes = pic.likes.filter((f) => f.username !== username)
    await pic.save()

    res.status(200).send("unliked")
})

router.post('/comment', getuser, async (req, res) => {
    const userid = req.user.id
    const username = req.user.username
    const comment = req.body.message
    const user = {
        userid,
        username,
        comment,
        _id: new mongoose.Types.ObjectId(),
    }
    const filename = req.body.src
    const pic = await pics.findOne({ filename: filename })
    if (!pic) {
        return res.status(200).send("Pic Not Found")
    }
    pic.comments.push(user)
    await pic.save()
    const response = {
        newComment: {
            username,
            comment,
            date: new Date(),
        }
    }
    res.status(200).json(response)
})
router.post('/deletecomment', getuser, async (req, res) => {
    const userid = req.user.id
    const username = req.user.username
    const comment = req.body.message
    const user = {
        userid,
        username,
        comment
    }
    const filename = req.body.src
    const pic = await pics.findOne({ filename: filename })
    if (!pic) {
        return res.status(200).send("Pic Not Found")
    }
    pic.comments.push(user)
    await pic.save()

    res.status(200).send("Commented")
})

export default router 