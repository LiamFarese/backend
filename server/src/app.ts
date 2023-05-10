import express from "express";
import { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import itemRoutes from "./routes/items";
import orderRoutes from "./routes/orders";
import cookieParser from "cookie-parser";

const app = express();

/**security */
app.use(helmet());
app.use(cors(
  {
    origin: "http://localhost:3000",
    credentials:true
}));

/**logger */
app.use(morgan("dev"));

/**middleware for parsing data*/
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/** Routes */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/items", itemRoutes);
app.use("/orders", orderRoutes);

/** Health check */
app.get("/health-check", (req: Request, res: Response, next: NextFunction) =>
  res.status(200).json({ message: "server is healthy" })
);

/** Error Handling */
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("endpoint not found");
  console.log(error);
  return res.status(404).json({ message: error.message });
});

export default app;