import { addFinancialInfo } from "../controllers/financialInfoController.js";
import { Router } from "express";

const router = Router();

router.post("/financeInfo", addFinancialInfo);

export default router;
