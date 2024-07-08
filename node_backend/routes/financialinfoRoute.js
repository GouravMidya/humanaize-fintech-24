// routes/financialInfoRoutes.js

import { Router } from 'express';
import {
  addFinancialInfo,
  getFinancialInfoByUserId,
  updateFinancialInfo,
  deleteFinancialInfo
} from '../controllers/financialinfoController.js';

const router = Router();

router.post('/financeInfo', addFinancialInfo);
router.get('/financeInfo', getFinancialInfoByUserId); // Use query parameter for userId
router.put('/financeInfo', updateFinancialInfo);
router.delete('/financeInfo', deleteFinancialInfo);

export default router;
