import mongoose, { Schema } from "mongoose";

const followSchema = new Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    Followers: [{
        Userid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        Username: {
            type: String
        }
    }],
    Following: [{
        Userid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        Username: {
            type: String,
        }
    }]
});

// Export the model
export default mongoose.model('Follow', followSchema);
