import { Schema, model, Document } from "mongoose";

interface IGroup extends Document {
  groupName: string;
  admin: Schema.Types.ObjectId;
  members: Schema.Types.ObjectId[];
}

const GroupSchema = new Schema<IGroup>(
  {
    groupName: { type: String, required: true },
    admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default model<IGroup>("Group", GroupSchema);
