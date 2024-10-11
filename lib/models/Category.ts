import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, // Ensures each category name is unique within the system
  },
  description: { 
    type: String, 
    default: '' // Optional, with a default empty string for consistency
  },
  image: {
    type: String,
    required: true,
  },
  collection: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Collection', 
    required: true 
  },
  products: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product' 
    }
  ],
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
