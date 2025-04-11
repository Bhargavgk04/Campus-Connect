import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'itemType',
    required: true
  },
  itemType: {
    type: String,
    enum: ['Question', 'Answer'],
    required: true
  }
}, {
  timestamps: true
});

// Add index for faster queries
likeSchema.index({ user: 1, item: 1, itemType: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);
export default Like; 