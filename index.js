// Import required modules
const WebSocket = require('ws');

// Create a WebSocket server instance
const wss = new WebSocket.Server({ port: 8080 });

// Event listener for when a client connects to the server
wss.on('connection', function connection(ws) {
  console.log('Client connected');

  // Event listener for when the server receives a message from a client
  ws.on('message', function incoming(message) {
    console.log('Received: %s', message);

    // Echo the received message back to the client
    ws.send('Echo: ' + message);
  });

  // Event listener for when a client disconnects from the server
  ws.on('close', function() {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on port 8080');
