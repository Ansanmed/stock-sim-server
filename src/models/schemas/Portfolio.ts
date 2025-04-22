import mongoose, { Schema, Document } from "mongoose";
import { MonetaryAmount } from "../interfaces/MonetaryAmount";

export interface IPortfolio extends Document {
  name: string;
  description?: string;
  userId: mongoose.Types.ObjectId;
  composition: {
    tick: string;
    tickName: string;
    qty: number;
    purchasePrice: MonetaryAmount;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const MonetaryAmountSchema: Schema = new Schema({
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
});

const CompositionSchema: Schema = new Schema({
  tick: { type: String, required: true },
  tickName: { type: String, required: true },
  qty: { type: Number, required: true },
  purchasePrice: { type: MonetaryAmountSchema, required: true },
});

const PortfolioSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    composition: { type: [CompositionSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);
