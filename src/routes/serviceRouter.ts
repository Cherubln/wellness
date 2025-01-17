import { RequestHandler, Router } from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/ServiceController";

const router = Router();

// Route to create a new service
router.post("/", createService);

// Route to get all services
router.get("/", getAllServices);

// Route to get a service by ID
router.get("/:id", getServiceById as RequestHandler);

// Route to update a service
router.put("/:id", updateService as RequestHandler);

// Route to delete a service
router.delete("/:id", deleteService as RequestHandler);

export default router;
