import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import cookieParser from "cookie-parser";

dotenv.config();

const port = process.env.PORT;
const mongoURI = process.env.MONGO_URI;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use("/", authRoute);

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Server connected to database");
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
