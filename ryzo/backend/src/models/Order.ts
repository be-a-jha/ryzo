import mongoose, { Schema, Document } from 'mongoose';

interface LocationPoint {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

interface OrderStop {
  location: LocationPoint;
  address: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  platform: string;
  type: 'food' | 'ride' | 'grocery';
  deliveryType: 'standard' | 'flexible';
  status: 'pending' | 'matched' | 'active' | 'delivered' | 'cancelled';
  pickup: OrderStop;
  drop: OrderStop;
  originalFare: number;
  discountedFare: number;
  items: OrderItem[];
  matchWindowExpiry: Date;
  matchId: mongoose.Types.ObjectId | null;
  estimatedTime: string;
  createdAt: Date;
  updatedAt: Date;
}

const locationPointSchema = new Schema<LocationPoint>(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  { _id: false }
);

const orderStopSchema = new Schema<OrderStop>(
  {
    location: { type: locationPointSchema, required: true },
    address: { type: String, required: true },
  },
  { _id: false }
);

const orderItemSchema = new Schema<OrderItem>(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    platform: { type: String, required: true },
    type: { type: String, enum: ['food', 'ride', 'grocery'], required: true },
    deliveryType: { type: String, enum: ['standard', 'flexible'], required: true },
    status: {
      type: String,
      enum: ['pending', 'matched', 'active', 'delivered', 'cancelled'],
      default: 'pending',
    },
    pickup: { type: orderStopSchema, required: true },
    drop: { type: orderStopSchema, required: true },
    originalFare: { type: Number, required: true },
    discountedFare: { type: Number, default: 0 },
    items: { type: [orderItemSchema], default: [] },
    matchWindowExpiry: { type: Date },
    matchId: { type: Schema.Types.ObjectId, ref: 'Match', default: null },
    estimatedTime: { type: String, default: '' },
  },
  { timestamps: true }
);

// 2dsphere indexes for geospatial queries
orderSchema.index({ 'pickup.location': '2dsphere' });
orderSchema.index({ 'drop.location': '2dsphere' });

export default mongoose.model<IOrder>('Order', orderSchema);
