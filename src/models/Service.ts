import { Schema, model, Document } from "mongoose";

interface Service extends Document {
  activityName: string;
  availability: string;
  description: string;
  location: string;
  phoneContact: string;
  category: string;
  provider: string;
  images: string[];
}

const serviceSchema = new Schema<Service>({
  activityName: { type: String, required: true },
  availability: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  phoneContact: { type: String },
  category: { type: String, required: true },
  provider: { type: String, required: true },
  images: {
    type: [String],
    validate: [arrayLimit, "{PATH} exceeds the limit of 3"],
  }, // Field to store up to 3 images
});

// Custom validator to ensure array length does not exceed 3
function arrayLimit(val: string[]) {
  return val.length <= 3;
}

export default model<Service>("Service", serviceSchema);
