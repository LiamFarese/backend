import express from "express";
import { handleRefresh, logOut, login, register } from "../controllers/auth";

const router = express.Router();

/**post */

/** JSON Format = {username: "", password: "", "userType": "", vendorId?: ""} */
router.post("/register", register);

/** JSON Format = {username: "", password: ""} */
router.post("/login", login);

/**does not require a body, only checks that a valid refresh Token is present in the http request */
router.post("/logout", logOut);

/**does not require a body, only checks that a valid refresh token is present in the http request */
router.get("/refresh", handleRefresh);

export default router;
