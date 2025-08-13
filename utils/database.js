import mongoose from 'mongoose';

const mongooseURL = process.env.mongooseURL;

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongooseURL);
        console.log("✅ Connected to MongoDB Atlas");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default connectToMongo;

