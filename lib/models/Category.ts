import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true }, // Category name (e.g., 'Shirts', 'Pants')
  description: { type: String }, // Optional description for the category
  collection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }, // Reference the model by name
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Reference the model by name
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
