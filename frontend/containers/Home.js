import Proptypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      onlineUsers: [],
      roomName: 'airHockey',
      challenges: []
    }
  }

  componentDidMount() {
      console.log("what", this.props);
      this.props.socket.on('connect', () => {
        this.props.socket.emit('sendUsers', this.state.room);
      })
      this.props.socket.on('getUsers', userList => {
        console.log("USER LIST?", userList);
        this.setState({ onlineUsers: userList });
      })
      this.props.socket.on('newEntrant', newEntrant => {
        console.log("NEW", newEntrant);
        const newOnlineUsers = this.state.onlineUsers.slice();
        newOnlineUsers.push(newEntrant);
        this.setState({ onlineUsers: newOnlineUsers });
      })
      this.props.socket.on('challengePlayer', challenger => {
        const challenges = this.state.challenges.slice();
        challenges.push(challenger);
        this.setState({ challenges });
      })
  }

  render() {
    return (
      <div className="text-center container">
            <h1 className="jumbotron-heading">Air Hockey - developing games that utilise web monetization to pay off players. </h1>
            <p className="lead text-muted showoff">This is a demo site to show off the capabilities of <a href="https://github.com/interledger/rfcs/blob/master/0028-web-monetization/0028-web-monetization.md">Web Monetization</a> and <a href="https://interledger.org">Interledger</a>.</p>
            <p className="lead text-muted turn"> Turn on your extensions and play with a someone who's online!</p>

        <div>
        <h3> Online Players: </h3>
        </div>
        {this.state.onlineUsers.map(user => {
          return (
            <div key={user}>
              <span>{user}</span> <Link to={"/gameOn/" + user + '/challenger'}> Challenge Player! </Link>
            </div>
          )
        })}
        {this.state.challenges.length > 0  ?
          <div style= {{marginTop: '30px'}}>
            <h3> Challenges: </h3>
            {this.state.challenges.map(user => {
              return (
                <div key={user}>
                  <span>You've been challenged by user {user}!</span>
                  <Link to={"/gameOn/" + user + '/challenged'}> Accept </Link>
                </div>
              )
            })}

          </div>
          :
          null
        }
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
