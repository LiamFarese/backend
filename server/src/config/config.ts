import dotenv from "dotenv";

dotenv.config();

const MONGO_USERNAME: string = process.env.MONGO_USERNAME as string;
const MONGO_PASSWORD: string = process.env.MONGO_PASSWORD as string;
export const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@mycluster.xupp2pc.mongodb.net/?retryWrites=true&w=majority`;

export const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 1337;

  /** token secret */
export const JWT_SECRET_ACCESS: string = process.env
  .JWT_SECRET_ACCESS as string;
export const JWT_SECRET_REFRESH: string = process.env
  .JWT_SECRET_REFRESH as string;

/**inorder to use req.user it has to be added to the interface as an optional property delcared */

export interface verifiedPayload {
  _id: string;
  username: string;
  userType: string;
  vendorId: string;
}

declare global {
  namespace Express {
    export interface Request {
      user?: {
        _id: string;
        username: string;
        userType: string;
        vendorId: string;
      };
    }
  }
}

