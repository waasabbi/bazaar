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
            type: String // URLs or paths for product images
        }
    ],
    categories: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Category', 
        }
    ],
    collection: { // Only one collection
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Collection', 
        required: true
    },
    price: { 
        type: mongoose.Schema.Types.Decimal128, 
        required: true,
        get: (v: mongoose.Schema.Types.Decimal128) => parseFloat(v.toString()),
    },
    sizes: [
        {
            size: { type: String, required: true }, // E.g., 'S', 'M', 'L', etc.
            stock: { type: Number, required: true, min: 0 } // Units in stock for this size
        }
    ],
    colors: [
        {
            colorName: { type: String, required: true }, // E.g., 'Red', 'Blue', etc.
            colorCode: { type: String }, // Optional: hex code or other color code
            stock: { type: Number, required: true, min: 0 } // Units in stock for this color
        }
    ],
    unitsInStock: { 
        type: Number, 
        required: true, 
        min: 0 // Total units in stock across all variants
    },
    dimensions: { 
        length: { type: Number }, // Length in cm, inches, etc.
        width: { type: Number },  // Width in cm, inches, etc.
        height: { type: Number }, // Height in cm, inches, etc.
        weight: { type: Number }  // Weight in kg, lbs, etc.
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
