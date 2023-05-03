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
exports.logOut = exports.handleRefresh = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const Session_1 = require("../models/Session");
/**register new user function */
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, userType, vendorId } = req.body;
        /** validation on data */
        if (!username || !password) {
            return res
                .status(500)
                .json({ message: "Either Username or Password is missing" });
        }
        if (!["vendor", "employee", "administrator"].includes(userType)) {
            return res.status(500).json({ message: "not a valid user type" });
        }
        const existingUser = yield User_1.User.findOne({ username });
        if (existingUser) {
            return res.status(500).json({ message: "user already exists" });
        }
        /** creates salt and password hash */
        const salt = yield bcrypt_1.default.genSalt();
        const passwordHash = yield bcrypt_1.default.hash(password, salt);
        /** creates new user and saves to database */
        const newUser = new User_1.User({
            username,
            password: passwordHash,
            userType,
            vendorId,
        });
        const savedUser = yield newUser.save();
        /** returns user and 201 status (successful entry) */
        return res.status(201).json(savedUser);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.register = register;
/**login function */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        /** validation to make sure data is valid and that user exists */
        if (!username || !password) {
            return res
                .status(500)
                .json({ message: "Either password or username is missing" });
        }
        const user = yield User_1.User.findOne({ username: username }).select("+password");
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }
        /** compares password given to hashed password stored */
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "password is incorrect" });
        /**password set to an empty string since we do not want it sent to the front end, cannot be deleted due to interface */
        user["password"] = "";
        /**creates session token */
        const accessToken = jsonwebtoken_1.default.sign({ _id: user._id, userType: user.userType, vendorId: user.vendorId }, config_1.JWT_SECRET_ACCESS, {
            expiresIn: "10m",
        });
        const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id, userType: user.userType, vendorId: user.vendorId }, config_1.JWT_SECRET_REFRESH, {
            expiresIn: "1y",
        });
        const newSession = new Session_1.Session({
            userId: user._id,
            refreshToken,
        });
        const savedSession = yield newSession.save();
        if (!savedSession) {
            return res.status(401).json({ message: "session could not be created" });
        }
        return res
            .status(200)
            .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 86400000,
        })
            .json({ accessToken, user });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.login = login;
const handleRefresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookies = req.cookies;
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refreshToken)) {
            return res.status(401).json({ message: "No refresh token provided" });
        }
        const refreshToken = yield Session_1.Session.findOne({
            refreshToken: cookies.refreshToken,
        });
        if (!refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        const verified = jsonwebtoken_1.default.verify(cookies.refreshToken, config_1.JWT_SECRET_REFRESH);
        const accessToken = jsonwebtoken_1.default.sign({ _id: verified._id, userType: verified.userType, vendorId: verified.vendorId }, config_1.JWT_SECRET_ACCESS, {
            expiresIn: "10m",
        });
        return res.status(201).json({ accessToken });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.handleRefresh = handleRefresh;
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookies = req.cookies;
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refreshToken)) {
            return res.status(404).json({ message: "no refresh token provided" });
        }
        const deletedSession = yield Session_1.Session.findOneAndDelete({
            refreshToken: cookies.refreshToken,
        });
        if (!deletedSession) {
            return res.status(404).json({ message: "session does not exist" });
        }
        return res
            .status(200)
            .clearCookie("refreshToken")
            .json({ message: "done" });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.logOut = logOut;
