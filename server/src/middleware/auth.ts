import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import {
  JWT_SECRET_ACCESS,
  verifiedPayload,
} from "../config/config";

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.header("Authorization");

    if (!accessToken) {
      return res.status(401).send("Access Denied, no token");
    }

    const verified = jwt.verify(
      accessToken,
      JWT_SECRET_ACCESS
    ) as verifiedPayload;
    req.user = { _id: verified._id, userType: verified.userType, vendorId: verified.vendorId };
    next();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/**only allows access to data if they have the correct userType */
export const authorizeUserType = (userType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user?.userType;
      /**admins can access all data */
      if (user === userType || user === "administrator") {
        next();
      } else {
        return res.status(403).json({ message: "Access Denied, invalid Role" });
      }
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  };
};

/**Makes sure that the user trying to access the profile is the user themselves */
export const authorizeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user?._id;
    const id = req.params.id;

    /**admins can view any page */
    if (user === id || req.user?.userType === "administrator") {
      next();
    } else {
      return res.status(403).json({ message: "Access Denied, invalid user" });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/**makes sure the user trying to access the catalog belonogs to the correct vendor */
export const authorizeVendorId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendorId = req.user?.vendorId;
    const paramsId = req.params.vendorId;
    /**checks to make sure the user is either an employee of the vendor, an admin, or the vendor itself */
    if (vendorId !== paramsId && req.user?.userType !== "administrator" && paramsId !== req.user?._id) {
      return res.status(403).json({message: "Access Denied, you are not registered with this vendor"});
    }
    next();
  } catch (err: any) {
    return res.status(500).json({error: err.message});
  }
};

