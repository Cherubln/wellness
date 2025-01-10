import express, { RequestHandler } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import userRouter from "./routes/userRouter";
import serviceProviderRouter from "./routes/serviceProviderRouter";
import groupRouter from "./routes/groupRouter";
import serviceRouter from "./routes/serviceRouter";

dotenv.config();
connectDB();

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to wellness APIs" });
});

// use the users router
app.use("/api/users", userRouter);
// Use the service provider router
app.use("/api/service-providers", serviceProviderRouter);
// Use the service router
app.use("/api/services", serviceRouter);
// Use the group router
app.use("/api/groups", groupRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
