import Proptypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import OnlineUsers from '../components/OnlineUsers';
import axios from 'axios';

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
      username: null,
      paymentPointer: null,
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
      this.props.socket.on('deleteUser', user => {
        let onlineUsers = this.state.onlineUsers.slice();
        if(onlineUsers.indexOf(user) !== -1) {
          onlineUsers.splice(onlineUsers.indexOf(user), 1);
          this.setState({ onlineUsers });
        }
      })
  }

  render() {
    return (
      <div className="text-center container">
            <h1 className="jumbotron-heading">Air Hockey - developing games that utilise web monetization to pay off players. </h1>
            <p className="lead text-muted showoff">This is a demo site to show off the capabilities of <a href="https://github.com/interledger/rfcs/blob/master/0028-web-monetization/0028-web-monetization.md">Web Monetization</a> and <a href="https://interledger.org">Interledger</a>.</p>
            <p className="lead text-muted turn"> Turn on your extensions and play with a someone who's online!</p>

        <div>
        <form className="col-sm-4 offset-sm-4">
          <div className="form-group">
            <label> Username: </label>
            <input className="form-control" placeholder="Enter your username" />
          </div>
          <div className="form-group">
            <label> Payment Pointer: </label>
            <input className="form-control" placeholder="Enter your payment pointer" />
          </div>
        </form>
        </div>
        {this.state.paymentPointer ? <OnlineUsers onlineUsers={this.state.onlineUsers} challenges={this.state.challenges} /> : <p> Please enter your payment pointer to access online players </p>}


      </div>
    );
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
export default connect(mapStateToProps, mapDispatchToProps)(Home);
