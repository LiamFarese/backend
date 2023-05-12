import { Request, Response } from "express";
import { createUser, getUserById, getUserWithPassword, saveUser, verifyPassword } from "../models/User";
import jwt from "jsonwebtoken";
import {
  JWT_SECRET_REFRESH,
  JWT_SECRET_ACCESS,
  verifiedPayload,
} from "../config/config";
import { createSession, deleteSessionByRefreshToken, getSessionByRefreshToken, saveSession } from "../models/Session";

/**register new user function */
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, userType, vendorId } = req.body;
    
    if (username === (null || "") || password === (null || "") || userType === (null || "")) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newUser = await createUser(username, password, userType, vendorId);
    const savedUser = await saveUser(newUser);

    /** returns user and 201 status (successful entry) */
    return res.status(201).json(savedUser);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/**login function */
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    /** validation to make sure data is valid and that user exists */
    if (!username || !password) {
      return res
        .status(500)
        .json({ message: "Either password or username is missing" });
    }

    const user = await getUserWithPassword(username);

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    /** compares password given to hashed password stored */
    const verifiedUser = await verifyPassword(password, user);

    /**creates session token */
    const accessToken = jwt.sign(
      { _id: verifiedUser._id, username: verifiedUser.username, userType: verifiedUser.userType, vendorId: verifiedUser.vendorId  },
      JWT_SECRET_ACCESS,
      {
        expiresIn: "10m",
      }
    );

    const refreshToken = jwt.sign(
      { _id: verifiedUser._id, username: verifiedUser.username, userType: verifiedUser.userType, vendorId: verifiedUser.vendorId },
      JWT_SECRET_REFRESH,
      {
        expiresIn: "1y",
      }
    );

    const newSession = createSession(verifiedUser._id, refreshToken);

    const savedSession = await saveSession(newSession);

    if (!savedSession) {
      return res.status(401).json({ message: "session could not be saved" });
    }

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 86400000,
      })
      .json({ accessToken, verifiedUser });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const handleRefresh = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
      return res.status(403).json({ message: "No refresh token provided" });
    }
    const session = await getSessionByRefreshToken(cookies.refreshToken);

    const verified = jwt.verify(
      session.refreshToken,
      JWT_SECRET_REFRESH
    ) as verifiedPayload;

    const accessToken = jwt.sign(
      { _id: verified._id, username: verified.username, userType: verified.userType, vendorId: verified.vendorId },
      JWT_SECRET_ACCESS,
      {
        expiresIn: "10m",
      }
    );

    const user = await getUserById(session.userId)

    return res.status(201).json({ accessToken, user });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const logOut = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
      return res.status(404).json({ message: "no refresh token provided" });
    }
    await deleteSessionByRefreshToken(cookies.refreshToken);

    return res
      .status(200)
      .clearCookie("refreshToken")
      .json({ message: "done" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
