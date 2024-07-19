import express from 'express';
import * as financialGoalController from '../controllers/financialGoalController.js';
//import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

//router.use(authMiddleware);

/**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: Financial Goal Tracker API
 *   version: 1.0.0
 *   description: API for managing financial goals
 * paths:
 *   /api/financial-goals:
 *     post:
 *       summary: Create a new financial goal
 *       tags:
 *         - Financial Goals
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FinancialGoalInput'
 *       responses:
 *         '201':
 *           description: Created
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/FinancialGoal'
 *     get:
 *       summary: Get all financial goals for the authenticated user
 *       tags:
 *         - Financial Goals
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         '200':
 *           description: Successful response
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/FinancialGoal'
 *   /api/financial-goals/{id}:
 *     put:
 *       summary: Update a financial goal
 *       tags:
 *         - Financial Goals
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FinancialGoalInput'
 *       responses:
 *         '200':
 *           description: Successful response
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/FinancialGoal'
 *     delete:
 *       summary: Delete a financial goal
 *       tags:
 *         - Financial Goals
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Successful response
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 * 
 * components:
 *   schemas:
 *     FinancialGoalInput:
 *       type: object
 *       required:
 *         - goalName
 *         - amount
 *         - targetDate
 *       properties:
 *         goalName:
 *           type: string
 *         amount:
 *           type: number
 *         targetDate:
 *           type: string
 *           format: date
 *     FinancialGoal:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         goalName:
 *           type: string
 *         amount:
 *           type: number
 *         targetDate:
 *           type: string
 *           format: date
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.post('/', financialGoalController.createGoal);
router.post('/get', financialGoalController.getGoals);
router.put('/:id', financialGoalController.updateGoal);
router.delete('/:id', financialGoalController.deleteGoal);

export default router;