import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: String,
    image: {
        type: String,
        required: true,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // Reference the model by name instead of importing
        }
    ],
    categories: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Category', // Reference the model by name instead of importing
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
