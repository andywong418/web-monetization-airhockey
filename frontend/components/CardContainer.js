import React from 'react';
import axios from 'axios';
import '../assets/stylesheets/styles.css';
class CardContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayUser: false,
      users: [],
      userIndex: 0
    };
     var self = this;
    axios.get('https://randomuser.me/api/').then(function(resp) {
      self.setState({displayUser: resp.data.results[0]});
    })
  }

  componentDidMount() {
    var self = this;
    axios.get('https://randomuser.me/api/').then(function(resp) {
      console.log("RESP", resp.data.results);
      self.setState({users: resp.data.results, displayUser: resp.data.results[self.state.userIndex]});
    })
  }
  updateIndex() {
    var self = this;
    axios.get('https://randomuser.me/api/').then(function(resp) {
      console.log("RESP", resp.data.results);
      self.setState({users: resp.data.results, displayUser: resp.data.results[self.state.userIndex]});
    })
  }
  render() {
    return (
      <div className="card-container">
        {this.state.displayUser ? <Card user={this.state.displayUser} updateIndex={() => this.updateIndex()}/> : <div></div>}
      </div>
    )
  }
}

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      movable: false,
      shiftX: 0,
      shiftY: 0,
      left: 0,
      right: 0,
      like: ''
    }
  }


  onMouseDown(e) {

    var left = e.clientX - this.card.getBoundingClientRect().left
    var top = e.clientY - this.card.getBoundingClientRect().top
    // this.card.marginLeft = 'auto';
    // this.card.position = 'absolute';
    // this.card.left = this.state.left ;
    // this.card.top = this.state.top ;

    this.setState({movable: true, shiftX: left, shiftY: top, left: e.pageX - left, top: e.pageY - top});

    // window.addEventListner('mousemove', onMouseMove(e));
    // this.card.onmouseup = function() {
    //   window.removeEventListener('mousemove', onMouseMove);
    //   this.card.onmouseup = null;
    // }
  }
  onMouseMove(e) {

    if(this.state.movable) {
      var halfWay = window.innerWidth/2;
      this.card.style['-webkit-transition'] = '-webkit-transform  1s ease';
      this.card.style['-moz-transition']='-moz-transition 1s ease';
      this.card.style['transition'] = 'transform 0.2s ease-out';
      if(e.pageX - this.state.shiftX < halfWay-300) {
        this.card.style.transform = 'rotate(-45deg)';
        this.setState({like: 'Like'});
        this.setState({like: 'Ignore'});
      } else if(e.pageX - this.state.shiftX > halfWay-100) {
        this.card.style.transform = 'rotate(45deg)';

        this.setState({like: 'Like'});
      }

      this.setState({left: e.pageX - this.state.shiftX, top: e.pageY - this.state.shiftY});
      if(e.pageX  < 250) {
        this.props.updateIndex();
        this.onMouseUp(e);
      } else if (e.pageX > window.innerWidth-250) {
        this.props.updateIndex();
        this.onMouseUp(e);
      }
    }

  }
  onMouseUp(e) {
    this.card.style['-webkit-animation'] = 'spin 1s ease';
    this.card.style['-moz-animation']='spin 1s ease';
    this.card.style['animation'] = 'spin 1s ease';
    this.card.style.transform = 'rotate(0)';
    this.setState({movable: false, like: ''});
  }
  render() {

    const css = {
        width: '30%',
        marginLeft: '35%',
        border: '1px solid grey',
        borderRadius: '5px',

    };
    if(this.state.movable) {
      css.marginLeft = 'auto';
      css.position = 'absolute';
      css.left = this.state.left ;
      css.top = this.state.top ;
    }
    return(
      <div>
      <h3 style={{zIndex: 4, position: 'absolute', top: '45%', left: '45%'}}>{this.state.like}</h3>
      <div className="card" style={css}
      onMouseDown={ (e) => this.onMouseDown(e) }
      onMouseMove={ (e) => this.onMouseMove(e) }
      onMouseUp={ (e) => this.onMouseUp(e) }
      onDragStart ={() => (false)}
      ref={(div) => {this.card = div}} >
        <img src={this.props.user.picture.large}
          draggable={false}/>

        <h3>{this.props.user.name.first}, 26
        </h3>
        <i className="material-icons">add</i>
      </div>
      </div>
    );
  }
}

export default CardContainer;
