import React from 'react';
import Board from '../components/Board';
import { connect } from 'react-redux';
class Game extends React.Component {
  constructor(props) {
    super(props);
    console.log("props", props);
    const challenger = props.match.params.challenge === 'challenger' ? true : false;
    this.state = {
      player1Score: 0,
      player2Score: 0,
      winner: null,
      startGame: false,
      challenger,
      paymentRceived: false,
    }
  }

  async componentDidMount() {
    //  Pay a small bid into the website. 50 XRP for now.
    console.log("window monetization id", window.monetizationId);
    var domain = new URL(window.location).origin;
    const paymentReceived = await fetch(domain + '/api/content/' + window.monetizationId)
      .then(response => {
        console.log("response", response);
        if(!response.ok) {
          throw Error('ID undefined!')
        }
        return response.json()
      })
    console.log("Payment received!", paymentReceived);
    // const startGame = this.state.challenger ? false: true;
    if(paymentReceived.paid && !this.state.challenger) {
      // Site is paid with deposit.
      this.setState({ startGame: true });
    }
    const targetSocket = this.props.match.params.id;
    this.props.socket.emit('challengePlayer', targetSocket);
    if(!this.state.challenger) {
      this.props.socket.emit('challengeAccepted', targetSocket)
    }
    this.props.socket.on('challengeAccepted', () => {
      if(paymentReceived.paid) {
        this.setState({ startGame: true });
      }
      // Throw error message for no payment received.
    })
  }

  updateScore(key) {
    if(this.state[key] + 1 === 2) {
      this.setState({winner: true, startGame: false})
    }
    this.setState({
      [key]: this.state[key] + 1
    })
  }

  render() {

    return (
      <div className="text-center container">
        <h1> Try to put the ball onto the other wall. First to 7 wins! </h1>
        {this.state.challenger ? <p> You will be playing as Player 1 on your left side </p> : <p> You will be playing as player 2 on your right side </p>}
        {this.state.startGame ?
          <div>
            <p> Player1: {this.state.player1Score}, Player2: {this.state.player2Score} </p>
            <Board winner={this.state.winner}
              challenger={this.state.challenger}
              socket = {this.props.socket}
              targetSocket = {this.props.match.params.id}
              updateScore = {(key) => this.updateScore(key)}
            />
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
