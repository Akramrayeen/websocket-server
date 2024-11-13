const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', (ws) => {
    console.log('A new client connected');
    
    // When a client sends a message
    ws.on('message', (message) => {
        console.log('Received message:', message);
        const data = JSON.parse(message);
        
        if (data.type === 'playVideo') {
            console.log('Broadcasting video URL:', data.url);
            // Send the play video message to all clients
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'playVideo', url: data.url }));
                }
            });
        }

        if (data.type === 'videoPlaying' || data.type === 'videoPaused') {
            // Broadcast play/pause status to all clients
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: data.type }));
                }
            });
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('A client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8081');
