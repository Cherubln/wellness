import { Schema, model, Document } from "mongoose";

interface IServiceProvider extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  services: string[];
  logo?: string;
  role: string;
  qrCode?: Schema.Types.ObjectId;
  whatsappLink?: string; // Added whatsappLink to userData
  instagramLink?: string; // Added instagramLink to userData
}

const ServiceProviderSchema = new Schema<IServiceProvider>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String }, // Made optional
  services: { type: [String], required: true },
  role: { type: String, default: "service_provider" },
  logo: { type: String }, // Made optional
  qrCode: { type: Schema.Types.ObjectId, ref: "QrCode" },
  whatsappLink: { type: String, default: "" }, // Added whatsappLink to userData
  instagramLink: { type: String, default: "" }, // Added instagramLink to userData
});

export default model<IServiceProvider>(
  "ServiceProvider",
  ServiceProviderSchema
);
