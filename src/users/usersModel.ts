import mongoose from 'mongoose';

enum Role {
  admin = 'admin',
  user = 'user',
}

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 1,
      max: 24,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      max: 30,
    },
    name: {
      type: String,
      min: 1,
      max: 30,
      unique: true,
    },
    nickname: {
      type: String,
      min: 1,
      max: 24,
      unique: true,
    },
    friends: {
      type: Array,
      default: [],
    },
    role: {
      type: String,
      default: Role.user,
      enum: Role,
    },
  },
  { timestamps: true },
);

export default mongoose.model('User', UserSchema);
