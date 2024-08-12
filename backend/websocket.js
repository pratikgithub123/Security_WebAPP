const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const clients = new Set();

wss.on('connection', ws => {
  clients.add(ws);

  ws.on('message', message => {
    // Handle messages from clients
  });

  ws.on('close', () => {
    clients.delete(ws);
  });

  // Example of broadcasting a message to all clients
  const broadcast = (message) => {
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // Example of sending an update to all clients
  const sendUpdate = (userId, count) => {
    const message = JSON.stringify({ type: 'UPDATE_CART', data: { userId, count } });
    broadcast(message);
  };

  // Call sendUpdate whenever you need to broadcast cart updates
  // sendUpdate('123', 5); // Example call
});
