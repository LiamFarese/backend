import express from "express";
import { authorizeUserType, authorizeVendorId, verifyAccessToken } from "../middleware/auth";
import { createOrder, getAllOrders, getAllSales, getOrder, getSalesStats, getVendorOrders, refundOrder } from "../controllers/Order";

const router = express.Router();

/**POST ****************************************************/

/**create new order, JSON format: {"userId": "", "vendorId": "", 
 * "items": [{itemId: "", price: number, quantity: number}], 
 * "customItems": [{name: "", price: number, quantity: number}], "total": number }} */
router.post("/:vendorId/create", verifyAccessToken, authorizeVendorId, createOrder);

/** GET ***************************************************/

/** retrieves all orders across all vendors, admin function only */
router.get("/", verifyAccessToken, authorizeUserType("administrator"), getAllOrders);

/**returns a specific order under a vendor, the vendor or any employee can access */
router.get("/:vendorId/:orderId", verifyAccessToken, authorizeVendorId, getOrder);

/** returns all orders from a vendor */
router.get("/:vendorId", verifyAccessToken, authorizeVendorId, getVendorOrders);

/** returns an array with three numbers, [0] = sale revenue from the last day, [1] = last week, [2] = all time */
router.get("/:vendorId/:discard/sales", verifyAccessToken, authorizeVendorId, getSalesStats);

router.get("/:id/:discard/allSales", verifyAccessToken, authorizeUserType("administrator"), getAllSales)

/** DELTE ***************************************************/

/** refunds an order by deleting it, only accessable from the vendor */
router.delete("/:vendorId/:orderId", verifyAccessToken, authorizeVendorId, authorizeUserType("vendor"), refundOrder)

export default router;