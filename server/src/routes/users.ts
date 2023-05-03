import express from "express";
import { getUser, getEmployees, getAllUsers, deleteEmployee } from "../controllers/User";
import {
  authorizeUser,
  authorizeUserType,
  authorizeVendorId,
  verifyAccessToken,
} from "../middleware/auth";

const router = express.Router();

/**GET **/

/** returns all users, this is an administrator funciton, takes no params or body, only a valid accessToken*/
router.get("/", verifyAccessToken, authorizeUserType("administrator"), getAllUsers);

/** returns a single user where /:id is the user id */
router.get("/:id", verifyAccessToken, authorizeUser, getUser);

/** returns a list of all the employees under a vendor */
router.get("/:vendorId/employees", verifyAccessToken, authorizeVendorId, getEmployees);

/**DELETE */

/**deletes a user, only the vendor relating to the employee can delete an employee */
router.delete("/:vendorId/:employeeId", verifyAccessToken, authorizeVendorId, authorizeUserType("vendor"), deleteEmployee);
export default router;
