import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../app/config';

export type TUserRole = 'admin' | 'user';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: TUserRole;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: 0 },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Remove password from responses
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.isDeleted;
    return ret;
  },
});

export const User = model<IUser>('User', userSchema);
