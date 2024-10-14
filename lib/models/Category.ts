import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },  // Removed `unique: true`
  description: String,
  image: String,
  collection: {  // Rename if needed to avoid conflict with Mongoose reserved keys
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Collection', 
    required: true
  },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
