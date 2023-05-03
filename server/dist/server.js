"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const config_1 = require("./config/config");
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const items_1 = __importDefault(require("./routes/items"));
const orders_1 = __importDefault(require("./routes/orders"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
/* connect to mongoose*/
mongoose_1.default
    .connect(config_1.MONGO_URL)
    .then(() => {
    console.log(`Connected to MongoDB`);
    startServer();
})
    .catch((error) => {
    console.log(error);
});
/**If connection to MongoDB is successful the server will start */
const startServer = () => {
    /** Middleware to control access to server */
    app.use((0, helmet_1.default)());
    app.use((0, morgan_1.default)("dev"));
    app.use((0, cors_1.default)());
    /**middleware for parsing data*/
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    /** Routes */
    app.use("/auth", auth_1.default);
    app.use("/users", users_1.default);
    app.use("/items", items_1.default);
    app.use("/orders", orders_1.default);
    /** Health check */
    app.get("/health-check", (req, res, next) => res.status(200).json({ message: "server is healthy" }));
    /** Error Handling */
    app.use((req, res, next) => {
        const error = new Error("endpoint not found");
        console.error(error);
        return res.status(404).json({ message: error.message });
    });
    app.listen(config_1.SERVER_PORT, () => console.log(`server is running on port ${config_1.SERVER_PORT}`));
};
