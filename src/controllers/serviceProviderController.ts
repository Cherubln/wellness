import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ServiceProvider from "../models/ServiceProvider";
import User from "../models/User";
import QrCodeModel from "../models/QrCode";
import * as QRCode from "qrcode";
import Cloudinary from "../config/cloudinary";
import { ObjectId } from "mongoose";

// Sign Up
export const signUp = async (req: Request, res: Response) => {
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    const existingServiceProvider = await ServiceProvider.findOne({
      email: req.body.email,
    });

    if (existingUser || existingServiceProvider) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const serviceProvider = new ServiceProvider({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phoneNumber: req.body.phoneNumber,
      services: req.body.services,
      logo: req.body.logo,
      whatsappLink: req.body.whatsappLink,
      instagramLink: req.body.instagramLink,
    });

    const qrcode = new QrCodeModel({
      name: serviceProvider.name,
      owner: serviceProvider._id,
    });
    const qrCodeUrl = await QRCode.toDataURL(
      `${process.env.FRONTEND_BASE_URL}/scan?id=${qrcode.id}`,
      {
        width: 600,
      }
    );

    const uploadedImage = await Cloudinary.uploader.upload(qrCodeUrl, {
      overwrite: true,
    });

    qrcode.image = uploadedImage.secure_url;
    await qrcode.save();
    serviceProvider.qrCode = <ObjectId>qrcode._id;

    await serviceProvider.save();

    const newServiceProvider = await ServiceProvider.findOne({
      email: serviceProvider.email,
    })
      .populate("qrCode")
      .select("-password");

    const token = jwt.sign(
      newServiceProvider!.toObject(),
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.log(error);

    res.status(400).json({ message: "Error creating service provider" });
  }
};

// Get All Service Providers
export const getAllProviders = async (req: Request, res: Response) => {
  try {
    const serviceProviders = await ServiceProvider.find()
      .select("-password")
      .populate("qrCode");
    res.status(200).json(serviceProviders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching service providers" });
  }
};

// Get Service Provider By ID
export const getProviderById = async (req: Request, res: Response) => {
  try {
    const serviceProvider = await ServiceProvider.findById(req.params.id)
      .select("-password")
      .populate("qrCode");
    if (!serviceProvider) {
      return res.status(404).json({ message: "Service provider not found" });
    }
    res.status(200).json(serviceProvider);
  } catch (error) {
    res.status(500).json({ message: "Error fetching service provider" });
  }
};

// Update Service Provider
export const updateProvider = async (req: Request, res: Response) => {
  try {
    const { password, ...updates } = req.body;

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const updatedServiceProvider = await ServiceProvider.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    )
      .select("-password")
      .populate("qrCode");
    if (!updatedServiceProvider) {
      return res.status(404).json({ message: "Service provider not found" });
    }
    res.status(200).json(updatedServiceProvider);
  } catch (error) {
    res.status(500).json({ message: "Error updating service provider" });
  }
};

// Delete Service Provider
export const deleteProvider = async (req: Request, res: Response) => {
  try {
    const serviceProvider = await ServiceProvider.findByIdAndDelete(
      req.params.id
    );
    if (!serviceProvider) {
      return res.status(404).json({ message: "Service provider not found" });
    }
    res.status(200).json({ message: "Service provider deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting service provider" });
  }
};
