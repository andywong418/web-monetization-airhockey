import React from 'react';
import Board from '../components/Board';
import { connect } from 'react-redux';
class Game extends React.Component {
  constructor(props) {
    super(props);
    console.log("props", props);
    const challenger = props.match.params.challenge === 'challenger' ? true : false;
    const startGame = props.match.params.challenge === 'challenger' ? false: true;
    this.state = {
      player1Score: 0,
      player2Score: 0,
      winner: null,
      startGame,
      challenger,
    }
  }

  componentDidMount() {
    const targetSocket = this.props.match.params.id;
    this.props.socket.emit('challengePlayer', targetSocket);
    if(!this.state.challenger) {
      this.props.socket.emit('challengeAccepted', targetSocket)
    }
    this.props.socket.on('challengeAccepted', () => {
      this.setState({ startGame: true});
    })
  }
  render() {

    return (
      <div className="text-center container">
        <h1> Try to put the ball onto the other wall. First to 7 wins! </h1>
        {this.state.startGame ?
          <div>
            <p> Player1: {this.state.player1Score}, Player2: {this.state.player2Score} </p>
            <Board winner={this.state.winner} challenger={this.state.challenger} />
          </div>
          :
          <p> Waiting for Player 2... </p>}
      </div>
    )
  }
}
const mapStateToProps = (state) => {
    return {
        name: state.rootReducer.name,
        socket: state.rootReducer.socket
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Game);
