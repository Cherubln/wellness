import { Request, Response } from "express";
import Service from "../models/Service";
import Cloudinary from "../config/cloudinary";
import ServiceProvider from "../models/ServiceProvider"; // Reference to ServiceProvider model

// Create Service
export const createService = async (req: Request, res: Response) => {
  try {
    const {
      activityName,
      availability,
      description,
      location,
      phoneContact,
      category,
      provider,
      images,
      price,
    } = req.body;

    // Upload images to Cloudinary and store URLs in images array
    const imageUrls = [];
    if (images && images.length > 0) {
      for (const image of images) {
        const result = await Cloudinary.uploader.upload(image);
        imageUrls.push(result.secure_url);
      }
    }

    const service = new Service({
      activityName,
      availability,
      description,
      location, // Array of locations
      phoneContact,
      category,
      provider, // Reference to provider
      images: imageUrls, // Store URLs in images array
      price,
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Services
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const query = req.query.provider ? { provider: req.query.provider } : {};
    const services = await Service.find(query).populate(
      "provider",
      "_id name email phoneNumber logo whatsappLink instagramLink"
    ); // Populate provider field with _id and name only
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Single Service
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "provider",
      "_id name email phoneNumber logo whatsappLink instagramLink"
    ); // Populate provider field with _id and name only
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Service
export const updateService = async (req: Request, res: Response) => {
  try {
    const { images } = req.body;
    // Upload images to Cloudinary and store URLs in images array
    const imageUrls = [];
    if (images && images.length > 0) {
      for (const image of images) {
        if (image.includes("cloudinary")) {
          imageUrls.push(image);
          continue;
        }

        const result = await Cloudinary.uploader.upload(image);
        imageUrls.push(result.secure_url);
      }
    }
    if (req.body.provider) {
      const provider = await ServiceProvider.findById(req.body.provider._id);
      if (provider) {
        provider.whatsappLink = req.body.provider.whatsappLink;
        provider.instagramLink = req.body.provider.instagramLink;
        await provider?.save();
      }
    }
    req.body.images = imageUrls; // Store URLs in images array

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate(
      "provider",
      "_id name  email phoneNumber logo whatsappLink instagramLink"
    ); // Populate provider field with _id and name only
    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Service
export const deleteService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
