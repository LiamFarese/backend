"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const mongoose_1 = require("mongoose");
const SessionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    refreshToken: { type: String, required: true },
}, { timestamps: true, expires: 86400000 });
const Session = (0, mongoose_1.model)("Session", SessionSchema);
exports.Session = Session;
