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

  socket.on('gameStart', data => {
    if(!games[data.gameId]) {
      // Initialize if no one else has
      games[data.gameId] = {
        ballX: data.ballX,
        ballY: data.ballY,
        ballXVelocity: -15,
        ballYVelocity: -15,
        boardWidth: data.boardWidth
      }
    }
    if(data.player === 'player1') {
      games[data.gameId]['player1X'] = data.player1X;
      games[data.gameId]['player1Y'] = data.player1Y;
    }
    if(data.player === 'player2') {
      games[data.gameId]['player2X'] = data.player2X;
      games[data.gameId]['player2Y'] = data.player2Y;
    }
    socket.join(data.gameId);
  })

  socket.on('updateBallPos', data => {
    if(games[data.gameId]) {
      const currX = games[data.gameId].ballX;
      const currY = games[data.gameId].ballY;
      let currXVelocity = games[data.gameId].ballXVelocity;
      let currYVelocity = games[data.gameId].ballYVelocity;
      const player1X = games[data.gameId].player1X;
      const player1Y = games[data.gameId].player1Y;
      const player2X = games[data.gameId].player2X;
      const player2Y = games[data.gameId].player2Y;
      const boardWidth = games[data.gameId].boardWidth;

      // if((currX + currXVelocity >=  boardWidth + 10 || currX + currXVelocity <= 5)) {
      //   games[data.gameId].ballXVelocity = -currXVelocity;
      // }
      if(currY + currYVelocity >= 380 || currY + currYVelocity <= 5) {
        games[data.gameId].ballYVelocity = -currYVelocity;
      }

      const player1XDiff = currX - player1X + currXVelocity;
      const player1YDiff = currY - player1Y + currYVelocity;
      const player2XDiff = currX - player2X + currXVelocity;
      const player2YDiff = currY - player2Y + currYVelocity;
      const player1Distance = Math.sqrt((player1XDiff * player1XDiff) + (player1YDiff * player1YDiff));
      const player2Distance = Math.sqrt((player2XDiff * player2XDiff) + (player2YDiff * player2YDiff));
      // 30 is the radius of the 'hockey stick' and the ball
      if(player1Distance <= 30 || player2Distance <= 30) {
        games[data.gameId].ballXVelocity = -currXVelocity;
        games[data.gameId].ballYVelocity = -currYVelocity;
      }

      io.in(data.gameId).emit('updateBallPos', {
        ballX: currX + games[data.gameId].ballXVelocity,
        ballY: currY + games[data.gameId].ballYVelocity
      })
      games[data.gameId].ballX = currX + games[data.gameId].ballXVelocity;
      games[data.gameId].ballY = currY + games[data.gameId].ballYVelocity;
    }

  });

  socket.on('resetBoard', data => {
    if(games[data.gameId]) {
      games[data.gameId].ballX = games[data.gameId].boardWidth / 2;
      games[data.gameId].ballY = 200;
      io.in(data.gameId).emit('updateBallPos', {
        ballX: games[data.gameId].ballX,
        ballY: games[data.gameId].ballY
      })
    }
  })

  socket.on('updateOtherPlayerCoords', data => {
    const {targetSocket, key, newCoord} = data;
    games[data.gameId][data.key] = newCoord;
    socket.broadcast.to(targetSocket).emit('updateOtherPlayerCoords', {
      key,
      newCoord
    });

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
      receiver: winner,
      sourceAmount: '200'
    });
    console.log("paid");
  })

  socket.on('removePlayerFromOnlineList', () => {
    socket.broadcast.emit('deleteUser', socket.id);
    delete onlineUsers[socket.id];
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
