import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  fullname: string;
  username: string;
  phonenumber?: string;
  profilePicture?: string;
  gender?: string;
  status?: string;
  groups: Schema.Types.ObjectId[];
  role?: string;
  points?: number;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    phonenumber: { type: String },
    profilePicture: { type: String },
    gender: { type: String },
    status: { type: String, default: "active" },
    groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
    role: { type: String, default: "user" },
    points: { type: Number, default: 500 },
  },
  { timestamps: true }
);

export default model<IUser>("User", UserSchema);
