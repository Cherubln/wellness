import express, { RequestHandler } from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import connectDB from "./config/db";
import userRouter from "./routes/userRouter";
import serviceProviderRouter from "./routes/serviceProviderRouter";
import groupRouter from "./routes/groupRouter";
import serviceRouter from "./routes/serviceRouter";
import qrCodeRouter from "./routes/qrcodeRouter";

dotenv.config();
connectDB();

const app = express();
app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
);

app.use(
  session({
    secret: process.env.SECRET_KEY!,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, <Express.User>user);
});

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
// use the qrcode router
app.use("/api/qrcodes", qrCodeRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
