import {Router} from 'express';
import { getPortfolio, addToPortfolio } from '../controllers/portfolioController.js';

const router = Router();

// All routes are protected and require authentication
router.get('/', getPortfolio);
router.post('/', addToPortfolio);

export default router;