"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET_REFRESH = exports.JWT_SECRET_ACCESS = exports.SERVER_PORT = exports.MONGO_URL = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
exports.MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@mycluster.xupp2pc.mongodb.net/?retryWrites=true&w=majority`;
exports.SERVER_PORT = process.env.SERVER_PORT
    ? Number(process.env.SERVER_PORT)
    : 1337;
/** token secret */
exports.JWT_SECRET_ACCESS = process.env
    .JWT_SECRET_ACCESS;
exports.JWT_SECRET_REFRESH = process.env
    .JWT_SECRET_REFRESH;
