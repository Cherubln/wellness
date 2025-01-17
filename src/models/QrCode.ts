import { Schema, model, Document } from "mongoose";

interface IQrCode extends Document {
  name: string;
  points: number;
  image?: string;
  dedicated: string;
  owner: Schema.Types.ObjectId;
}

const QrCodeSchema = new Schema<IQrCode>(
  {
    name: { type: String, required: true },
    points: { type: Number, default: 500 },
    image: { type: String },
    dedicated: { type: String, default: "active" },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "ServiceProvider", // Reference to the ServiceProvider model
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IQrCode>("QrCode", QrCodeSchema);
