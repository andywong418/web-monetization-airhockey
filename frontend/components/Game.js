import React from 'react';
import Board from './Board';
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player1Score: 0,
      player2Score: 0,
      winner: null,
    }
  }

  render() {
    return (
      <div>
        <h1> First to 7 wins! </h1>
        <p> Player1: {this.state.player1Score}, Player2: {this.state.player2Score} </p>
        <Board winner={this.state.winner} />
      </div>
    )
  }
}

export default Game;
