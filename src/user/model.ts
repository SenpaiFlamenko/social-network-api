import mongoose from 'mongoose';

enum Role {
  admin = 'admin',
  user = 'user',
}

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username validation test message'],
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
      min: 6,
      max: 30,
    },
    firstName: {
      type: String,
      max: 20,
      default: '',
    },
    lastName: {
      type: String,
      max: 20,
      default: '',
    },
    nickname: {
      type: String,
      max: 24,
      default: '',
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
