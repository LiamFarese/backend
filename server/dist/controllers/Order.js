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
exports.refundOrder = exports.hello = exports.getSalesStats = exports.getVendorOrders = exports.getAllOrders = exports.getOrder = exports.createOrder = void 0;
const Order_1 = require("../models/Order");
const User_1 = require("../models/User");
const Item_1 = require("../models/Item");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, vendorId, items, customItems, total } = req.body;
        const user = yield User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        const vendor = yield User_1.User.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "vendor not found" });
        }
        for (const item of items) {
            console.log(item.itemId);
            const updateItem = yield Item_1.Item.findOne({ _id: item.itemId });
            console.log(updateItem);
            /**makes sure there is enough stock to process the order and checks the item exists */
            if (!updateItem) {
                return res.status(404).json({ message: "Item does not exist" });
            }
            else if (updateItem.stock < item.quantity) {
                return res.status(500).json({ itemId: updateItem._id, message: "not enough stock" });
            }
            ;
        }
        for (const item of items) {
            const updateItem = yield Item_1.Item.findOne({ _id: item.itemId });
            if (!updateItem) {
                return res.status(404).json({ message: "item not found" });
            }
            updateItem.stock -= item.quantity;
            yield updateItem.save();
        }
        let newOrder;
        if (customItems.length > 0) {
            newOrder = yield new Order_1.Order({
                userId,
                vendorId,
                items,
                customItems,
                total
            }).save();
        }
        newOrder = yield new Order_1.Order({
            userId,
            vendorId,
            items,
            total
        }).save();
        return res.status(201).json(newOrder);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.createOrder = createOrder;
/**read order */
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.orderId;
        const order = yield Order_1.Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        return res.status(200).json(order);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.getOrder = getOrder;
/**returns all orders, this will be an admin function only */
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.Order.find();
        if (orders.length === 0) {
            return res.status(404).json({ message: "no orders found" });
        }
        return res.status(200).json(orders);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.getAllOrders = getAllOrders;
/**returns all orders from the vendor, this will be restricted to the vendor only*/
const getVendorOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendorId = req.params.vendorId;
        const orders = yield Order_1.Order.find({ vendorId: vendorId });
        if (orders.length === 0) {
            return res.status(404).json({ message: "no orders found" });
        }
        return res.status(200).json(orders);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.getVendorOrders = getVendorOrders;
const getSalesStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("hello");
        const vendorId = req.params.vendorId;
        console.log(vendorId);
        const [today, week, orders] = yield Promise.all([
            Order_1.Order.find({ vendorId: vendorId, createdAt: { $gte: new Date(new Date().getTime() - (24 * 60 * 60 * 1000)) } }),
            Order_1.Order.find({ vendorId: vendorId, createdAt: { $gte: new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000)) } }),
            Order_1.Order.find({ vendorId: vendorId }),
        ]);
        const todaySales = today.reduce((sum, value) => {
            return sum + value.total;
        }, 0);
        const weekSales = week.reduce((sum, value) => {
            return sum + value.total;
        }, 0);
        const salesTotal = orders.reduce((sum, value) => {
            return sum + value.total;
        }, 0);
        return res.status(200).json({ sales: { today: todaySales, week: weekSales, total: salesTotal } });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.getSalesStats = getSalesStats;
const hello = (req, res) => {
    return res.status(202).send("hello");
};
exports.hello = hello;
const refundOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.orderId;
    console.log(orderId);
    let order;
    try {
        order = yield Order_1.Order.findByIdAndDelete(orderId);
        console.log(order);
        if (order) {
            return res.status(404).json({ message: "order successfully deleted" });
        }
        else {
            return res.status(404).json({ message: "order does not exist" });
        }
    }
    catch (err) {
        return res.status(500).json({ err: err.message });
    }
});
exports.refundOrder = refundOrder;
