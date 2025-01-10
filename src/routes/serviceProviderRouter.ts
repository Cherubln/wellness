import { RequestHandler, Router } from "express";
import {
  signUp,
  getAllProviders,
  getProviderById,
  updateProvider,
  deleteProvider,
} from "../controllers/serviceProviderController";

const router = Router();

// Route to sign up a new service provider
router.post("/signup", signUp as RequestHandler);

// Route to get all service providers
router.get("/", getAllProviders);

// Route to get a service provider by ID
router.get("/:id", getProviderById as RequestHandler);

// Route to update a service provider
router.put("/:id", updateProvider as RequestHandler);

// Route to delete a service provider
router.delete("/:id", deleteProvider as RequestHandler);

export default router;
