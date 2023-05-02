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
exports.createEmbedding = exports.splitChunk = void 0;
const axios_1 = __importDefault(require("axios"));
const splitChunk = (sentenceList) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, axios_1.default)(`${process.env.CORE_API_ENDPOINT}/split-chunks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: { sentenceList },
    });
    const { chunkList } = res.data;
    return chunkList;
});
exports.splitChunk = splitChunk;
const createEmbedding = (chunks, ip, fileName, apiKey) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, axios_1.default)(`${process.env.CORE_API_ENDPOINT}/embedding`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            sentenceList: chunks,
            apiKey,
            ip,
            fileName,
            delay: 0,
        },
    });
});
exports.createEmbedding = createEmbedding;
//# sourceMappingURL=helper.js.map