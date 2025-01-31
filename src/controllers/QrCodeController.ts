import QrCodeModel from "../models/QrCode";
import UserModel from "../models/User";
import { Request, Response } from "express";
import { AES } from "crypto-js";
import { config } from "dotenv";
import * as QRCode from "qrcode";
import Cloudinary from "../config/cloudinary";
import ServiceProvider from "../models/ServiceProvider";
import { ObjectId } from "mongoose";

config();
const SECRET_KEY = process.env.SECRET_KEY || "";

export const createQrCode = async (
  req: Request,
  res: Response
): Promise<any> => {
  // const { data } = req.body;s
  try {
    // let cypherText = data
    //   ? AES.encrypt(data as string, SECRET_KEY).toString()
    //   : undefined;

    const qrcode = new QrCodeModel({ ...req.body });

    const provider = req.query.provider;
    if (provider) {
      const user = await ServiceProvider.findById(provider);
      if (user) {
        user.qrCode = <ObjectId>qrcode._id;
        let qrCodeUrl = await QRCode.toDataURL(
          `${process.env.FRONTEND_BASE_URL}/scan?id=${qrcode.id}&&points=${qrcode.points}&&provider=${user.name}`,
          {
            width: 600,
          }
        );
        const uploadedImage = await Cloudinary.uploader.upload(qrCodeUrl, {
          overwrite: true,
        });
        qrcode.image = uploadedImage.secure_url;
        await user.save();
        await qrcode.save();
      }
    }

    res.status(201).json({
      message: "QR code created successfully",
      qrcode,
    });
  } catch (error) {
    console.error("Error creating QR code:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

export const updateQrCode = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  try {
    const qrcode = await QrCodeModel.findById(id);
    if (!qrcode) {
      return res.status(404).json({
        message: "QR code not found",
      });
    }

    qrcode.set(req.body);
    // qrcode.updatedAt = new Date();
    await qrcode.save();

    res.status(200).json({
      message: "QR code updated successfully",
      qrcode,
    });
  } catch (error) {
    console.error("Error updating QR code:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

export const getQrs = async (req: Request, res: Response): Promise<any> => {
  try {
    const qrcodes = await QrCodeModel.find();
    res.status(200).json(qrcodes);
  } catch (error) {
    console.error("Error fetching QR codes:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

export const getQrById = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const userId = req.query.userId;
  if (!id) {
    return res.status(400).json({
      message: "QR code is invalid.",
    });
  }
  if (!userId) {
    return res.status(400).json({
      message: "Not authorized",
    });
  }

  try {
    const qrcode = await QrCodeModel.findById(id);
    if (!qrcode) {
      return res.status(404).json({
        message: "QR code does not exist.",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Please sign up to continue",
      });
    }

    if (!user.hasScanned?.includes(qrcode.id)) {
      user.points = (user.points ?? 0) + qrcode.points;
      user.hasScanned?.push(qrcode.id);
      await user.save();
    } else {
      return res.status(400).json({
        message: "QR code has already been scanned",
        error: "QR code has already been scanned",
      });
    }

    res.status(200).json(qrcode);
  } catch (error) {
    console.error("Error fetching QR code by ID:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
