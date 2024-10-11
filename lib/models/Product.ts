import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true
    },
    description: { 
        type: String, 
        default: '' 
    },
    media: [
        { 
            type: String 
        }
    ], 
    categories: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Category', 
            required: true 
        }
    ], 
    collections: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Collection', 
            required: true
        }
    ],
    price: { 
        type: mongoose.Schema.Types.Decimal128, 
        required: true,
        get: (v: mongoose.Schema.Types.Decimal128) => parseFloat(v.toString()),
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    },
}, { 
    toJSON: { getters: true }
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);
