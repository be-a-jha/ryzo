import mongoose, { Schema, Document } from 'mongoose';

interface IntegratedPlatform {
  platformId: string;
  platformName: string;
  linkedAt: Date;
}

export interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  avatar: string;
  integratedPlatforms: IntegratedPlatform[];
  role: 'user' | 'rider';
  createdAt: Date;
  updatedAt: Date;
}

const integratedPlatformSchema = new Schema<IntegratedPlatform>(
  {
    platformId: { type: String, required: true },
    platformName: { type: String, required: true },
    linkedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatar: { type: String, default: '' },
    integratedPlatforms: { type: [integratedPlatformSchema], default: [] },
    role: { type: String, enum: ['user', 'rider'], required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
