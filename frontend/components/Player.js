import React from 'react';

class Player extends React.Component {
  constructor(props) {
    // Board needs to pass its perimeter info. Where the edges are
    super(props);
    this.closeDragElement = this.closeDragElement.bind(this);
    this.elementDrag = this.elementDrag.bind(this);
  }

  dragMouseDown(e) {
    e = e || window.event;
    this.props.changeCoord(this.props.player + 'downX', e.clientX);
    this.props.changeCoord(this.props.player + 'downY', e.clientY)
    document.onmousemove = this.elementDrag;
    document.onmouseup = this.closeDragElement;
  }

  elementDrag(e) {
    e = e || window.event;
    const pos1 = this.props.downX - e.clientX;
    const pos2 = this.props.downY - e.clientY;
    if(this.props.player === 'player1') {
      if(this.refs.player1.offsetLeft - pos1 >= 0 && this.refs.player1.offsetLeft - pos1 <= (this.props.boardWidth/2) - 20) {
        this.props.changeCoord('player1downX', e.clientX);
        this.props.changeCoord('player1X', this.refs.player1.offsetLeft - pos1);
      }
      if(this.refs.player1.offsetTop - pos2 >= 0 && this.refs.player1.offsetTop - pos2 <= 360) {
        this.props.changeCoord('player1downY', e.clientY);
        this.props.changeCoord('player1Y', this.refs.player1.offsetTop - pos2);
      }
    }
    if(this.props.player === 'player2') {
      if(this.refs.player2.offsetLeft - pos1 >= (this.props.boardWidth/2) + 20 && this.refs.player2.offsetLeft - pos1 <= this.props.boardWidth - 20) {
        this.props.changeCoord('player2downX', e.clientX);
        this.props.changeCoord('player2X', this.refs.player2.offsetLeft - pos1);
      }
      if(this.refs.player2.offsetTop - pos2 >= 0 && this.refs.player2.offsetTop - pos2 <= 360) {
        this.props.changeCoord('player2downY', e.clientY);
        this.props.changeCoord('player2Y', this.refs.player2.offsetTop - pos2);
      }
    }

  }

  closeDragElement(e) {
    e = e || window.element;
    document.onmouseup = null;
    document.onmousemove = null;
  }

  render() {
    const stickCss = {
      position: 'absolute',
      top: this.props.y + 'px',
      left: this.props.x + 'px',
      width: '20px',
      height: '20px',
      border: '20px solid #666666',
      boxSizing: 'border-box',
      borderRadius: '50%'
    };

    return (
      <div style = {stickCss}
      onMouseDown = {e => this.dragMouseDown(e)}
      ref={this.props.player}
      >

      </div>
    )
  }
}

export default Player
