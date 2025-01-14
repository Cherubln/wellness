import { Request, Response } from "express";
import Service from "../models/Service";

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
    } = req.body;

    const service = new Service({
      activityName,
      availability,
      description,
      location,
      phoneContact,
      category,
      provider,
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
    const services = await Service.find({ provider: req.params.provider });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Single Service
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
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
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
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
