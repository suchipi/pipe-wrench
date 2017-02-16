var net = require("net");
var fs = require("fs");
var os = require("os");
var path = require("path");

var isWin = (process.platform === "win32");

function getSocketName(uniqueIdentifier) {
  if (isWin) {
    return "\\\\.\\pipe\\" + uniqueIdentifier;
  } else {
    return path.join(os.tmpdir(), uniqueIdentifier);
  }
}

function server(uniqueIdentifier, connectionCallback, closeCallback) {
  var socketName = getSocketName(uniqueIdentifier);
  var server = net.createServer();
  server.on("connection", connectionCallback);

  if (closeCallback) {
    server.on("close", closeCallback);
  }

  server.listen(socketName);

  return function cleanup() {
    if (isWin) { return; } // named pipes are automatically removed
    if (fs.existsSync(socketName)) {
      fs.unlinkSync(socketName);
    }
  };
}

function client(uniqueIdentifier) {
  var socketName = getSocketName(uniqueIdentifier);
  return net.connect(socketName);
}

module.exports = {
  server: server,
  client: client,
}
