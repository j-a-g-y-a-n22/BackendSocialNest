import express from 'express';
import getuser from '../middleware/getuser.js';
import follow from '../models/follow.js';
const router = express.Router();

router.post('/followreq', getuser, async (req, res) => {
    const { id, username } = req.user;
    const { userid, user } = req.body;
    const userfollow = await follow.findOne({ User: id })
    userfollow.Following.push({ Userid: userid, Username: user })
    const userfollower = await follow.findOne({ User: userid })
    userfollower.Followers.push({ Userid: id, Username: username })
    await userfollow.save()
    await userfollower.save()

    res.status(200).send(userfollow)
})

router.post('/unfollowreq', getuser, async (req, res) => {
    const { id, username } = req.user;
    const { userid, user } = req.body;
    let userfollow = await follow.findOne({ User: id });
    let userfollower = await follow.findOne({ User: userid });
    if (!userfollow || !userfollower) {
        return res.status(404).send({ message: 'User data not found' });
    }
    userfollow.Following = userfollow.Following.filter(
        (f) => f.Userid !== userid && f.Username !== user
    );
    userfollower.Followers = userfollower.Followers.filter(
        (f) => f.Userid !== id && f.Username !== username
    );
    await userfollow.save();
    await userfollower.save();
    const data = [userfollow, userfollower];
    res.status(200).send(data);
});

router.get('/profilefollowdetails', getuser, async (req, res) => {
    const userid = req.user.id
    try {
        const finduser = await follow.find({ User: userid })
        if (finduser) {
            res.status(200).json(finduser)
        } else {
            res.status(404).send('User not found')
        }
    } catch (error) {
        res.status(500).send('Internal Server Error', error)
    }
})
export default router 