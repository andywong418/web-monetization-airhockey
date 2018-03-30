import React from 'react';

class Ball extends React.Component {
  constructor(props) {
    super(props);
    const randomXNum = Math.random();
    const randomYNum = Math.random();
    let initialXVelocity;
    let initialYVelocity;
    if(randomXNum < 0.5) {
      initialXVelocity = 10;
    } else {
      initialXVelocity = -10;
    }
    if(randomYNum < 0.5) {
      initialYVelocity = 10;
    } else {
      initialYVelocity = -10;
    }
    this.state = {
      velocityX: initialXVelocity,
      velocityY: initialYVelocity,
    }
  }

  componentDidMount() {
    //Update position according to the velocity every second

    setInterval(() => {
      const currX = this.props.x;
      const currY = this.props.y;
      if(this.props.x + this.state.velocityX >= this.props.boardWidth - 5 || this.props.x <= 5) {
        this.setState({ velocityX: -this.state.velocityX });
      }
      if(this.props.y + this.state.velocityY >= 390 || this.props.y <= 0) {
        this.setState({ velocityY: -this.state.velocityY });
      }

      const player1XDiff = this.props.x - this.props.player1X + this.state.velocityX;
      const player1YDiff = this.props.y - this.props.player1Y + this.state.velocityY;
      const player2XDiff = this.props.x - this.props.player2X;
      const player2YDiff = this.props.x - this.props.player2Y;
      const player1Distance = Math.sqrt((player1XDiff * player1XDiff) + (player1YDiff * player1YDiff))
      const player2Distance = Math.sqrt((player2XDiff * player2XDiff) + (player2YDiff * player2YDiff))
      const minDistance = 20+ 10;
      if(player1Distance <= 30 || player2Distance <= 30) {
        this.setState({ velocityX: -this.state.velocityX, velocityY: -this.state.velocityY });
      }
      this.props.changeCoord('ballX', this.props.x + this.state.velocityX);
      this.props.changeCoord('ballY', this.props.y + this.state.velocityY);
    }, 20)
  }



  render() {
    const ballCss = {
      position: 'absolute',
      top: this.props.y + 'px',
      left: this.props.x + 'px',
      width: '20px',
      height: '20px',
      backgroundColor: 'black',
      boxSizing: 'border-box',
      borderRadius: '50%'
    }
    return (
      <div style={ballCss}>
      </div>
    )
  }
}

export default Ball;
