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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeVendorId = exports.authorizeUser = exports.authorizeUserType = exports.verifyAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const verifyAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.header("Authorization");
        if (!accessToken) {
            return res.status(401).send("Access Denied, no token");
        }
        const verified = jsonwebtoken_1.default.verify(accessToken, config_1.JWT_SECRET_ACCESS);
        req.user = { _id: verified._id, userType: verified.userType, vendorId: verified.vendorId };
        console.log(req.user, "token verified");
        next();
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.verifyAccessToken = verifyAccessToken;
/**only allows access to data if they have the correct userType */
const authorizeUserType = (userType) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userType;
            /**admins can access all data */
            if (user === userType || user === "administrator") {
                console.log(req.user, "user type valid");
                next();
            }
            else {
                return res.status(403).json({ message: "Access Denied, invalid Role" });
            }
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    });
};
exports.authorizeUserType = authorizeUserType;
/**Makes sure that the user trying to access the profile is the user themselves */
const authorizeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const id = req.params.id;
        /**admins can view any page */
        if (user === id || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.userType) === "administrator") {
            console.log(req.user, "user match");
            next();
        }
        else {
            return res.status(403).json({ message: "Access Denied, invalid user" });
        }
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.authorizeUser = authorizeUser;
/**makes sure the user trying to access the catalog belonogs to the correct vendor */
const authorizeVendorId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e;
    try {
        const vendorId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.vendorId;
        const paramsId = req.params.vendorId;
        console.log(paramsId);
        /**checks to make sure the user is either an employee of the vendor, an admin, or the vendor itself */
        if (vendorId !== paramsId && ((_d = req.user) === null || _d === void 0 ? void 0 : _d.userType) !== "administrator" && paramsId !== ((_e = req.user) === null || _e === void 0 ? void 0 : _e._id)) {
            return res.status(403).json({ message: "Access Denied, you are not registered with this vendor" });
        }
        console.log(req.user, "vendor id authorized");
        next();
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.authorizeVendorId = authorizeVendorId;
