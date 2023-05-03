"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const mongoose_1 = require("mongoose");
const ItemSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    vendorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
});
const Item = (0, mongoose_1.model)("Item", ItemSchema);
exports.Item = Item;
