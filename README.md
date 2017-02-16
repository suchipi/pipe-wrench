# pipe-wrench

`pipe-wrench` is a cross-platform IPC client/server implementation. It uses named pipes on windows and unix sockets elsewhere.

## Installation

```
$ npm install --save pipe-wrench
```

## Usage

Server:
```js
const { server } = require("pipe-wrench");

const cleanup = server("some-unique-identifier", (socket) => {
  // This callback gets called whenever a client connects.
  // socket is a node net.Socket.
});
// Returns a cleanup function that removes the unix socket on unix systems
// and is a no-op on win32 (named pipes are automatically cleaned up).

process.on("exit", () => {
  cleanup(); // If you forget to call this, on unix systems, an unused socket will remain in /tmp.
});
```

Client:
```js
const { client } = require("pipe-wrench");

const socket = client("some-unique-identifier"); // same identifier as on the server
// socket is a node net.Socket.
```
