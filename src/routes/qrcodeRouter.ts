import { Router } from "express";
import {
  createQrCode,
  getQrs,
  getQrById,
  updateQrCode,
} from "../controllers/QrCodeController";

const router = Router();

router.post("/create", createQrCode);
router.get("/", getQrs);
router.get("/:id", getQrById);
router.put("/:id", updateQrCode);

export default router;
