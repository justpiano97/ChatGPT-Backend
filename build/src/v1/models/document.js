"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../services/db");
const chat_1 = __importDefault(require("./chat"));
const Document = db_1.DB.define('Document', {
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
    },
    uid: {
        type: sequelize_1.DataTypes.STRING,
    },
    ip: {
        type: sequelize_1.DataTypes.STRING,
    },
    total_pages: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    s3_link: {
        type: sequelize_1.DataTypes.STRING,
    },
});
Document.hasOne(chat_1.default, { foreignKey: 'document_id' });
exports.default = Document;
//# sourceMappingURL=document.js.map