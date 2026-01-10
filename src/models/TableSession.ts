import { Document, Model, Schema, model, models } from "mongoose";

export interface TreyItem {
  itemName: string;
  price: number;
  quentity: number;
  isConfrim: boolean;
  imageUrl?: string;
}

export interface TableSession extends Document {
  customerName: string;
  customerPhone: string;
  tableNumber: string;
  tablePin: string;
  trey: TreyItem[];
  IsValid: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const tableSessionSchema = new Schema<TableSession>(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    tableNumber: { type: String, required: true },
    tablePin: { type: String, required: true },
    trey: [
      {
        itemName: { type: String, required: true },
        price: { type: Number, required: true },
        quentity: { type: Number, required: true },
        isConfrim: { type: Boolean, default: false },
        imageUrl: { type: String },
      },
    ],
    IsValid: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const TableSessionModel =
  models?.TableSession || model("TableSession", tableSessionSchema);

export default TableSessionModel as Model<TableSession>;
