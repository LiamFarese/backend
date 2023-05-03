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
exports.deleteEmployee = exports.getAllUsers = exports.getEmployees = exports.getUser = void 0;
const User_1 = require("../models/User");
/**Read */
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User does not exist" });
        }
        return res.status(200).json(user);
    }
    catch (err) {
        res.status(404).json({ error: err.message });
    }
});
exports.getUser = getUser;
/**retreives all employess that match the vendorId of the vendor querying */
const getEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendorId = req.params.vendorId;
        const user = yield User_1.User.findById(vendorId);
        if (!user) {
            return res.status(404).json({ error: "User does not exist" });
        }
        const employees = yield User_1.User.find({ vendorId: user._id });
        if (!employees) {
            return res.status(404).json({ message: "no employees found" });
        }
        return res.status(200).json(employees);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.getEmployees = getEmployees;
/**administrator function that retreives all users */
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield User_1.User.find();
        if (!allUsers) {
            return res.status(404).json({ message: "No users found" });
        }
        return res.status(200).json(allUsers);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.getAllUsers = getAllUsers;
const deleteEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.employeeId;
    let user;
    try {
        user = yield User_1.User.findByIdAndDelete(userId);
        console.log(user);
        if (user) {
            return res.status(404).json({ message: "user successfully deleted" });
        }
        else {
            return res.status(404).json({ message: "user does not exist" });
        }
    }
    catch (err) {
        return res.status(500).json({ err: err.message });
    }
});
exports.deleteEmployee = deleteEmployee;
