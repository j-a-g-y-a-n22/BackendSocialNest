import mongoose, { Schema } from "mongoose"

const uploads = new Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    Caption: {
        type: String,
        required: true
    },
    filename: {
        type: String
    },
    path: {
        type: String
    },
    comments: [{
        userid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        username: {
            type: String
        },
        comment: {
            type: String
        },
        date : {
            type:Date,
            default : Date.now()
        }
    }],
    likes: [{
        userid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        username: {
            type: String
        } 
    }],
    size: {
        type: Number,
    },
    date: {
        type: Date,
        default: Date.now()
    },
})

export default mongoose.model('pics', uploads)