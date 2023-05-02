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
exports.generateEmbedding = exports.deleteUsersDocumentById = exports.getUsersDocumentById = exports.getUsersDocuments = exports.createDocumentHistory = void 0;
const http_status_codes_1 = require("http-status-codes");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const path_1 = __importDefault(require("path"));
const document_1 = __importDefault(require("../../models/document"));
const chat_1 = __importDefault(require("../../models/chat"));
const helper_1 = require("../../utils/helper");
const createDocumentHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, uid, total_pages, messages } = req.body;
    const { id } = res.locals.payload;
    let existDoc = yield document_1.default.findOne({ where: { uid } });
    if (!existDoc) {
        const { file } = req === null || req === void 0 ? void 0 : req.files;
        file.name = `${name.replace(/\.[^/.]+$/, '')}-${uid}${path_1.default.parse(file.name).ext}`;
        const blob = file.data;
        aws_sdk_1.default.config.update({
            accessKeyId: process.env.AWS_S3_ACCESSKEYID,
            secretAccessKey: process.env.AWS_S3_SECRETACCESSKEY
        });
        const s3 = new aws_sdk_1.default.S3();
        const params = {
            Bucket: `${process.env.AWS_S3_BUCKETNAME}`,
            Key: `${file.name}`,
            Body: blob
        };
        const uploadedImage = yield s3.upload(params).promise();
        existDoc = yield document_1.default.create({
            user_id: id,
            name: name,
            uid: uid,
            ip: null,
            total_pages: parseInt(total_pages !== null && total_pages !== void 0 ? total_pages : 0),
            s3_link: uploadedImage.Location,
        });
    }
    const existChat = yield chat_1.default.findOne({ where: { document_id: existDoc.dataValues.id } });
    if (existChat) {
        yield chat_1.default.update({
            messages: JSON.parse(messages),
        }, {
            where: {
                id: existChat.dataValues.id
            }
        });
    }
    else {
        yield chat_1.default.create({
            user_id: id,
            document_id: existDoc.dataValues.id,
            chat_name: `${name.replace(/\.[^/.]+$/, '')}-${uid}`,
            messages: JSON.parse(messages),
        });
    }
    const message = yield chat_1.default.findOne({ where: { document_id: existDoc.dataValues.id } });
    res.status(http_status_codes_1.StatusCodes.OK).json({ file: existDoc, message });
});
exports.createDocumentHistory = createDocumentHistory;
const getUsersDocuments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = res.locals.payload;
    const documents = yield document_1.default.findAll({ where: { user_id: id } });
    res.status(http_status_codes_1.StatusCodes.OK).json({ documents });
});
exports.getUsersDocuments = getUsersDocuments;
const getUsersDocumentById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const { id } = req.params;
    const document = yield document_1.default.findOne({ where: { id: parseInt(id) } });
    const chatting = yield chat_1.default.findOne({ where: { document_id: (_a = document === null || document === void 0 ? void 0 : document.dataValues) === null || _a === void 0 ? void 0 : _a.id } });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        name: (_b = document === null || document === void 0 ? void 0 : document.dataValues) === null || _b === void 0 ? void 0 : _b.name,
        uid: (_c = document === null || document === void 0 ? void 0 : document.dataValues) === null || _c === void 0 ? void 0 : _c.uid,
        file: null,
        ip: (_d = document === null || document === void 0 ? void 0 : document.dataValues) === null || _d === void 0 ? void 0 : _d.ip,
        s3_url: (_e = document === null || document === void 0 ? void 0 : document.dataValues) === null || _e === void 0 ? void 0 : _e.s3_link,
        active: true,
        total_pages: (_f = document === null || document === void 0 ? void 0 : document.dataValues) === null || _f === void 0 ? void 0 : _f.total_pages,
        messages: (_g = chatting === null || chatting === void 0 ? void 0 : chatting.dataValues) === null || _g === void 0 ? void 0 : _g.messages,
        isEmbedded: true,
    });
});
exports.getUsersDocumentById = getUsersDocumentById;
const deleteUsersDocumentById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield document_1.default.destroy({ where: { id: parseInt(id) } });
    yield chat_1.default.destroy({ where: { document_id: parseInt(id) } });
    res.status(http_status_codes_1.StatusCodes.OK).json("OK");
});
exports.deleteUsersDocumentById = deleteUsersDocumentById;
const generateEmbedding = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { sentence_list, ip, file_name, apiKey } = req.body;
    const chunkList = yield (0, helper_1.splitChunk)(sentence_list);
    const chunkSize = chunkList.length > 80 ? 80 : Number(chunkList.length);
    const chunks = [];
    for (let i = 0; i < chunkList.length; i += chunkSize) {
        chunks.push(chunkList.slice(i, i + chunkSize));
    }
    yield Promise.all(chunks.map((chunk) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, helper_1.createEmbedding)(chunk, ip, file_name, apiKey);
    })));
    res.status(http_status_codes_1.StatusCodes.OK).json("OK");
});
exports.generateEmbedding = generateEmbedding;
//# sourceMappingURL=chat.controller.js.map