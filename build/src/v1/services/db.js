"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = exports.testDBConnection = void 0;
const dotenv = __importStar(require("dotenv"));
const sequelize_1 = require("sequelize");
dotenv.config();
const DB = new sequelize_1.Sequelize(((_a = process.env.DB_NAME) !== null && _a !== void 0 ? _a : ''), ((_b = process.env.DB_USER) !== null && _b !== void 0 ? _b : ''), ((_c = process.env.DB_PASSWORD) !== null && _c !== void 0 ? _c : ''), {
    host: process.env.DB_HOST,
    dialect: 'postgres'
});
exports.DB = DB;
const testDBConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield DB.authenticate();
        console.log("Database connection has been established successfully.");
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
});
exports.testDBConnection = testDBConnection;
//# sourceMappingURL=db.js.map