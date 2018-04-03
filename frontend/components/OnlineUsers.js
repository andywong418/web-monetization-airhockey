
import {Link} from 'react-router-dom';
import React from 'react';

const OnlineUsers = ({onlineUsers, challenges}) => {
  return (
    <div>
    <h3> Online Players: </h3>
    {onlineUsers.map(user => {
      return (
        <div key={user}>
          <span>{user}</span> <Link to={"/gameOn/" + user + '/challenger'}> Challenge Player! </Link>
        </div>
      )
    })}
    {challenges.length > 0  ?
      <div style= {{marginTop: '30px'}}>
        <h3> Challenges: </h3>
        {challenges.map(user => {
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
  )
}

export default OnlineUsers;
