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
    this.state = {
      leftOffset: 128,
      rightOffset: 128,
      boardWidth: 1000,
      player1X: 5,
      player1Y: 200,
      player1downX: 5,
      player1downY: 200,
      player2X: 1000 - 50,
      player2Y: 200,
      player2downX: 1000 - 20,
      player2downY: 200,

    };
    this.changeCoord = this.changeCoord.bind(this);
  }

  componentDidMount() {
    this.props.socket.on('updateOtherPlayerCoords', data => {
      console.log("updating kind of slow");
      this.changeCoord(data.key, data.newCoord);
    })
    // Scroll to board.
    const boardScrollTop = this.refs.boardRef.scrollTop;
    window.scrollTo(0, 50);

    setInterval(() => {
        const currX = this.props.x;
        const currY = this.props.y;
        if((this.state.ballX + this.state.ballXVelocity >= this.state.boardWidth - 5 || this.state.ballX <= 5)) {
          this.setState({ ballXVelocity: -this.state.ballXVelocity });
        }
        if(this.state.ballY + this.state.ballYVelocity >= 390 || this.state.ballY <= 5) {
          this.setState({ ballYVelocity: -this.state.ballYVelocity });
        }

        const player1XDiff = this.state.ballX - this.state.player1X + this.state.ballXVelocity;
        const player1YDiff = this.state.ballY - this.state.player1Y + this.state.ballYVelocity;
        const player2XDiff = this.state.ballX - this.state.player2X + this.state.ballXVelocity;
        const player2YDiff = this.state.ballY - this.state.player2Y + this.state.ballYVelocity;
        const player1Distance = Math.sqrt((player1XDiff * player1XDiff) + (player1YDiff * player1YDiff));
        const player2Distance = Math.sqrt((player2XDiff * player2XDiff) + (player2YDiff * player2YDiff));
        // 30 is the radius of the 'hockey stick' and the ball
        if(player1Distance <= 30 || player2Distance <= 30) {
          this.setState({ ballXVelocity: -this.state.ballXVelocity, ballYVelocity: -this.state.ballYVelocity });
        }
        const direction = this.state.ballXVelocity < 0 ? 'player1' : 'player2';
        if(this.props.challenger) {
          this.changeCoord('ballX', this.state.ballX + this.state.ballXVelocity, direction);
          this.changeCoord('ballY', this.state.ballY + this.state.ballYVelocity, direction);
        }


        if(this.props.x + this.state.velocityX < 0) {
          //Player 2 gets a point
          this.updateScore('player2Score');
          this.resetBoard();
        }
        if(this.props.x + this.state.velocityX > this.props.boardWidth - 10) {
          this.updateScore('player1Score');
          this.resetBoard();
        }


    }, 50)
  }
  changeCoord(key, newCoord, direction) {
      this.setState({
        [key]: newCoord
      });
    if((this.props.challenger && (key === 'player1X' || key === 'player1Y')) || (!this.props.challenger && (key === 'player2X' || key === 'player2Y')) || this.props.challenger && (key === 'ballX' || key === 'ballY' )) {
      // Broadcast to other side. Need to broadcast ball position as well.
      this.props.socket.emit('updateOtherPlayerCoords', {
        targetSocket: this.props.targetSocket,
        key,
        newCoord
      })
    }
  }

  syncBallCoord(x, y) {
    if(this.props.challenger) {
      this.props.socket.emit('syncBallCoord', {
        targetSocket: this.props.targetSocket,
        x,
        y,
      })
    }
  }

  resetBoard() {
    if(this.refs.boardRef) {
      this.setState({
        ballX: (this.state.boardWidth * 0.5),
        ballY: 200,
      });
      if(this.props.challenger) {
        this.props.socket.emit('updateOtherPlayerCoords', {
          targetSocket: this.props.targetSocket,
          key: 'ballX',
          newCoord: (this.state.boardWidth*0.5),
        });
        this.props.socket.emit('updateOtherPlayerCoords', {
          targetSocket: this.props.targetSocket,
          key: 'ballY',
          newCoord: 200,
        })
      }

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
          player1X = {this.state.player1X}
          player1Y = {this.state.player1Y}
          player2X = {this.state.player2X}
          player2Y = {this.state.player2Y}
          boardWidth = {this.state.boardWidth}
          leftOffset = {this.state.leftOffset}
          x = {this.state.ballX}
          y = {this.state.ballY}
          xVelocity = {this.state.ballXVelocity}
          yVelocity = {this.state.ballYVelocity}
          changeCoord = {(key, newCoord, direction) => this.changeCoord(key, newCoord, direction)}
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
