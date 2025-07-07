import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 8080 });
interface User {
    socket: WebSocket;
    room: string;
}
let allSockets: User[] = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        //@ts-ignore
        const parsedMessage = JSON.parse(message.toString());
        if (parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId  
            })
        }
        if (parsedMessage.type == "chat") {
            const currentUserRoom = allSockets.find((x) => x.socket === socket);
            //@ts-ignore
            const broadcastSockets = allSockets.filter((x) => x.room === currentUserRoom.room);
            const broadcastMessage = broadcastSockets.forEach((s) => s.socket.send(parsedMessage.payload.message));
            return broadcastMessage;
        }
    })
})