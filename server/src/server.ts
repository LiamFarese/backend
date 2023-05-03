import mongoose from "mongoose";
import { MONGO_URL, SERVER_PORT } from "./config/config";
import app from "./app"
import { createUser, saveUser } from "./models/User";

/* connect to mongoose then start server*/

const main = async () => {
  await mongoose
  .connect(MONGO_URL)
  .then(async () => {
    console.log(`Connected to MongoDB`);
  })

  app.listen(SERVER_PORT, () =>
  console.log(`server is running on port ${SERVER_PORT}`)
  );
}

main().catch((error) => {console.log(error)});

