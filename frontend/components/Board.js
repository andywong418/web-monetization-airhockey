import React from 'react';
import Player1 from './Player1';
import Player2 from './Player2';
import Ball from './Ball';

class Board extends React.Component {

  constructor(props) {
    super(props);
    const w = window.innerWidth;
    const h = window.innerHeight;
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
      player2X: (w*0.7) - 5,
      player2Y: 200,
      player2downX: (w*0.7) - 5,
      player2DownY: 200,
      ballX: (w*0.7*0.5),
      ballY: 200,
    };

  }
  changeCoord(key, newCoord) {
    this.setState({
      [key]: newCoord
    })
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
      <div style={boardCss}>
        <Player1
          boardWidth = {this.state.boardWidth}
          leftOffset = {this.state.leftOffset}
          y = {this.state.player1Y}
          downY = {this.state.player1downY}
          x = {this.state.player1X}
          downX = {this.state.player1downX}
          changeCoord = {(key, newCoord) => this.changeCoord(key, newCoord)}
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
        />


      </div>
    )
  }
}

export default Board;
