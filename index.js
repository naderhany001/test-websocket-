const { log } = require("console");
const Queue = require("./queue");
const http = require("http");
const WebSocket = require("ws");


let registeredDevices = new Map();
let connections = new Map();

function removeNoise(prefix, array) {
  // Convert the prefix to the number of bytes
  let bytesToRemove = prefix ; // Assuming prefix is represented in hexadecimal format
  let trimmedArray = array.slice(bytesToRemove);
  let removedBytes = array.slice(0, bytesToRemove);
  let removedString = removedBytes.toString('utf-8'); 
  // console.log("Removed bytes as string:", removedString);
  return trimmedArray;
}

function execCMD(cmd, ws) {
  let c = parseCmd(cmd);

  if (c.type === "register") {
    registeredDevices.set(c.device, { id: c.device, socket: ws, busy: false });
    console.log("registering ", c.device);
  }
  if (c.type === "connect") {
    let a = registeredDevices.get(c.drone);
    console.log("connecting ", c.pc, "with ", a.id);
    connections.set(c.pc, registeredDevices.get(c.drone));
    connections.set(c.drone, registeredDevices.get(c.pc));
  }
  if (c.type === "disconnect") {
    let tmp = connections.get(c.pc).id;
    connections.delete(c.pc);
    connections.delete(tmp);
    ws.send("disconnected");
  }
  if (c.type === "stream") {
    connections.get(c.device).socket.send(c.stream);
    // let decodedData = Buffer.from(c.stream, 'base64');
    // Send the decoded data as bytes
    // connections.get(c.device).socket.send(decodedData);
  }
}

function parseCmd(rawcmd) {
  try {
    let tmp = rawcmd.toString().split(" ");
    if (tmp[0] === "connect") {
      return {
        type: "connect",
        pc: tmp[1],
        drone: tmp[2]
      };
    }
    if (tmp[0] === "register") {
      return {
        type: "register",
        device: tmp[1]
      };
    }
    if (tmp[0] === "disconnect") {
      return {
        type: "disconnect",
        pc: tmp[1]
      };
    }
    if (tmp[0] === "stream") {
      let strr =tmp[0]+' '+tmp[1]+' ';
      const len = strr.length;

      return {
        type: "stream",
        device: tmp[1],
        stream: removeNoise(len,rawcmd)
      };
    }
  } catch (error) {
    return {
      type: "error",
      msg: "invalid command " + error
    };
  }
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
  ws.on("message", function incoming(message) {

    execCMD(message, ws);
  });

  ws.on("close", function() {
    console.log("WebSocket client disconnected");
  });
});

// function printHello() {
//   //   console.log("Hello, world!");
//   if (s.length > 0) {
//     for (let i in s) {
//       try {
//         s[i].send("hello by nader server", i);
//       } catch (error) {
//         console.log("error not found");
//       }
//     }
//   }
// }

// // Set interval to execute printHello function every 1000 milliseconds (1 second)
// const intervalId = setInterval(printHello, 1000);

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
