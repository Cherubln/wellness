import { Router } from "express";
import {
  createQrCode,
  getQrs,
  getQrById,
  updateQrCode,
  updateAllQrCodes,
} from "../controllers/QrCodeController";

const router = Router();

router.post("/create", createQrCode);
router.get("/updateAll", updateAllQrCodes);
router.get("/", getQrs);
router.get("/:id", getQrById);
router.put("/:id", updateQrCode);

export default router;
