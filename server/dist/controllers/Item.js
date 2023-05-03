"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateStock = exports.updatePrice = exports.getByCategory = exports.getAllVendorItems = exports.getAllItems = exports.getItem = exports.createItem = void 0;
const Item_1 = require("../models/Item");
/**create new item under a vendor */
const createItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const nameValidate = yield Item_1.Item.findOne({ name: req.body.name, vendorId: req.body.vendorId });
        console.log(nameValidate);
        if (nameValidate) {
            return res.status(400).json({ message: "Item name already exists" });
        }
        const newItem = new Item_1.Item({
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock,
            category: req.body.category,
            vendorId: req.body.vendorId
        });
        const savedItem = yield newItem.save();
        return res.status(201).json(savedItem);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.createItem = createItem;
/** retreives item */
const getItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemId = req.params.itemId;
        const item = yield Item_1.Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        return res.status(200).json(item);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.getItem = getItem;
const getAllItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield Item_1.Item.find();
        if (items.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        return res.status(200).json(items);
    }
    catch (err) {
        return res.status(500).json({ err: err.message });
    }
});
exports.getAllItems = getAllItems;
/**retreive all items from vendor */
const getAllVendorItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendorId = req.params.vendorId;
        const items = yield Item_1.Item.find({ vendorId: vendorId });
        return res.status(200).json(items);
    }
    catch (err) {
        return res.status(500).json({ err: err.message });
    }
});
exports.getAllVendorItems = getAllVendorItems;
const getByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = req.params.category;
        const items = yield Item_1.Item.find({ category: category });
        if (items.length === 0) {
            return res.status(404).json({ message: "No items of that category found" });
        }
    }
    catch (err) {
        return res.status(500).json({ err: err.message });
    }
});
exports.getByCategory = getByCategory;
/** Update price */
const updatePrice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemId = req.params.itemId;
        const newPrice = req.body.newPrice;
        const item = yield Item_1.Item.findById(itemId);
        console.log(item);
        if (!item) {
            return res.status(404).json({ message: "Item does not exist" });
        }
        item.price = newPrice;
        const savedItem = yield item.save();
        return res.status(200).json(savedItem);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.updatePrice = updatePrice;
/**update Stock */
const updateStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemId = req.params.itemId;
        const newStock = req.body.newStock;
        const item = yield Item_1.Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item does not exist" });
        }
        item.stock = newStock;
        const savedItem = yield item.save();
        return res.status(200).json(savedItem);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.updateStock = updateStock;
/**delete item */
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemId = req.params.itemId;
        const item = yield Item_1.Item.findByIdAndDelete(itemId);
        if (item) {
            return res.status(202).json({ message: "item successfully deleted" });
        }
        else {
            return res.status(404).json({ message: "item does not exist" });
        }
        return res.status(202).json({ message: "item deleted" });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.deleteItem = deleteItem;
