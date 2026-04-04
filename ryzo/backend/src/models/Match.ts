import mongoose, { Schema, Document } from 'mongoose';

interface RoutePoint {
  lat: number;
  lng: number;
}

interface IndividualEarning {
  platform: string;
  amount: number;
}

interface AgentDecisionLogEntry {
  action: 'MATCH_APPROVED' | 'MATCH_BLOCKED';
  timestamp: Date;
  overlapScore: number;
  detourPercent: number;
  capacity: string;
  reason: string;
}

export interface IMatch extends Document {
  riderId: mongoose.Types.ObjectId;
  orderIds: mongoose.Types.ObjectId[];
  platforms: string[];
  overlapScore: number;
  combinedRoute: RoutePoint[];
  detourPercentage: number;
  combinedEarnings: number;
  individualEarnings: IndividualEarning[];
  timeSaved: string;
  fuelSaved: string;
  distanceSaved: number;
  explanation: string;
  optimalSequence: string[];
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'expired';
  agentDecisionLog: AgentDecisionLogEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const routePointSchema = new Schema<RoutePoint>(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

const individualEarningSchema = new Schema<IndividualEarning>(
  {
    platform: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const agentDecisionLogEntrySchema = new Schema<AgentDecisionLogEntry>(
  {
    action: { type: String, enum: ['MATCH_APPROVED', 'MATCH_BLOCKED'], required: true },
    timestamp: { type: Date, default: Date.now },
    overlapScore: { type: Number, required: true },
    detourPercent: { type: Number, required: true },
    capacity: { type: String, required: true },
    reason: { type: String, required: true },
  },
  { _id: false }
);

const matchSchema = new Schema<IMatch>(
  {
    riderId: { type: Schema.Types.ObjectId, ref: 'Rider', required: true },
    orderIds: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    platforms: [{ type: String }],
    overlapScore: { type: Number, required: true },
    combinedRoute: { type: [routePointSchema], default: [] },
    detourPercentage: { type: Number, required: true },
    combinedEarnings: { type: Number, required: true },
    individualEarnings: { type: [individualEarningSchema], default: [] },
    timeSaved: { type: String, default: '' },
    fuelSaved: { type: String, default: '' },
    distanceSaved: { type: Number, default: 0 },
    explanation: { type: String, default: '' },
    optimalSequence: [{ type: String }],
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'completed', 'expired'],
      default: 'pending',
    },
    agentDecisionLog: { type: [agentDecisionLogEntrySchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IMatch>('Match', matchSchema);
