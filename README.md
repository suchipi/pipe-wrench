# pipe-wrench

`pipe-wrench` is a cross-platform IPC client/server implementation. It uses named pipes on windows and unix sockets elsewhere.

## Installation

```
$ npm install --save pipe-wrench
```

## Usage

Server:
```js
const { server, cleanup } = require("pipe-wrench");

server("some-unique-identifier", (socket) => {
  // This callback gets called whenever a client connects.
  // socket is a node net.Socket.
});

process.on("exit", () => {
  cleanup(); // Cleans up sockets that were created by pipe-wrench.
});
```

Client:
```js
const { client } = require("pipe-wrench");

const socket = client("some-unique-identifier"); // same identifier as on the server
// socket is a node net.Socket.
```
