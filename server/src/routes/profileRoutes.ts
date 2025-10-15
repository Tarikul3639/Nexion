import { Router } from "express";
import {
  Avatar,
  Me
} from "@/controllers";
import { authenticateToken } from "@/utils/middleware";
import { upload } from "@/middleware/multerConfig";

const router = Router();

router.post("/avatar", authenticateToken, upload.single("avatar"), Avatar);
router.get("/me", authenticateToken, Me);
router.put("/me", authenticateToken, Me);

export default router;
