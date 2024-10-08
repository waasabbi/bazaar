import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    media: [String],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }], // Reference the model by name
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection', required: true }], // Reference the model by name
    price: { 
        type: mongoose.Schema.Types.Decimal128, 
        get: (v: mongoose.Schema.Types.Decimal128) => parseFloat(v.toString()) 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { toJSON: { getters: true } });

export default mongoose.models.Product || mongoose.model('Product', productSchema);
