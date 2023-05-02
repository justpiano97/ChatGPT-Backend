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
exports.logout = exports.refreshToken = exports.authorizeUser = void 0;
const { OAuth2Client } = require('google-auth-library');
const http_status_codes_1 = require("http-status-codes");
const googleapis_1 = require("googleapis");
const uuid_1 = require("uuid");
const user_1 = __importDefault(require("../../models/user"));
const plan_1 = __importDefault(require("../../models/plan"));
const document_1 = __importDefault(require("../../models/document"));
const refreshToken_1 = __importDefault(require("../../models/refreshToken"));
const jwt_1 = require("../../utils/jwt");
const hash_token_1 = require("../../utils/hash_token");
const axios_1 = __importDefault(require("axios"));
const subscription_1 = __importDefault(require("../../models/subscription"));
const oauth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
const authorizeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        const { tokens } = req.body;
        oauth2Client.setCredentials(tokens);
        const { data } = yield googleapis_1.google.oauth2('v2').userinfo.get({ auth: oauth2Client });
        let profile = yield user_1.default.findOne({ where: { google_id: data === null || data === void 0 ? void 0 : data.id }, include: [plan_1.default, subscription_1.default] });
        if (!profile) {
            const created = yield user_1.default.create({ email: data === null || data === void 0 ? void 0 : data.email, google_id: data === null || data === void 0 ? void 0 : data.id, name: data === null || data === void 0 ? void 0 : data.name, picture: data === null || data === void 0 ? void 0 : data.picture, current_plan_id: 1 });
            profile = yield user_1.default.findOne({ where: { id: created.dataValues.id }, include: [plan_1.default, subscription_1.default] });
        }
        const jti = (0, uuid_1.v4)();
        const { refreshToken, accessToken } = (0, jwt_1.generateTokens)({ id: ((_a = profile === null || profile === void 0 ? void 0 : profile.dataValues) === null || _a === void 0 ? void 0 : _a.id), email: ((_b = profile === null || profile === void 0 ? void 0 : profile.dataValues) === null || _b === void 0 ? void 0 : _b.email) }, jti);
        yield refreshToken_1.default.create({ jti: jti, hashed_token: (0, hash_token_1.hashToken)(refreshToken), user_id: (_c = profile === null || profile === void 0 ? void 0 : profile.dataValues) === null || _c === void 0 ? void 0 : _c.id });
        // Get files in google drive
        const url = `${process.env.GOOGLE_DRIVE_API_BASE_URL}/files`;
        let files = [];
        const headers = {
            Authorization: `Bearer ${tokens.access_token}`,
            "Content-Type": "application/json",
        };
        try {
            const response = yield axios_1.default.get(url, { headers });
            files = (_f = (_e = ((_d = response === null || response === void 0 ? void 0 : response.data) !== null && _d !== void 0 ? _d : [])) === null || _e === void 0 ? void 0 : _e.files) === null || _f === void 0 ? void 0 : _f.filter((file) => file.name.split(".").pop() == "pdf");
        }
        catch (error) {
            files = [];
        }
        // get file hisotry
        const documents = yield document_1.default.findAll({ where: { user_id: (_g = profile === null || profile === void 0 ? void 0 : profile.dataValues) === null || _g === void 0 ? void 0 : _g.id } });
        res.status(http_status_codes_1.StatusCodes.OK).json({ tokens: { refreshToken, accessToken }, user: profile, recent: documents, files });
    }
    catch (err) {
        res.sendStatus(500);
    }
});
exports.authorizeUser = authorizeUser;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j, _k, _l, _m, _o, _p;
    const { token, google_token } = req.body;
    if (!token) {
        return next({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: 'Some required fields are missing',
        });
    }
    const payload = (0, jwt_1.verifyToken)(token);
    const savedRefreshToken = yield refreshToken_1.default.findOne({
        where: {
            jti: payload.jti,
        },
    });
    if (!savedRefreshToken || savedRefreshToken.dataValues.revoked === true) {
        return next({
            status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            message: 'Token is expired',
        });
    }
    if ((0, hash_token_1.hashToken)(token) !== savedRefreshToken.dataValues.hashed_token) {
        return next({
            status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            message: 'Token is not match',
        });
    }
    if (Date.now() > payload.exp * 1000) {
        return next({
            status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            message: 'Token is expired',
        });
    }
    const user = yield user_1.default.findOne({ where: { id: payload.id }, include: [plan_1.default, subscription_1.default] });
    if (!user) {
        return next({
            status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            message: 'no user',
        });
    }
    const jti = (0, uuid_1.v4)();
    const { refreshToken, accessToken } = (0, jwt_1.generateTokens)({ id: ((_h = user === null || user === void 0 ? void 0 : user.dataValues) === null || _h === void 0 ? void 0 : _h.id), email: ((_j = user === null || user === void 0 ? void 0 : user.dataValues) === null || _j === void 0 ? void 0 : _j.email) }, jti);
    yield refreshToken_1.default.create({
        jti: jti, hashed_token: (0, hash_token_1.hashToken)(refreshToken), user_id: (_k = user === null || user === void 0 ? void 0 : user.dataValues) === null || _k === void 0 ? void 0 : _k.id
    });
    // Get files in google drive
    const url = `${process.env.GOOGLE_DRIVE_API_BASE_URL}/files`;
    let files = [];
    const headers = {
        Authorization: `Bearer ${google_token}`,
        "Content-Type": "application/json",
    };
    try {
        const response = yield axios_1.default.get(url, { headers });
        files = (_o = ((_m = (_l = response === null || response === void 0 ? void 0 : response.data) === null || _l === void 0 ? void 0 : _l.files) !== null && _m !== void 0 ? _m : [])) === null || _o === void 0 ? void 0 : _o.filter((file) => file.name.split(".").pop() == "pdf");
    }
    catch (error) {
        files = [];
    }
    // get file hisotry
    const documents = yield document_1.default.findAll({ where: { user_id: (_p = user === null || user === void 0 ? void 0 : user.dataValues) === null || _p === void 0 ? void 0 : _p.id } });
    res.status(http_status_codes_1.StatusCodes.OK).json({ tokens: { refreshToken, accessToken }, user, recent: documents, files });
});
exports.refreshToken = refreshToken;
const logout = (req, res) => {
    res.clearCookie('access_token');
    res.redirect('/');
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map