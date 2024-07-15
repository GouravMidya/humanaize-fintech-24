// routes/financialInfoRoutes.js

import { Router } from 'express';
import {
  addFinancialInfo,
  getFinancialInfoByUserId,
  updateFinancialInfo,
  deleteFinancialInfo
} from '../controllers/financialinfoController.js';

const router = Router();

router.post('/', addFinancialInfo);
router.get('/', getFinancialInfoByUserId); // Use query parameter for userId
router.put('/', updateFinancialInfo);
router.delete('/', deleteFinancialInfo);

export default router;
