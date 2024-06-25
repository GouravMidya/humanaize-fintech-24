import { Signup, Login } from "../controllers/authController.js";
import { userVerification } from "../middlewares/authMiddleware.js";
import { Router } from "express";

const router = Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/", userVerification);

export default router;
