import express from 'express';
//.env
import dotenv from 'dotenv';
//modals
import user from '../models/serverdb.js';
import dp from '../models/profilepic.js';
import pic from '../models/uploadpic.js'
import follow from '../models/follow.js';

import validator from 'express-validator';
import bcrypt from 'bcryptjs/dist/bcrypt.js';
import jwt from 'jsonwebtoken';
//middleware
import getuser from '../middleware/getuser.js';
//path nd fs module
import { cloudinary } from '../utils/cloudinary.js'; // ✅ Fix this line

const { body, validationResult } = validator;
const router = express.Router();
dotenv.config({ path: './.env' })
const JWT_SECT = process.env.JWT_SECT;

//route 1 signup
router.post('/signup', [
    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('email', "Email not valid").isEmail(),
    body('username', "Not a valid username").isLength({ min: 3 }),
    body('password', "Password must be 6 character long").isLength({ min: 6 })
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array()[0].msg });
    }
    try {
        let User = await user.findOne({ username: '@' + req.body.username });
        let Mail = await user.findOne({ email: req.body.email });
        if (User) {
            return res.status(400).json({ error: "Username already exists" });
        }
        if (Mail) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const salt = await bcrypt.genSalt(10)
        const hashpass = await bcrypt.hash(req.body.password, salt)
        User = await user.create(
            {
                name: req.body.name,
                email: req.body.email,
                username: '@' + req.body.username,
                password: hashpass
            },
        )
        await follow.create(
            {
                User: User.id,
            }
        )
        await dp.create(
            {
                User: User.id,
            }
        )
        const data = {
            user: {
                id: User.id,
                username: User.username
            }
        }
        const authtoken = jwt.sign(data, JWT_SECT)
        return res.status(201).json({ authtoken });
    }
    catch (err) {
        console.error("Signup error:", err);
        return res.status(500).send({ error: "Internal server error" });
    }
});
//route 2 Login
router.post('/login', [
    body('username', "Username not valid").isLength({ min: 3 }),
    body('password', "Password can't be blank").exists()
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    const { username, password } = req.body;
    let Username = '@' + username
    try {
        let User = await user.findOne({ username: Username })
        if (!User) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }
        const compassw = await bcrypt.compare(password, User.password);

        if (!compassw) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }
        const data = {
            user: {
                id: User.id,
                username: User.username
            }
        }
        const AuthToken = jwt.sign(data, JWT_SECT)
        res.send(AuthToken);
    }
    catch (error) {
        return res.status(500).send({ error: "Internal server error" });
    }
});
//route 3 Get User
router.post('/getuser', getuser, async (req, res) => {
    try {
        let userid = req.user.id;
        const userDetails = await user.findById(userid).select('-password')
        const finduser = await dp.findOne({ User: userid });
        const result = {
            user: userDetails,
            profilePicture: finduser ? finduser.cloudinary_url : null,
        };
        res.json(result);
    }
    catch (error) {
        return res.status(500).send({ error: "Internal server error" });
    }
})
// Route 4: Delete User
router.post('/dltuser', getuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const deletedUser = await user.findOneAndDelete({ _id: userId });
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        function extractPublicId(url, path) {
            try {
                const part = url.split(`/${path}/`)[1];
                let temp = `${path}/` + part;
                temp = temp.split('.')[0];
                return temp;
            } catch {
                return null;
            }
        }
        const profilePic = await dp.findOne({ User: userId });
        if (profilePic) {
            let publicId = extractPublicId(profilePic.cloudinary_url, 'profilepics');
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
                console.log(`Profile picture deleted from Cloudinary: ${publicId}`);
            } else {
                console.log("No public_id for profile picture, skipping Cloudinary delete");
            }
            await dp.deleteOne({ User: userId });
            console.log("Profile picture entry deleted from DB");
        }
        const uploads = await pic.find({ User: userId });
        console.log(`Found ${uploads.length} uploads`);
        for (const file of uploads) {
            let publicId = extractPublicId(file.path, 'useruploads');
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
                console.log(`Deleted from Cloudinary: ${publicId}`);
            } else {
                console.log(`No public_id for file ${file._id}, skipping Cloudinary delete`);
            }
        }
        await pic.deleteMany({ User: userId });
        console.log("All uploads deleted from DB");
        await follow.deleteOne({ User: userId });
        console.log("Follow entry deleted from DB");
        await follow.updateMany(
            {},
            {
                $pull: {
                    Followers: { Userid: userId },
                    Following: { Userid: userId }
                }
            }
        );
        res.json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
//Router 5: Forget User
router.post('/forget', [
    body('email', "Email not valid").isEmail(),
], async (req, res) => {
    try {
        let email = req.body.email
        const finduser = await user.findOne({ email })
        if (finduser) {
            console.log(email);
            res.status(200).send('got email')
        } else {
            res.status(404).send("User Not Found")
        }
    }
    catch (error) {
        return res.status(500).send({ error: "Internal server error" });
    }
})
//Router 5: Change Password User
router.post('/retrivepassword', [
    body('password', "Password must be 6 character long").isLength({ min: 6 })
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    try {
        let email = req.body.email
        const salt = await bcrypt.genSalt(10)
        const hashpass = await bcrypt.hash(req.body.password, salt)
        let finduser = await user.findOne({ email })
        if (!finduser) {
            return res.status(404).send("User not found");
        }
        finduser.password = hashpass
        await finduser.save()
        res.status(200).send('Pawword Updated')

    }
    catch (error) {
        return res.status(500).send({ error: "Internal server error" });
    }
})
export default router;