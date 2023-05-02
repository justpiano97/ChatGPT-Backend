"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../services/db");
const Chat = db_1.DB.define('Chat', {
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    document_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    chat_name: {
        type: sequelize_1.DataTypes.STRING,
    },
    messages: {
        type: sequelize_1.DataTypes.JSON,
    },
});
exports.default = Chat;
//# sourceMappingURL=chat.js.map