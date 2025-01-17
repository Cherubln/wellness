import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();
const APP_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
const API_KEY = process.env.CLOUDINARY_API_KEY || "";
const API_SECRET = process.env.CLOUDINARY_API_SECRET_KEY || "";

cloudinary.config({
  cloud_name: APP_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});
export default cloudinary;
