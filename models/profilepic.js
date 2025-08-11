import mongoose, { Schema } from "mongoose";

const profilepic = new Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    filename: {
        type: String,
    },
    cloudinary_url: {
        type: String,
        required: true,
        default: "https://res.cloudinary.com/dmclyzbck/image/upload/v1754816770/unava_fv5tew.jpg"
    },
    cloudinary_id: {
        type: String,
        required: true,
        default: "defaults/default_profile" // Public ID without extension
    },
    size: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('dp', profilepic);
