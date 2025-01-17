import { RequestHandler, Router } from "express";
import {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember,
} from "../controllers/groupController";

const router = Router();

// Route to create a new group
router.post("/", createGroup);

// Route to get all groups
router.get("/", getAllGroups);

// Route to get a group by ID
router.get("/:id", getGroupById as RequestHandler);

// Route to update a group
router.put("/:id", updateGroup as RequestHandler);

// Route to delete a group
router.delete("/:id", deleteGroup as RequestHandler);

// Route to add a member to a group
router.put("/:id/add-member", addMember as RequestHandler);

// Route to remove a member from a group
router.put("/:id/remove-member", removeMember as RequestHandler);

export default router;
