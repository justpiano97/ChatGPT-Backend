"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../services/db");
const plan_1 = __importDefault(require("./plan"));
const subscription_1 = __importDefault(require("./subscription"));
const User = db_1.DB.define('User', {
    email: {
        type: sequelize_1.DataTypes.STRING,
    },
    google_id: {
        type: sequelize_1.DataTypes.STRING,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
    },
    picture: {
        type: sequelize_1.DataTypes.STRING,
    },
    current_plan_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    stripe_customer_id: {
        allowNull: true,
        type: sequelize_1.DataTypes.STRING,
    },
    role: {
        type: sequelize_1.DataTypes.INTEGER,
    },
});
User.belongsTo(plan_1.default, { foreignKey: 'current_plan_id' });
User.hasOne(subscription_1.default, { foreignKey: 'user_id' });
exports.default = User;
//# sourceMappingURL=user.js.map