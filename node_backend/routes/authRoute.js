import { Signup, Login } from "../controllers/authController.js";
import { userVerification } from "../middlewares/authMiddleware.js";
import { Router } from "express";
import { getUserDetails } from "../controllers/authController.js";

const router = Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/verify", userVerification); // Change route to verify
router.get("/user-details", getUserDetails);

export default router;
