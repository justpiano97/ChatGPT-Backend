"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../services/db");
const RefreshToken = db_1.DB.define('RefreshToken', {
    jti: {
        type: sequelize_1.DataTypes.STRING
    },
    hashed_token: {
        type: sequelize_1.DataTypes.STRING,
    },
    user_id: {
        type: sequelize_1.DataTypes.STRING
    },
    revoked: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
});
exports.default = RefreshToken;
//# sourceMappingURL=refreshToken.js.map