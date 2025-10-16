import { Router } from "express";
import {
  Avatar,
  Me
} from "@/controllers";
import { verifyToken } from "@/middleware/verifyToken";
import { upload } from "@/middleware/multerConfig";

const router = Router();

router.post("/avatar", verifyToken, upload.single("avatar"), Avatar);
router.get("/me", verifyToken, Me);
router.put("/me", verifyToken, Me);

export default router;
