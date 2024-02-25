// Import required modules
const http = require('http');
const WebSocket = require('ws');

// Create an HTTP server
const httpServer = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello, WebSocket!\n');
});

// Attach the HTTP server to listen on port 8080
httpServer.listen(8080, () => {
  console.log('HTTP server is running on port 8080');
});

// Create a WebSocket server instance
const wss = new WebSocket.Server({ server: httpServer });

// Event listener for when a client connects to the WebSocket server
wss.on('connection', function connection(ws) {
  console.log('WebSocket client connected');

  // Event listener for when the server receives a message from a client
  ws.on('message', function incoming(message) {
    console.log('Received: %s', message);

    // Echo the received message back to the client
    ws.send('Echo: ' + message);
  });

  // Event listener for when a client disconnects from the server
  ws.on('close', function() {
    console.log('WebSocket client disconnected');
  });
});

console.log('WebSocket server is running on port 8080');



// // Import required modules
// const WebSocket = require('ws');

// // Create a WebSocket server instance
// const wss = new WebSocket.Server({ port: 8080 });

// // Event listener for when a client connects to the server
// wss.on('connection', function connection(ws) {
//   console.log('Client connected');

//   // Event listener for when the server receives a message from a client
//   ws.on('message', function incoming(message) {
//     console.log('Received: %s', message);

//     // Echo the received message back to the client
//     ws.send('Echo: ' + message);
//   });

//   // Event listener for when a client disconnects from the server
//   ws.on('close', function() {
//     console.log('Client disconnected');
//   });
// });

// console.log('WebSocket server is running on port 8080');
