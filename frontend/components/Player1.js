import React from 'react';

class Player1 extends React.Component {
  constructor(props) {
    // Board needs to pass its perimeter info. Where the edges are
    super(props);
    this.closeDragElement = this.closeDragElement.bind(this);
    this.elementDrag = this.elementDrag.bind(this);

  }

  dragMouseDown(e) {
    e = e || window.event;
    console.log("e.clients", e.clientX, e.clientY);
    this.props.changePlayerCoord('player1downX', e.clientX);
    this.props.changePlayerCoord('player1downY', e.clientY);
    document.onmousemove = this.elementDrag;
    document.onmouseup = this.closeDragElement;
  }

  elementDrag(e) {
    e = e || window.event;
    console.log("this.refs", this.refs.player.offsetLeft);
    const pos1 = this.props.downX - e.clientX;
    const pos2 = this.props.downY - e.clientY;
    console.log("what", pos1, this.refs.player.offsetLeft, this.props.boardWidth/2)
    if(this.refs.player.offsetLeft - pos1 > 0 && this.refs.player.offsetLeft - pos1 < (this.props.boardWidth/2) - 20) {
      this.props.changePlayerCoord('player1downX', e.clientX);
      this.props.changePlayerCoord('player1X', this.refs.player.offsetLeft - pos1);
    }
    if(this.refs.player.offsetTop - pos2 > 0 && this.refs.player.offsetTop - pos2 < 380) {
      this.setState({ downY: e.clientY, y: this.refs.player.offsetTop - pos2 });
      this.props.changePlayerCoord('player1downY', e.clientY);
      this.props.changePlayerCoord('player1Y', this.refs.player.offsetTop - pos2);
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
      border: '3px solid #666666',
      boxSizing: 'border-box',
      borderRadius: '50%'
    };

    return (
      <div style = {stickCss}
      onMouseDown = {e => this.dragMouseDown(e)}

      ref="player"
      tabIndex = "0"
      >

      </div>
    )
  }
}

export default Player1
