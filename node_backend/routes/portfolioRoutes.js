import { Router } from "express";
import {
  getPortfolio,
  addToPortfolio,
  updateStock,
  deleteStock,
} from "../controllers/portfolioController.js";

const router = Router();

// All routes are protected and require authentication
router.get("/", getPortfolio);
router.post("/", addToPortfolio);
router.put("/", updateStock);
router.delete("/", deleteStock);

export default router;
