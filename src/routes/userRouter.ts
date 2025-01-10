import { RequestHandler, Router } from "express";
import {
  signUp,
  signIn,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = Router();

// Route to sign up a new user
router.post("/signup", signUp as RequestHandler);

// Route to sign in a user
router.post("/signin", signIn as RequestHandler);

// Route to get all users
router.get("/", getAllUsers as RequestHandler);

// Route to get a user by ID
router.get("/:id", getUserById as RequestHandler);

// Route to update a user
router.put("/:id", updateUser as RequestHandler);

// Route to delete a user
router.delete("/:id", deleteUser as RequestHandler);

export default router;
