import mongoose from 'mongoose';

const CommentsSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, min: 1, max: 500 },
  },
  { versionKey: false, timestamps: true },
);

export default mongoose.model('Comments', CommentsSchema);
