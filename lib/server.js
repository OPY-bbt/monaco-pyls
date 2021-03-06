"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws = require("ws");
const url = require("url");
const express = require("express");
const server_launcher_1 = require("./server-launcher");
process.on('uncaughtException', function (err) {
    console.error('Uncaught Exception: ', err.toString());
    if (err.stack) {
        console.error(err.stack);
    }
});
// create the express application
const app = express();
// server the static content, i.e. index.html
app.use(express.static(__dirname));
// start the server
const server = app.listen(3000);
// create the web socket
const wss = new ws.Server({
    noServer: true,
    perMessageDeflate: false
});
server.on('upgrade', (request, socket, head) => {
    const pathname = request.url ? url.parse(request.url).pathname : undefined;
    if (pathname === '/sampleServer') {
        wss.handleUpgrade(request, socket, head, webSocket => {
            const socket = {
                send: content => webSocket.send(content, error => {
                    if (error) {
                        throw error;
                    }
                }),
                onMessage: cb => webSocket.on('message', cb),
                onError: cb => webSocket.on('error', cb),
                onClose: cb => webSocket.on('close', cb),
                dispose: () => webSocket.close()
            };
            // launch the server when the web socket is opened
            if (webSocket.readyState === webSocket.OPEN) {
                server_launcher_1.launch(socket);
            }
            else {
                webSocket.on('open', () => server_launcher_1.launch(socket));
            }
        });
    }
});
//# sourceMappingURL=server.js.map