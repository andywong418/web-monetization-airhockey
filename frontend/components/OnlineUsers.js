
import {Link} from 'react-router-dom';
import React from 'react';

const OnlineUsers = ({onlineUsers, challenges}) => {
  return (
    <div>
    <h3> Online Players: </h3>
    {onlineUsers.map(user => {
      console.log("user", user);
      if(user.username) {
        return (
          <div key={user.username}>
            <span>{user.username}</span> <Link to={"/gameOn/" + user.socket + '/challenger'}> Challenge Player! </Link>
          </div>
        )
      }
      return null;
    })}
    {challenges.length > 0  ?
      <div style= {{marginTop: '30px'}}>
        <h3> Challenges: </h3>
        {challenges.map(user => {
          console.log("user", user);
          if(user.username) {
            return (
              <div key={user.targetSocket}>
                <span>You've been challenged by user {user.username}!</span>
                <Link to={"/gameOn/" + user.targetSocket + '/challenged'}> Accept </Link>
              </div>
            )
          }
          return null;

        })}

      </div>
      :
      null
    }
    </div>
  )
}

export default OnlineUsers;
