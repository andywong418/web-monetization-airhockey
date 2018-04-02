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
      player2downX: (w*0.7) - 20,
      player2downY: 200,
      ballX: (w*0.7*0.5),
      ballY: 200,
    };
    this.changeCoord = this.changeCoord.bind(this);
  }

  componentDidMount() {
    this.props.socket.on('updateOtherPlayerCoords', data => {
      this.changeCoord(data.key, data.newCoord);
    })
  }
  changeCoord(key, newCoord) {
    if(this.refs.boardRef) {
      this.setState({
        [key]: newCoord
      });
    }
    if((this.props.challenger && (key === 'player1X' || key === 'player1Y')) || (!this.props.challenger && (key === 'player2X' || key === 'player2Y')) || (this.props.challenger && key === 'ballX') || (this.props.challenger && key === 'ballY') ) {
      // Broadcast to other side. Need to broadcast ball position as well.
      this.props.socket.emit('updateOtherPlayerCoords', {
        targetSocket: this.props.targetSocket,
        key,
        newCoord
      })
    }
  }

  resetBoard() {
    if(this.refs.boardRef) {
      this.setState({
        ballX: (this.state.boardWidth*0.7*0.5),
        ballY: 200,
      });
    }
  }

  render() {
    const boardCss = {
      position: 'fixed',
      minHeight: '400px',
      border: '2px solid black'
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
          changeCoord = {(key, newCoord) => this.changeCoord(key, newCoord)}
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
