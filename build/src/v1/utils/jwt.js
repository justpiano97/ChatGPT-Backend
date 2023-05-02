"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateTokens = exports.generateRefreshToken = exports.generateAccessToken = void 0;
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.JWT_SECRET || 'secret';
const generateAccessToken = (payload) => jsonwebtoken_1.default.sign(payload, SECRET, { expiresIn: '1h', algorithm: 'HS256' });
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload, jti) => jsonwebtoken_1.default.sign(Object.assign(Object.assign({}, payload), { jti }), SECRET, { expiresIn: '24h', algorithm: 'HS256' });
exports.generateRefreshToken = generateRefreshToken;
const generateTokens = (payload, jti) => {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload, jti);
    return {
        accessToken,
        refreshToken,
    };
};
exports.generateTokens = generateTokens;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, SECRET);
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.js.map