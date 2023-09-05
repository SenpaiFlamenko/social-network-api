import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      max: 5000,
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: [
      {
        author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, max: 500 },
      },
    ],
  },
  { versionKey: false, timestamps: true },
);

export default mongoose.model('Post', PostSchema);
