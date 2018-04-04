import Proptypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import OnlineUsers from '../components/OnlineUsers';
import Footer from '../components/Footer';
import axios from 'axios';
import {updateUsername, updatePaymentPointer} from '../actions/index';
function u8tohex (arr) {
  var vals = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' ]
  var ret = ''
  for (var i = 0; i < arr.length; ++i) {
    ret += vals[(arr[i] & 0xf0) / 0x10]
    ret += vals[(arr[i] & 0x0f)]
  }
  return ret
}

function getMonetizationId (receiverUrl) {
  return new Promise((resolve, reject) => {
    window.addEventListener('load', function () {
      var idBytes = new Uint8Array(16)
      crypto.getRandomValues(idBytes)
      var id = u8tohex(idBytes)
      var receiver = receiverUrl.replace(/:id/, id)

      if (window.monetize) {
        window.monetize({
          receiver
        })
        resolve(id)
      } else {
        console.log('Your extension is disabled or not installed.' +
          ' Manually pay to ' + receiver)
        reject(new Error('web monetization is not enabled'))
      }
    })
  })
}


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      onlineUsers: [],
      roomName: 'airHockey',
      challenges: [],
      submitted: false,
    }
  }

  async componentDidMount() {
      // Check for flat extention - make sure they're paying?

      this.props.socket.on('connect', () => {
        this.props.socket.emit('sendUsers', this.state.room);
      });
      this.props.socket.on('getUsers', userList => {
        this.setState({ onlineUsers: userList });
      });
      this.props.socket.on('newEntrant', newEntrant => {
        const newOnlineUsers = this.state.onlineUsers.slice();
        newOnlineUsers.push(newEntrant);
        this.setState({ onlineUsers: newOnlineUsers });
      });
      this.props.socket.on('challengePlayer', challenger => {
        const challenges = this.state.challenges.slice();
        challenges.push(challenger);
        this.setState({ challenges });
      });
      this.props.socket.on('deleteUser', userId => {
        let onlineUsers = this.state.onlineUsers.slice();
        let indexToRemove;
        for(let i = 0; i < onlineUsers.length; i++) {
          if(onlineUsers[i].socket === userId) {
            indexToRemove = i;
          }
        }
        onlineUsers.splice(indexToRemove, 1);
        this.setState({ onlineUsers});
      })
  }
  onUsernameChange(e) {
    const target = e.target;
    const value = target.value;
    this.props.updateUsername(value);
  }

  onPaymentPointerChange(e) {
    const target = e.target;
    const value = target.value;
    this.props.updatePaymentPointer(value);
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this.setState({
      submitted: true
    })
    this.props.socket.emit('sendUsername', this.props.username);
  }

  render() {

    return (
      <div className="text-center">
            <h1 className="jumbotron-heading" style={{background: '#f57b19', color: 'white'}}><img src="http://cashbox.com.au/wp-content/uploads/2014/09/air-hockey-icon.png" width = {200}/> Air Hockey Demo </h1>
            <p className="lead text-muted showoff">This is a demo site to show off the capabilities of <a href="https://github.com/interledger/rfcs/blob/master/0028-web-monetization/0028-web-monetization.md">Web Monetization</a> and <a href="https://interledger.org">Interledger</a>.</p>
            <p className="lead text-muted turn"> Turn on your extensions and play with a someone who's online!</p>

        <div>
        {this.props.paymentPointer && this.state.submitted ?
          <div>
            <p> Username: <span style={{color: 'blue'}}>{this.props.username} </span></p>
            <p > Payment Pointer: <span style={{color: 'blue'}}> {this.props.paymentPointer}</span></p>
          </div>
          :
          <form className="col-sm-4 offset-sm-4" onSubmit={(e) => this.handleFormSubmit(e)}>
            <div className="form-group">
              <label> Username: </label>
              <input className="form-control" name="username" placeholder="Enter your username" onChange={(e) => this.onUsernameChange(e)} value={this.props.username} />
            </div>
            <div className="form-group">
              <label> Payment Pointer: </label>
              <input className="form-control" name="paymentPointer" placeholder="Enter your payment pointer" onChange={(e) => this.onPaymentPointerChange(e)} value={this.props.paymentPointer}/>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        }

        </div>
        {this.props.paymentPointer && this.state.submitted ? <OnlineUsers onlineUsers={this.state.onlineUsers} challenges={this.state.challenges} /> : <p> Please enter your payment pointer to access online players </p>}

        <Footer />
      </div>
    );
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
      updateUsername: (newUsername) => dispatch(updateUsername(newUsername)),
      updatePaymentPointer: (newPaymentPointer) => dispatch(updatePaymentPointer(newPaymentPointer)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
