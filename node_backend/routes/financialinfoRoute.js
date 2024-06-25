// routes/financialInfoRoutes.js

import { Router } from 'express';
import {
  addFinancialInfo,
  getFinancialInfoByUserId,
  updateFinancialInfo,
  deleteFinancialInfo
} from '../controllers/financialInfoController.js';

const router = Router();

router.post('/financeInfo', addFinancialInfo);
router.get('/financeInfo', getFinancialInfoByUserId);
router.put('/financeInfo', updateFinancialInfo);
router.delete('/financeInfo', deleteFinancialInfo);

export default router;
