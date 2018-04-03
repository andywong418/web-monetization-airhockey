const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const api = require('./backend/routes');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const plugin = require('ilp-plugin')();
const SPSP = require('ilp-protocol-spsp');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', api);
app.get('*', (request, response) => {
    response.sendFile(__dirname + '/public/index.html'); // For React/Redux
});
const games = {};
const onlineUsers = {}
io.on('connection', socket => {
  socket.on('sendUsers', requestedRoom => {
    const userList = [];
    for(let key in onlineUsers) {
      if(key !== socket.id) {
        userList.push({socket: key, username: onlineUsers[key]});
      }
    }
    socket.emit('getUsers', userList);
  });

  socket.on('sendUsername', username => {
    onlineUsers[socket.id] = username;
    socket.broadcast.emit('newEntrant', {
      socket: socket.id,
      username
    })
  })
  socket.on('challengePlayer', data => {

    const {targetSocket, username} = data;
    socket.broadcast.to(targetSocket).emit('challengePlayer', {
      targetSocket: socket.id,
      username: username
    });
  })

  socket.on('challengeAccepted', data => {
    const { targetSocket, username } = data;
    socket.broadcast.to(targetSocket).emit('challengeAccepted');
  })

  socket.on('updateOtherPlayerCoords', data => {
    const {targetSocket, key, newCoord} = data;
    socket.broadcast.to(targetSocket).emit('updateOtherPlayerCoords', {
      key,
      newCoord
    });
  })

  socket.on('syncBallCoord', data => {
    const {x, y, targetSocket} = data;
    socket.broadcast.to(targetSocket).emit('syncBallCoord', {
      x,
      y,
    })
  })
  socket.on('updateBoardSize', data => {
    const {targetSocket, leftOffset, boardWidth} = data;
    socket.broadcast.to(targetSocket).emit('updateBoardSize', {
      leftOffset,
      boardWidth,
    })
  })

  socket.on('sendPaymentPointer', data => {
    const {targetSocket, paymentPointer} = data;
    console.log("paymentPointer SENT?", targetSocket, paymentPointer);
    socket.broadcast.to(targetSocket).emit('sendPaymentPointer', paymentPointer)
  })

  socket.on('payWinner', async winner => {
    // SPSP end point to pay winner?
    console.log('connecting plugin');
    await plugin.connect();
    console.log('sending payment to ' + winner );
    await SPSP.pay(plugin, {
      receiver: '$' + winner,
      sourceAmount: '200'
    });
    console.log("paid");
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('deleteUser', socket.id);
    delete onlineUsers[socket.id];
  })
})

const port = process.env.PORT || 3000;

server.listen(port, error => {
  error
  ? console.error(error)
  : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});
