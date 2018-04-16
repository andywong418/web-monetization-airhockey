import React from 'react';

class Ball extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //Update position according to the velocity every second
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
