import { Document, Types } from "mongoose";
import User from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user: Document<any, any, typeof User> | null;
    }
  }
}
