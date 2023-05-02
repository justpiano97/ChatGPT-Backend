"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserById = exports.getUserById = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_1 = __importDefault(require("../../models/user"));
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_1.default.findOne({ where: { id: parseInt(`${id}`) } });
    if (!user) {
        return next({
            status: http_status_codes_1.StatusCodes.NOT_FOUND,
            message: "User no exist!"
        });
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ user });
});
exports.getUserById = getUserById;
const updateUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { data } = req.body;
    const user = yield user_1.default.findOne({ where: { id: parseInt(`${id}`) } });
    if (!user) {
        return next({
            status: http_status_codes_1.StatusCodes.NOT_FOUND,
            message: "User no exist!"
        });
    }
    yield user_1.default.update(Object.assign({}, data), {
        where: { id: parseInt(`${id}`) },
    });
    const updatedUser = yield user_1.default.findOne({ where: { id: parseInt(`${id}`) } });
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: updatedUser });
});
exports.updateUserById = updateUserById;
//# sourceMappingURL=user.controller.js.map