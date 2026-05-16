import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  car: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  type: 'reservation' | 'purchase';
  status: 'reserved' | 'confirmed' | 'cancelled' | 'completed';
  tokenAmount: number;
  totalPrice: number;
  financeType: 'full_payment' | 'loan';
  downPayment?: number;
  loanTenure?: number;
  emiAmount?: number;
  contactPhone?: string;
  deliveryAddress?: string;
  paymentRef: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['reservation', 'purchase'],
      default: 'reservation',
    },
    status: {
      type: String,
      enum: ['reserved', 'confirmed', 'cancelled', 'completed'],
      default: 'reserved',
    },
    tokenAmount: {
      type: Number,
      default: 10000,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    // Finance details
    financeType: {
      type: String,
      enum: ['full_payment', 'loan'],
      default: 'full_payment',
    },
    downPayment: Number,
    loanTenure: Number, // in months
    emiAmount: Number,
    // Contact details
    contactPhone: String,
    deliveryAddress: String,
    // Payment reference (mock)
    paymentRef: {
      type: String,
      default: () => 'AV-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
