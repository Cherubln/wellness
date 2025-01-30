import { Request, RequestHandler, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import ServiceProvider from "../models/ServiceProvider";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();

// Initialize passport
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:5000/api/users/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // const email = profile.emails![0].value;
        // let user = await User.findOne({ email });
        // if (!user) {
        //   user = await User.create({
        //     fullname: profile.displayName,
        //     username: profile.id,
        //     email,
        //     password: "", // No password for Google Auth users
        //   });
        // }
        // const { password, ...userWithoutPassword } = user.toObject();
        done(null, profile);
      } catch (error) {
        console.log({ error });

        done(error, undefined);
      }
    }
  )
);

// Google auth route handler
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = passport.authenticate("google", {
  failureRedirect: "/http://localhost:3000/auth",
});

export const googleAuthRedirect = (req: Request, res: Response) => {
  const token = jwt.sign(req.user!, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
  res.redirect(`http://localhost:3000/dashboard?token=${token}`);
};

// Sign Up
export const signUp = async (req: Request, res: Response) => {
  try {
    const { fullname, username, email } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    const existingServiceProvider = await ServiceProvider.findOne({ email });

    if (existingUser || existingServiceProvider) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      fullname,
      username,
      password: hashedPassword,
      email,
    });

    const { password, ...createdUser } = user.toObject();
    const token = jwt.sign(createdUser, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Sign In
export const signIn = async (req: Request, res: Response) => {
  try {
    // Try to find the user in the User collection
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      // If found in User collection, validate password

      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(400).send({ message: "Invalid password" });
      }

      const { password, ...userWithoutPassword } = user.toObject();
      const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });
      return res.status(200).send({ token });
    }

    // Try to find the user in the ServiceProvider collection
    let serviceProvider = await ServiceProvider.findOne({
      email: req.body.email,
    }).populate("qrCode");

    if (!serviceProvider) {
      return res
        .status(400)
        .json({ message: "User or Service Provider not found" });
    }

    // If found in ServiceProvider collection, validate password
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      serviceProvider.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const { password, ...serviceProviderWithoutPassword } =
      serviceProvider.toObject();
    const token = jwt.sign(
      serviceProviderWithoutPassword,
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Get All Users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Get User By ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      return res.status(200).json(user);
    }
    // Try to find the user in the ServiceProvider collection
    let serviceProvider = await ServiceProvider.findById(
      req.params.id
    ).populate("qrCode");
    if (serviceProvider) {
      return res.status(200).json(serviceProvider);
    }
    res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Error fetching user" });
  }
};

// Update User
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { password, ...updates } = req.body;

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
