var io = require('socket.io').listen(8000); 
io.origins("*:*");
const { Board, Proximity } = require("johnny-five");
const board = new Board({port: "COM7"});

var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('index.html');
 
http.createServer(function(req,res){
	// Set CORS headers
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	res.setHeader('Access-Control-Allow-Headers', '*');
	
		res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
		
}).listen(9000);
io.sockets.on('connection', function (socket) {
	console.log('connected');

	// If socket.io receives message from the client browser then 
    // this call back will be executed.
    socket.on('message', function (msg) {
    	console.log(msg);
    });

    // If a web browser disconnects from Socket.IO then this callback is called.
    socket.on('disconnect', function () {
    	console.log('disconnected');
    });
});


board.on("ready", () => {
  const proximity = new Proximity({
    controller: "HCSR04",
    pin: 7
  });

  proximity.on("change", () => {
    
    
    const {centimeters, inches} = proximity;
   
    io.emit("distance", centimeters);
    //console.log("Proximity: ");
    //console.log("  cm  : ", centimeters);
    //console.log("-----------------");
  });
});