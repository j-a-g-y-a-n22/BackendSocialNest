import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import pics from '../models/uploadpic.js';
import getuser from '../middleware/getuser.js';
import { cloudinary } from '../utils/cloudinary.js'; // ✅ Fix this line
import { Readable } from 'stream';

const router = express.Router();

// Use memory storage since we’re uploading to cloud directly
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🖼️ Upload Route
router.post('/userupload', getuser, upload.single('avatar'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
    }
    const userId = req.user.id;
    const filename = `${userId}-${Date.now()}`;

    try {
        const bufferStream = new Readable();
        const resizedBuffer = await sharp(req.file.buffer)
            .resize(1920) // Resize to max 1920px width (adjust as needed)
            .jpeg({ quality: 80 }) // Reduce quality (80%)
            .toBuffer();

        bufferStream.push(resizedBuffer);
        bufferStream.push(null);
        const streamUpload = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        public_id: filename,
                        folder: "useruploads"
                    },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                bufferStream.pipe(stream);
            });
        };

        const uploadResult = await streamUpload();

        const img = {
            User: userId,
            Caption: req.body.caption || '',
            filename: uploadResult.public_id,
            path: uploadResult.secure_url,
            size: req.file.size,
        };

        const newimg = new pics(img);
        await newimg.save();

        return res.status(200).json({ message: 'File uploaded successfully' });

    } catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(500).send('Error uploading file.');
    }
});

// 📸 Get Uploads
router.post('/getuploads', getuser, async (req, res) => {
    const userId = req.user.id;
    try {
        const userpics = await pics.find({ User: userId });
        res.json(userpics);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching uploads.');
    }
});

// 🗑️ Delete Upload
router.delete('/dltuplods', async (req, res) => {
    const id = req.query._id;
    try {
        const imgdb = await pics.findOneAndDelete({ _id: id });

        if (!imgdb) {
            return res.status(404).json({ error: 'Image not found in DB' });
        }

        const publicId = imgdb.filename; // already includes folder/useruploads
        const result = await cloudinary.uploader.destroy(publicId); // no need to add folder again

        if (result.result !== 'ok') {
            return res.status(500).json({ error: 'Failed to delete from Cloudinary' });
        }

        res.json({ message: 'Image deleted successfully', imgdb });

    } catch (err) {
        console.error('Error deleting Cloudinary image:', err);
        res.status(500).send('Internal server error');
    }
});
export default router;
