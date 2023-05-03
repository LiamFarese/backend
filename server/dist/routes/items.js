"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const auth_2 = require("../middleware/auth");
const auth_3 = require("../middleware/auth");
const Item_1 = require("../controllers/Item");
const router = express_1.default.Router();
/**POST ********************************************************/
/** creates a new Item, JSON post FORMAT: {"name": "", price: "", stock: "", vendorId: "" } */
router.post("/:vendorId/create", auth_2.verifyAccessToken, (0, auth_3.authorizeUserType)("vendor"), auth_1.authorizeVendorId, Item_1.createItem);
/**GET **********************************************************/
/**admin only path, returns all items in database */
router.get("/", auth_2.verifyAccessToken, (0, auth_3.authorizeUserType)("administrator"), Item_1.getAllItems);
/**:retrieves all items within a vendor catalog*/
router.get("/:vendorId", auth_2.verifyAccessToken, auth_1.authorizeVendorId, Item_1.getAllVendorItems);
/**returns a specific item from a vendor catalog */
router.get("/:vendorId/:itemId", auth_2.verifyAccessToken, auth_1.authorizeVendorId, Item_1.getItem);
router.get("/:vendorId/:discard/category", auth_2.verifyAccessToken, auth_1.authorizeVendorId, Item_1.getByCategory);
/**PUT ***********************************************************/
/**update price with specified value, http patch request JSON format: {"newPrice" : ""} */
router.patch("/:vendorId/:itemId/updatePrice", auth_2.verifyAccessToken, auth_1.authorizeVendorId, Item_1.updatePrice);
/**update stock with specified value, http patch request JSON format: {"newStock" : ""} */
router.patch("/:vendorId/:itemId/updateStock", auth_2.verifyAccessToken, auth_1.authorizeVendorId, Item_1.updateStock);
/** DELETE *******************************************************/
/**deletes item, must be a vendor */
router.delete("/:vendorId/:itemId", auth_2.verifyAccessToken, auth_1.authorizeVendorId, (0, auth_3.authorizeUserType)("vendor"), Item_1.deleteItem);
exports.default = router;
