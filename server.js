'use strict';

const express = require('express');
const socketIO = require('socket.io');
const ss = require('socket.io-stream');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  var tmpcstream = ss.createStream();
  var tmpstream = ss.createStream();
  socket.on('shreedakshina',(data)=>{io.emit('shreedakshina',data)});
  socket.on('jd-server',(data)=>{io.emit('jd-server',data)});
  socket.on('jd-client',(data)=>{io.emit('jd-client',data)});
  ss(socket).on('jd-server-sync', (stream,data)=> {
    console.log('Data @ jd-server-sync');
    ss(socket).emit('jd-server-sync', tmpstream, data);
    stream.pipe(tmpstream);
  });
 ss(socket).on('jd-client-sync', (stream,data)=> {
   console.log('Data @ jd-client-sync');
    ss(socket).emit('jd-client-sync', tmpcstream, data);
   stream.pipe(tmpcstream);
  });
  socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
