import React from 'react';
import Player from './Player';
// import Player2 from './Player2';
import Ball from './Ball';

class Board extends React.Component {

  constructor(props) {
    super(props);
    const w = window.innerWidth;
    const h = window.innerHeight;
    console.log(props.challenger);
    // Height should be set to be at least 400px
    // Width should be 70% of board.
    // Ping server for ball update.
    const leftOffset = w * 0.15;
    const rightOffset = w * 0.15;
    this.state = {
      leftOffset,
      rightOffset,
      boardWidth: w * 0.7,
      player1X: 5,
      player1Y: 200,
      player1downX: 5,
      player1downY: 200,
      player2X: (w*0.7) - 50,
      player2Y: 200,
      player2downX: (w*0.7) - 50,
      player2downY: 200,
      gameId: '',
      ballX: (w*0.7) / 2,
      ballY: 200,
    };
    this.changeCoord = this.changeCoord.bind(this);
    //Start game.
    const gameStartObj = {
      ballX: this.state.boardWidth / 2,
      ballY: 200,
      boardWidth: this.state.boardWidth
    };

    if(this.props.challenger) {
      // Send player1 starting coord
      gameStartObj.player1X = this.state.player1X;
      gameStartObj.player1Y = this.state.player1Y;
      gameStartObj.player = 'player1';
      gameStartObj.gameId = this.props.socket.id + '-' + this.props.targetSocket;
    } else {
      gameStartObj.player2X = this.state.player2X;
      gameStartObj.player2Y = this.state.player2Y;
      gameStartObj.player = 'player2';
      gameStartObj.gameId = this.props.targetSocket + '-' + this.props.socket.id;
    }
    this.state.gameId = gameStartObj.gameId;
    this.props.socket.emit('gameStart', gameStartObj);
  }

  componentDidMount() {
    if(this.refs.boardRef) {
      this.props.socket.on('updateOtherPlayerCoords', data => {
        this.changeCoord(data.key, data.newCoord);
      })

      this.props.socket.on('updateBallPos', data => {
        this.setState({ballX: data.ballX, ballY: data.ballY});
        if(data.ballX < 0) {
          //Player 2 gets a point
          this.props.updateScore('player2Score');
          this.resetBoard();
        }
        if(data.ballX > this.state.boardWidth - 10) {
          this.props.updateScore('player1Score');
          this.resetBoard();
        }
      })
      // Scroll to board.
      const boardScrollTop = this.refs.boardRef.scrollTop;
      window.scrollTo(0, 50);

      setInterval(() => {
        this.props.socket.emit('updateBallPos', {
          gameId: this.state.gameId
        });
      }, 50)
    }
  }
  changeCoord(key, newCoord, direction) {
      this.setState({
        [key]: newCoord
      });
    if((this.props.challenger && (key === 'player1X' || key === 'player1Y')) || (!this.props.challenger && (key === 'player2X' || key === 'player2Y')) ) {
      // Broadcast to other side. Need to broadcast ball position as well.

      this.props.socket.emit('updateOtherPlayerCoords', {
        targetSocket: this.props.targetSocket,
        key,
        newCoord,
        gameId: this.state.gameId
      })
    }
  }


  resetBoard() {
    if(this.refs.boardRef) {
      this.props.socket.emit('resetBoard', {
        gameId: this.state.gameId
      })

    }
  }

  render() {
    const boardCss = {
      position: 'relative',
      minHeight: '400px',
      border: '2px solid black',
    };
    boardCss.width = this.state.boardWidth;
    boardCss.left = this.state.leftOffset;
    return (
      <div style={boardCss} ref="boardRef">
        <Player
          boardWidth = {this.state.boardWidth}
          leftOffset = {this.state.leftOffset}
          y = {this.state.player1Y}
          downY = {this.state.player1downY}
          x = {this.state.player1X}
          downX = {this.state.player1downX}
          changeCoord = {(key, newCoord) => this.changeCoord(key, newCoord)}
          player = 'player1'
          challenger = {this.props.challenger}
        />
        <Ball
          boardWidth = {this.state.boardWidth}
          leftOffset = {this.state.leftOffset}
          x = {this.state.ballX}
          y = {this.state.ballY}
          updateScore = {(key) => this.props.updateScore(key)}
          resetBoard = {() => this.resetBoard()}
          challenger = {this.props.challenger}

        />
        <Player
          boardWidth = {this.state.boardWidth}
          leftOffset = {this.state.leftOffset}
          y = {this.state.player2Y}
          downY = {this.state.player2downY}
          x = {this.state.player2X}
          downX = {this.state.player2downX}
          changeCoord = {(key, newCoord) => this.changeCoord(key, newCoord)}
          player = 'player2'
          challenger = {this.props.challenger}
        />

      </div>
    )
  }
}

export default Board;
