import express from "express";
import connectDB from "./config/database.js";
import cors from "cors";
import path from "path";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./config/swagger.js";

import authRoute from "./routes/authRoute.js";
import financeInfoRoute from "./routes/financialinfoRoute.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import financialGoalRoute from "./routes/financialGoalRoute.js";
import debtRoute from "./routes/debtRoute.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import chatRoute from "./routes/chatRoute.js";

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cookieParser());
app.use(express.json({ extended: false }));
app.use(cors());

// Swagger docs route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Define Routes
app.use("/api/auth", authRoute);
app.use("/api/financeInfo", financeInfoRoute);
app.use("/api/expense", expenseRoutes);
app.use("/api/debts", debtRoute);
app.use("/api/financial-goals", financialGoalRoute);
app.use("/api/portfolio", portfolioRoutes); // Add this line
app.use("/api/conversations", chatRoute);

// Error Handler
app.use(errorHandler);

export default app;
