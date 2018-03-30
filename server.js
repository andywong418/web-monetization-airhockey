const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const api = require('./backend/routes');
const server = require('http').Server(app);
const io = require('socket.io')(server);


app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', api);
app.get('*', (request, response) => {
    response.sendFile(__dirname + '/public/index.html'); // For React/Redux
});
const games = {};
const onlineUsers = {}
io.on('connection', socket => {
  onlineUsers[socket.id] = true;
  socket.broadcast.emit('newEntrant', socket.id);
  socket.on('sendUsers', requestedRoom => {
    const userList = [];
    for(let key in onlineUsers) {
      if(key !== socket.id) {
        userList.push(key);
      }
    }
    socket.emit('getUsers', userList);
  });

  socket.on('challengePlayer', targetSocket => {
    socket.broadcast.to(targetSocket).emit('challengePlayer', socket.id);
  })

  socket.on('challengePlayer', targetSocket => {
    socket.broadcast.to(targetSocket).emit('challengeAccepted');
  })

  socket.on('updateOtherPlayerCoords', data => {
    const {targetSocket, key, newCoord} = data;
    socket.broadcast.to(targetSocket).emit('updateOtherPlayerCoords', {
      key,
      newCoord
    });
  })
  socket.on('disconnect', () => {
    delete onlineUsers[socket.id];
  })
})

const port = process.env.PORT || 3000;

server.listen(port, error => {
  error
  ? console.error(error)
  : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});
