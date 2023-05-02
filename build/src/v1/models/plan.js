"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../services/db");
const Plan = db_1.DB.define('Plan', {
    name: {
        type: sequelize_1.DataTypes.STRING
    },
    stripe_product_id: {
        type: sequelize_1.DataTypes.STRING
    },
    stripe_product_annual_id: {
        type: sequelize_1.DataTypes.STRING
    },
    pages: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    pdf: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    query: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    size: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    users: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    price: {
        type: sequelize_1.DataTypes.INTEGER,
    },
});
exports.default = Plan;
//# sourceMappingURL=plan.js.map