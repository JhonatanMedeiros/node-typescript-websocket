import * as WebSocket from 'ws';
import * as express from 'express';
import * as http from 'http';

const app = express();

const server = http.createServer(app);

const wss: WebSocket.Server = new WebSocket.Server({
  server: server,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed.
  }
});


wss.on('error', err => {
	console.dir(err);
});

wss.on('connection', (socket, req) => {
	console.log('WebSocket client connected...');

	socket.on('error', err => {
		console.dir(err);
	});

	socket.on('message', data => {
		console.log(data);
		console.log('*** WS ***');
		console.log();
    socket.send(`You said: ${data}`);
    
    // Broadcast to everyone else.
    wss.clients.forEach(function each(client) {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });

	});

	socket.on('close', () => {
		console.log('Socket closed');
	});

});

wss.on('listening', () => {
	console.log('Listening...');
});

server.listen(3333);
