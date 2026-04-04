import mongoose, { Schema, Document } from 'mongoose';

interface IntegratedPlatform {
  platformId: string;
  platformName: string;
  linkedAt: Date;
}

interface CurrentTask {
  orderId: string;
  platform: string;
  status: 'pickup' | 'in-transit' | 'delivering';
}

export interface IRider extends Document {
  name: string;
  email: string;
  integratedPlatforms: IntegratedPlatform[];
  currentLocation: {
    lat: number;
    lng: number;
  };
  status: 'online' | 'offline';
  currentTasks: CurrentTask[];
  todayEarnings: number;
  todayOrders: number;
  dailyGoal: number;
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

const currentTaskSchema = new Schema<CurrentTask>(
  {
    orderId: { type: String, required: true },
    platform: { type: String, required: true },
    status: { type: String, enum: ['pickup', 'in-transit', 'delivering'], required: true },
  },
  { _id: false }
);

const riderSchema = new Schema<IRider>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    integratedPlatforms: { type: [integratedPlatformSchema], default: [] },
    currentLocation: {
      lat: { type: Number, required: true, default: 0 },
      lng: { type: Number, required: true, default: 0 },
    },
    status: { type: String, enum: ['online', 'offline'], default: 'offline' },
    currentTasks: { type: [currentTaskSchema], default: [] },
    todayEarnings: { type: Number, default: 0 },
    todayOrders: { type: Number, default: 0 },
    dailyGoal: { type: Number, default: 1250 },
  },
  { timestamps: true }
);

riderSchema.index({ 'currentLocation.lat': 1, 'currentLocation.lng': 1 });

export default mongoose.model<IRider>('Rider', riderSchema);
