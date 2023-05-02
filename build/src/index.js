"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jet_logger_1 = __importDefault(require("jet-logger"));
const server_1 = __importDefault(require("./server"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Start the server
const PORT = process.env.PORT || 3001;
const jetLogger = jet_logger_1.default;
const options = {
    key: fs_1.default.readFileSync(path_1.default.join(__dirname, './cert/key.pem')),
    cert: fs_1.default.readFileSync(path_1.default.join(__dirname, './cert/cert.pem'))
};
var httpServer = http_1.default.createServer(server_1.default);
var httpsServer = https_1.default.createServer(options, server_1.default);
httpsServer.listen(PORT, () => {
    jetLogger.info('Express server started on port: ' + PORT);
});
exports.default = server_1.default;
//# sourceMappingURL=index.js.map