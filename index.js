const net = require("net");
const fs = require("fs");
const os = require("os");
const path = require("path");

const isWin = (process.platform === "win32");
const filesToRemove = new Set();

function getSocketName(uniqueIdentifier) {
  if (isWin) {
    return "\\\\.\\pipe\\" + uniqueIdentifier;
  } else {
    return path.join(os.tmpdir(), uniqueIdentifier);
  }
}

function server(uniqueIdentifier, connectionCallback, closeCallback) {
  const socketName = getSocketName(uniqueIdentifier);
  if (!isWin) {
    filesToRemove.add(socketName);
  }
  const server = net.createServer();
  server.on("connection", connectionCallback);

  if (closeCallback) {
    server.on("close", closeCallback);
  }

  server.listen(socketName);
}

function cleanup() {
  if (isWin) { return; } // named pipes are automatically removed
  filesToRemove.forEach(fs.unlinkSync);
}

function client(uniqueIdentifier) {
  const socketName = getSocketName(uniqueIdentifier);
  return net.connect(socketName);
}

module.exports = {
  server,
  client,
  cleanup,
}