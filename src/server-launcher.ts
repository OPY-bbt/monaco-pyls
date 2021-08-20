import * as rpc from "@codingame/monaco-jsonrpc";
import * as server from "@codingame/monaco-jsonrpc/lib/server";
import * as lsp from "vscode-languageserver";

export function launch(socket: rpc.IWebSocket) {
    const reader = new rpc.WebSocketMessageReader(socket);
    const writer = new rpc.WebSocketMessageWriter(socket);

    const socketConnection = server.createConnection(reader, writer, () => socket.dispose());

    /**
     * export function createServerProcess(serverName: string, command: string, args?: string[], options?: cp.SpawnOptions): IConnection {
     *   const serverProcess = cp.spawn(command, args, options);
     *   ...
     */
    const serverConnection = server.createServerProcess('monacoPyls', 'pyls');

    server.forward(socketConnection, serverConnection, message => {
        if (rpc.isRequestMessage(message)) {
            if (message.method === lsp.InitializeRequest.type.method) {
                const initializeParams = message.params as lsp.InitializeParams;
                initializeParams.processId = process.pid;
            }
        }
        return message;
    });
}
