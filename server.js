const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    console.log('Systemverbindung etabliert.');
    
    ws.on('message', function incoming(data) {
        // Leitet das eingehende Signal an alle anderen Clients (den Browser) weiter
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data.toString());
            }
        });
    });
});

console.log('Lokaler Relay-Server operativ auf Port 8080.');