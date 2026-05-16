import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

export interface ICar {
  title: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'CNG' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  mileage: number;
  ownership: string;
  location: string;
  bodyType: 'SUV' | 'Sedan' | 'Hatchback' | 'Coupe' | 'Convertible';
  images: string[];
  description: string;
  features: string[];
  featured: boolean;
  seller: mongoose.Types.ObjectId;
  status: 'pending' | 'active' | 'sold';
  createdAt: Date;
}

const CarSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title can not be more than 100 characters'],
    },
    slug: String,
    brand: {
      type: String,
      required: [true, 'Please add a brand'],
    },
    model: {
      type: String,
      required: [true, 'Please add a model'],
    },
    year: {
      type: Number,
      required: [true, 'Please add a manufacturing year'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    fuelType: {
      type: String,
      required: [true, 'Please add a fuel type'],
      enum: ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'],
    },
    transmission: {
      type: String,
      required: [true, 'Please add a transmission type'],
      enum: ['Manual', 'Automatic'],
    },
    mileage: {
      type: Number,
      required: [true, 'Please add mileage in km'],
    },
    ownership: {
      type: String,
      required: [true, 'Please add ownership status'],
      enum: ['1st Owner', '2nd Owner', '3rd Owner', '4th+ Owner'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    bodyType: {
      type: String,
      required: [true, 'Please add a body type'],
      enum: ['SUV', 'Sedan', 'Hatchback', 'Coupe', 'Convertible'],
    },
    images: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    features: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'sold'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Create car slug from the title before save
CarSchema.pre('save', async function () {
  if (this.isModified('title') || this.isNew) {
    this.slug = slugify(this.title as string, { lower: true, strict: true }) + '-' + Math.floor(Math.random() * 10000);
  }
});

export default mongoose.model<ICar>('Car', CarSchema);
