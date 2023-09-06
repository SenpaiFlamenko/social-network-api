import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      max: 5000,
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comments', default: [] }],
  },
  { versionKey: false, timestamps: true },
);

export default mongoose.model('Post', PostSchema);
