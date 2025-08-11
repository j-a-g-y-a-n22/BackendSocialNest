import express from 'express';
import multer from 'multer';
import dp from '../models/profilepic.js';
import getuser from '../middleware/getuser.js';
import { cloudinary } from '../utils/cloudinary.js';
import { Readable } from 'stream';

const router = express.Router();

// Use in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Helper to convert buffer to readable stream
const bufferToStream = (buffer) => {
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    return readable;
};

// Helper to upload stream to Cloudinary using async/await
const uploadToCloudinary = async (buffer, userId) => {
    return await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'profilepics',
                public_id: `${userId}-${Date.now()}`,
                resource_type: 'image',
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        bufferToStream(buffer).pipe(stream);
    });
};
// Route for uploading profile picture to Cloudinary
router.post('/uploadpic', getuser, upload.single('avatar'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.user.id;

    try {
        const existing = await dp.findOne({ User: userId });
        console.log(existing);

        // Delete old Cloudinary image if present
        if (existing?.cloudinary_id) {
            try {
                await cloudinary.uploader.destroy(existing.cloudinary_id);
                console.log('Old image deleted from Cloudinary');
            } catch (err) {
                console.error('Error deleting old Cloudinary image:', err);
            }
        }

        // Upload new image
        const uploadResult = await uploadToCloudinary(req.file.buffer, userId);

        const fileData = {
            User: userId,
            filename: req.file.originalname,
            cloudinary_url: uploadResult.secure_url,
            cloudinary_id: uploadResult.public_id,
            size: req.file.size,
        };

        if (existing) {
            await dp.findOneAndUpdate({ User: userId }, { $set: fileData });
        } else {
            await dp.create(fileData);
            console.log("created");

        }

        res.json(fileData);
    } catch (err) {
        console.error('Error uploading to Cloudinary or updating DB:', err);
        res.status(500).send('Server error');
    }
});

export default router;
