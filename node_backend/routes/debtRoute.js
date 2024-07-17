import express from 'express';
import { createDebt, getDebts, getDebtById, updateDebt, deleteDebt } from '../controllers/debtController.js';
import { userVerification } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/debts:
 *   post:
 *     summary: Create a new debt
 *     tags: [Debts]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - amount
 *               - interestRate
 *               - monthlyPayment
 *             properties:
 *               name:
 *                 type: string
 *               amount:
 *                 type: number
 *               interestRate:
 *                 type: number
 *               monthlyPayment:
 *                 type: number
 *     responses:
 *       201:
 *         description: Debt created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', createDebt);

/**
 * @swagger
 * /api/debts/get:
 *   get:
 *     summary: Get all debts for the authenticated user
 *     tags: [Debts]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of debts
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/get', getDebts);

/**
 * @swagger
 * /api/debts/{id}:
 *   get:
 *     summary: Get a debt by ID
 *     tags: [Debts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Debt details
 *       404:
 *         description: Debt not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', getDebtById);

/**
 * @swagger
 * /api/debts/{id}:
 *   put:
 *     summary: Update a debt
 *     tags: [Debts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               amount:
 *                 type: number
 *               interestRate:
 *                 type: number
 *               monthlyPayment:
 *                 type: number
 *     responses:
 *       200:
 *         description: Debt updated successfully
 *       404:
 *         description: Debt not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', updateDebt);

/**
 * @swagger
 * /api/debts/{id}:
 *   delete:
 *     summary: Delete a debt
 *     tags: [Debts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Debt deleted successfully
 *       404:
 *         description: Debt not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', deleteDebt);

export default router;