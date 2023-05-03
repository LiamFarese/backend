"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const Order_1 = require("../controllers/Order");
const router = express_1.default.Router();
/**POST ****************************************************/
/**create new order, JSON format: {} */
router.post("/:vendorId/create", auth_1.verifyAccessToken, auth_1.authorizeVendorId, Order_1.createOrder);
router.get("/", auth_1.verifyAccessToken, (0, auth_1.authorizeUserType)("administrator"), Order_1.getAllOrders);
router.get("/:vendorId/:orderId", auth_1.verifyAccessToken, auth_1.authorizeVendorId, Order_1.getOrder);
router.get("/:vendorId", auth_1.verifyAccessToken, auth_1.authorizeVendorId, Order_1.getVendorOrders);
router.get("/:vendorId/:discard/sales", auth_1.verifyAccessToken, auth_1.authorizeVendorId, (0, auth_1.authorizeUserType)("vendor"), Order_1.getSalesStats);
router.delete("/:vendorId/:orderId", auth_1.verifyAccessToken, auth_1.authorizeVendorId, (0, auth_1.authorizeUserType)("vendor"), Order_1.refundOrder);
exports.default = router;
