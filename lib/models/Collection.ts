import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        required: true,
    },
    categories: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Category', 
        }
    ], 
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.models.Collection || mongoose.model('Collection', collectionSchema);
