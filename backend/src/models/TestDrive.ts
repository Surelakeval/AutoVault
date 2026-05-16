import mongoose, { Document, Schema } from 'mongoose';

export interface ITestDrive extends Document {
  user: mongoose.Types.ObjectId;
  car: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
}

const TestDriveSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Please add a preferred date'],
    },
    time: {
      type: String,
      required: [true, 'Please add a preferred time'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITestDrive>('TestDrive', TestDriveSchema);
