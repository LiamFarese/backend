import express from "express";
import { authorizeUser, authorizeVendorId } from "../middleware/auth";
import { verifyAccessToken } from "../middleware/auth";
import { authorizeUserType } from "../middleware/auth";
import { createItem, deleteItem, getAllItems, getAllVendorItems, getByCategory, getItem, updatePrice, updateStock } from "../controllers/Item";

const router = express.Router();

/**POST ********************************************************/

/** creates a new Item, JSON post FORMAT: {"name": "", price: "", stock: "", vendorId: "" } */
router.post("/:vendorId/create", verifyAccessToken, authorizeUserType("vendor"), authorizeVendorId, createItem);

/**GET **********************************************************/
/**admin only path, returns all items in database */
router.get("/", verifyAccessToken, authorizeUserType("administrator"), getAllItems);

/**:retrieves all items within a vendor catalog*/
router.get("/:vendorId", verifyAccessToken, authorizeVendorId, getAllVendorItems);

/**returns a specific item from a vendor catalog */
router.get("/:vendorId/:itemId", verifyAccessToken, authorizeVendorId, getItem);

router.get("/:vendorId/:discard/category", verifyAccessToken, authorizeVendorId, getByCategory);

/**PUT ***********************************************************/
 
/**update price with specified value, http patch request JSON format: {"newPrice" : ""} */
router.patch("/:vendorId/:itemId/updatePrice", verifyAccessToken, authorizeVendorId, updatePrice);

/**update stock with specified value, http patch request JSON format: {"newStock" : ""} */
router.patch("/:vendorId/:itemId/updateStock", verifyAccessToken, authorizeVendorId, updateStock);


/** DELETE *******************************************************/
/**deletes item, must be a vendor */
router.delete("/:vendorId/:itemId", verifyAccessToken, authorizeVendorId, authorizeUserType("vendor"), deleteItem);

export default router;