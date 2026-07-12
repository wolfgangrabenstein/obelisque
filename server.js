const http = require('http');
const WebSocket = require('ws');

// 1. Basis-HTTP-Server (Befriedigt die Render Health-Checks)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Relay-Server operativ.');
});

// 2. WebSocket-Server an den HTTP-Server koppeln
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    console.log('Telemetrie-Verbindung etabliert.');

    ws.on('message', function incoming(data) {
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data.toString());
            }
        });
    });
});

// 3. Port-Bindung zwingend auf 0.0.0.0 für externe Zugriffe konfigurieren
const port = process.env.PORT || 8080;
server.listen(port, '0.0.0.0', () => {
    console.log(`Hybrider Relay-Server lauscht auf Port ${port}`);
});