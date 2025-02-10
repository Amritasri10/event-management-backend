const { WebSocketServer } = require("ws");

let eventClients = {}; 

const setupWebSocket = (server) => {
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws, req) => {
        const url = req.url;
        const eventId = url.split("/events/")[1];

        if (!eventId) {
            ws.close();
            return;
        }

        if (!eventClients[eventId]) eventClients[eventId] = [];
        eventClients[eventId].push(ws);

        console.log(`Client connected to event: ${eventId}`);

        ws.on("close", () => {
            eventClients[eventId] = eventClients[eventId].filter(client => client !== ws);
            console.log(`Client disconnected from event: ${eventId}`);
        });
    });

    return wss;
};

const broadcastUpdate = (eventId, message) => {
    if (eventClients[eventId]) {
        eventClients[eventId].forEach(client => {
            if (client.readyState === 1) client.send(JSON.stringify(message));
        });
    }
};

module.exports = { setupWebSocket, broadcastUpdate };
