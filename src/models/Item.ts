import mongoose, { Schema, model, models } from "mongoose";

export interface IItem {
  name: string;
  price: number;
  description?: string;
  category?: string;
  imageUrl?: string;
  available?: boolean;
}

const ItemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String, default: "Uncategorized" },
    imageUrl: { type: String },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default (models.Item as mongoose.Model<IItem>) ||
  model<IItem>("Item", ItemSchema);
