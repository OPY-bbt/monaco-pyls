"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.launch = void 0;
const rpc = require("@codingame/monaco-jsonrpc");
const server = require("@codingame/monaco-jsonrpc/lib/server");
const lsp = require("vscode-languageserver");
function launch(socket) {
    const reader = new rpc.WebSocketMessageReader(socket);
    const writer = new rpc.WebSocketMessageWriter(socket);
    const socketConnection = server.createConnection(reader, writer, () => socket.dispose());
    const serverConnection = server.createServerProcess('monacoPyls', 'pyls');
    server.forward(socketConnection, serverConnection, message => {
        if (rpc.isRequestMessage(message)) {
            if (message.method === lsp.InitializeRequest.type.method) {
                const initializeParams = message.params;
                initializeParams.processId = process.pid;
            }
        }
        return message;
    });
}
exports.launch = launch;
//# sourceMappingURL=server-launcher.js.map