import logger from 'jet-logger';
import app from './server';
import http from 'http';
import https from 'https';
import path from 'path';
import fs from 'fs';

// Start the server
const PORT = process.env.PORT || 3001;

const jetLogger = logger;

// const options = {
//   key:fs.readFileSync(path.join(__dirname,'./cert/key.pem')),
//   cert:fs.readFileSync(path.join(__dirname,'./cert/cert.pem'))
//   }
var httpServer = http.createServer(app);
// var httpsServer = https.createServer(options, app);

httpServer.listen(PORT, () => {
  jetLogger.info('Express server started on port: ' + PORT);
});

export default app;