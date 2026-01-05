import { Document, Model, Schema, model, models } from "mongoose";

export interface Table extends Document {
  number: string;
  capacity: number;
  status: "available" | "occupied" | "reserved";
}

const tableSchema = new Schema<Table>({
  number: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  status: {
    type: String,
    enum: ["available", "occupied", "reserved"],
    default: "available",
  },
});

const TableModel = models?.Table || model("Table", tableSchema);

export default TableModel as Model<Table>;
