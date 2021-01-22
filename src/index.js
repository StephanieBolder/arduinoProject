var io = require('socket.io').listen(8000); 
io.origins("*:*");
// Connectie leggen met Johnny-Five
const { Board, Proximity } = require("johnny-five");

// Connectie leggen met juiste port
const board = new Board({port: "COM7"});

var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('index.html');
 
http.createServer(function(req,res){
// CORS headers zetten
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	res.setHeader('Access-Control-Allow-Headers', '*');
	
		res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
		
}).listen(9000);
io.sockets.on('connection', function (socket) {
	console.log('connected');

	// Socket.IO krijgt  bericht = console.log laat 'message' zien
    socket.on('message', function (msg) {
    	console.log(msg);
    });

    // Socket.IO geen connectie meer = console.log laat 'disconnect' zien
    socket.on('disconnect', function () {
    	console.log('disconnected');
    });
});

    // Nieuw proximity opgeven
board.on("ready", () => {
  const proximity = new Proximity({
    controller: "HCSR04",
    pin: 7
  });

        // Proximity verandert = laat nieuwe zien
  proximity.on("change", () => {
    const {centimeters, inches} = proximity;
    io.emit("distance", centimeters);
  });
});