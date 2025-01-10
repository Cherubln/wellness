import { Schema, model, Document } from "mongoose";

interface Service extends Document {
  activityName: string;
  availability: string;
  description: string;
  location: string;
  phoneContact: string;
  category: string;
  provider: string;
}

const serviceSchema = new Schema<Service>({
  activityName: { type: String, required: true },
  availability: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  phoneContact: { type: String },
  category: { type: String, required: true },
  provider: { type: String, required: true },
});

export default model<Service>("Service", serviceSchema);
