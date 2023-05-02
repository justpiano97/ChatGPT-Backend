"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../services/db");
const user_1 = __importDefault(require("./user"));
const Subscription = db_1.DB.define('Subscription', {
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: user_1.default,
            key: "id"
        }
    },
    plan_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    stripe_product_id: {
        type: sequelize_1.DataTypes.STRING,
    },
    stripe_subscription_id: {
        type: sequelize_1.DataTypes.STRING,
    },
    start_date: {
        type: sequelize_1.DataTypes.DATE,
    },
    end_date: {
        type: sequelize_1.DataTypes.DATE,
    },
    trial_period_start: {
        type: sequelize_1.DataTypes.DATE,
    },
    trial_period_end: {
        type: sequelize_1.DataTypes.DATE
    }
});
exports.default = Subscription;
//# sourceMappingURL=subscription.js.map