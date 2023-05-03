"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../controllers/User");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
/**get */
router.get("/", auth_1.verifyAccessToken, (0, auth_1.authorizeUserType)("administrator"), User_1.getAllUsers);
router.get("/:id", auth_1.verifyAccessToken, auth_1.authorizeUser, User_1.getUser);
router.get("/:vendorId/employees", auth_1.verifyAccessToken, auth_1.authorizeVendorId, User_1.getEmployees);
router.delete("/:vendorId/employeeId", auth_1.verifyAccessToken, auth_1.authorizeVendorId, (0, auth_1.authorizeUserType)("vendor"), User_1.deleteEmployee);
exports.default = router;
