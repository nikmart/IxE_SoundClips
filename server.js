var express = require('express'); // web server application
var http = require('http');				// http basics
var app = express();							// instantiate express server
var server = http.Server(app);		// connects http library to server
var io = require('socket.io')(server);	// connect websocket library to server
//var serialport = require('serialport');	// serial library
var serverPort = 8000;
var child_process = require('child_process');
var exec = child_process.exec;

// use express to create the simple webapp
app.use(express.static('public'));		// find pages in public directory

// check to make sure that the user calls the serial port for the arduino when
// running the server
//if(!process.argv[2]) {
//    console.error('Usage: node '+process.argv[1]+' SERIAL_PORT');
//    process.exit(1);
//}

// start the serial port connection and read on newlines
//var serial = new serialport.SerialPort(process.argv[2], {
//    parser: serialport.parsers.readline('\r\n')
//});

// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
    console.log('a user connected');

    // if you get the 'play' message, play the clip number by id
    socket.on('play', function(id) {
        console.log('play sound', id);
        //serial.write('H');

        //exec(command, callback); play a sound from the sound clips libary using ALSA aplay
        exec('aplay ~/Music/Sample-NLUs/sound-' + id + '.wav', function(err,stdout,stderr) {
          if (err) {
            console.log('Child process exited with error code', err.code);
            return
          }
          console.log(stdout);
        });
    });

    // if you get the 'ledOFF' msg, send an 'H' to the arduino
    socket.on('ledOFF', function() {
        console.log('ledOFF');
        //serial.write('L');
    });

    // if you get the 'disconnect' message, say the user disconnected
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

// this is the serial port event handler.
// read the serial data coming from arduino - you must use 'data' as the first argument
// and send it off to the client using a socket message
//serial.on('data', function(data) {
//    console.log('data:', data);
//    io.emit('server-msg', data);
//});

// start the server and say what port it is on
server.listen(serverPort, function() {
    console.log('listening on *:%s', serverPort);
});
