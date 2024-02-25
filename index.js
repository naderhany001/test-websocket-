const Queue = require("./queue");
const http = require("http");
const WebSocket = require("ws");

function parseCmd(rawcmd) {
  try {
    let tmp = rawcmd.split(" ");
    if (tmp[0] === "connect") {
      return {
        type: "connect",
        pc: tmp[2],
        drone: tmp[3]
      };
    }
    if (tmp[0] === "register") {
      return {
        type: "register",
        drone: tmp[2]
      };
    }
    if (tmp[0] === "disconnect") {
      return {
        type: "disconnect",
        pc: tmp[2]
      };
    }
  } catch (error) {
    return {
      type: "error",
      msg: "invalid command " + error
    };
  }
}

// requirements
// 1- connection map has drone and pc id's , ws
// 2- drone-speaker queue list
// 3- drone-mic queue list
let registeredDrones = new Map();
let connections = [];

function execCMD(cmd, ws) {
  // 1- parse cmd
  // 2- exec=>
  //      - connection => add the add connection to the connection list - find drone ws and you have pc ws
  //      - register   => add the drone-mic and drone-speaker queues to the droneSpeakers and droneMics lists
  //      - disconnect => remove the pc id from the connection list
  let c = parseCmd(cmd);
  if (c.type === "register") {
    connecedDevices.set(c.drone, ws);
  }
  if (c.type === "connect") {
  }
}

function handleEvents() {
  // 1- here we need to loop on each connection in the connection list
  // 2- in a connection if drone-speaker queue not empty then send to the drone
  // 3- in a connection if drone-mic is not empty then send to the pc
}

/************************ HTTP ************************/
const httpServer = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, WebSocket!\n");
});
httpServer.listen(8080, () => {
  console.log("HTTP server is running on port 8080");
});

/************************ WS ************************/
const wss = new WebSocket.Server({ server: httpServer });
let s = [];
wss.on("connection", function connection(ws, req) {
  console.log("WebSocket client connected");
  s.push(ws);
  const clientAddress = req.connection.remoteAddress;
  console.log('WebSocket client connected from:', clientAddress);
  ws.on("message", function incoming(message) {
    console.log("Received: %s", message);

    ws.send("Echo: " + message);
  });

  // Event listener for when a client disconnects from the server
  ws.on("close", function() {
    console.log("WebSocket client disconnected");
  });
});

function printHello() {
  //   console.log("Hello, world!");
  if (s.length > 0) {
    for (let i in s) {
      try {
        s[i].send("hello by nader server", i);
      } catch (error) {
        console.log("error not found");
      }
    }
  }
}

// Set interval to execute printHello function every 1000 milliseconds (1 second)
const intervalId = setInterval(printHello, 1000);

// Stop the interval after 10 seconds (for demonstration purposes)
// console.log('WebSocket server is running on port 8080');

///// test /////
// // Example usage:
// const queue = new Queue("nader hany1");
// queue.enqueue(10);
// queue.enqueue(20);
// queue.enqueue(30);
// const queue2 = new Queue("nader hany2");
// queue2.enqueue(1);
// queue2.enqueue(2);
// queue2.enqueue(3);
// queue2.enqueue(4);
// const queue3 = new Queue("nader hany3");
// queue3.enqueue(11);
// queue3.enqueue(22);
// queue3.enqueue(33);
// queue3.enqueue(44);
// // List of Queues
// const queueList = [];

// // adding element list
// queueList.push(queue);
// queueList.push(queue2);
// queueList.push(queue3);
// // printing list
// for (let i in queueList) {
//   console.log("queue id: ", queueList[i].id);
//   console.log("queue items: ", queueList[i].printQueue());
//   console.log("********************************");
// }

// // removing element list
// for (let i in queueList) {
//   if (queueList[i].id == "nader hany2") {
//     queueList.splice(i, 1);
//   }
// }

// // printing list
// for (let i in queueList) {
//   console.log("queue id: ", queueList[i].id);
//   console.log("queue items: ", queueList[i].printQueue());
//   console.log("********************************");
// }
