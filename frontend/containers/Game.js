import React from 'react';
import Board from '../components/Board';
import Footer from '../components/Footer';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import '../assets/stylesheets/styles.css';
class Game extends React.Component {
  constructor(props) {
    super(props);
    const challenger = props.match.params.challenge === 'challenger' ? true : false;
    this.state = {
      player1Score: 0,
      player2Score: 0,
      winner: null,
      startGame: false,
      challenger,
      paymentReceived: false,
      player1Pointer: '',
      player2Pointer: '',
    }
  }

  async componentDidMount() {
    //  Pay a small bid into the website. 50 XRP for now.
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
      this.setState({ startGame: true }, () => {
        this.props.socket.emit('removePlayerFromOnlineList');
      });
    }
    // Send payment pointers to each other

    const targetSocket = this.props.match.params.id;

    this.props.socket.emit('sendPaymentPointer', {
      targetSocket,
      paymentPointer: this.props.paymentPointer
    });
    this.props.socket.on('sendPaymentPointer', paymentPointer => {
      const player1Pointer = this.state.challenger ? this.props.paymentPointer : paymentPointer;
      const player2Pointer = this.state.challenger ? paymentPointer : this.props.paymentPointer;
      this.setState({
        player1Pointer,
        player2Pointer,
      });
    });

    if(this.state.challenger) {
      this.props.socket.emit('challengePlayer', {
        targetSocket,
        username: this.props.username,
      });
    }

    if(!this.state.challenger) {
      this.props.socket.emit('challengeAccepted', {
        targetSocket,
        username: this.props.username,
      });
    }

    this.props.socket.on('challengeAccepted', () => {
      if(paymentReceived.paid) {
        this.setState({ startGame: true });
      }
      // Throw error message for no payment received.
    });

  }

  updateScore(key) {
    if(this.refs.gameRef) {
      if(this.state[key] + 1 === 3) {
        const winner = key === 'player1Score' ? 'Player 1' : 'Player 2';
        const winnerPaymentPointer = key === 'player1Score' ? this.state.player1Pointer : this.state.player2Pointer;
        this.setState({ winner, startGame: false });
        //only send once
        if(this.state.challenger) {
          this.props.socket.emit('payWinner', winnerPaymentPointer);
        }
      }
      this.setState({
        [key]: this.state[key] + 1
      })
    }

  }

  render() {

    return (
      <div className="text-center" ref="gameRef">
        <h1 className="jumbotron" style={{background: '#f57b19', color: 'white', position: 'relative'}}> Try to put the ball onto the other wall. First to 3 wins!
          <div style={{fontSize: '20px', position: 'absolute', margin: '10px auto', width: '100%'}}><Link className="linkBackHome" to={'/'}>Go back to Home</Link></div>
        </h1>
        {this.state.challenger ? <p className="lead showoff"> You will be playing as Player 1 on your left side with the <i className="fas fa-circle" style = {{ color: '#2574A9' }}></i> stick </p> : <p className="lead showoff"> You will be playing as player 2 on your right side with the <i className="fas fa-circle" style = {{ color: '#1BBC9B' }}></i> stick </p>}
        {this.state.startGame ?
          <div>
            <span className="player1Display"> Player1: </span><span className="player1Score"> {this.state.player1Score} </span>
            <span className="player2Display"> Player2: </span><span className="player2Score"> {this.state.player2Score} </span>
            <Board winner={this.state.winner}
              challenger={this.state.challenger}
              socket = {this.props.socket}
              targetSocket = {this.props.match.params.id}
              updateScore = {(key) => this.updateScore(key)}
            />
          </div>
          :
          <p> {this.state.winner ? this.state.winner + ' has won the game and will take the prize money!' : "Waiting for other player..."}</p>}
          <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
    return {
        name: state.rootReducer.name,
        socket: state.rootReducer.socket,
        username: state.rootReducer.username,
        paymentPointer: state.rootReducer.paymentPointer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Game);
