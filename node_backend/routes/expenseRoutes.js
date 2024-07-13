// expenseRoutes.js
import express from 'express';
import { addExpense, getExpenses, updateExpense, deleteExpense, getExpensesByDateRange  } from '../controllers/expenseController.js';

const router = express.Router();

// Route to add a new expense
router.post('/expenses', addExpense);

// Route to get all expenses
router.post('/getexpenses',getExpenses);

// Route to update an expense by id
router.put('/expenses/update/:id',updateExpense);

// Route to delete an expense by id
router.delete('/expenses/delete/:id', deleteExpense);

// Route to get expenses by date range
router.post('/getexpensesdaterange', getExpensesByDateRange);

export default router;
