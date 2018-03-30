import React from 'react';
import { connect } from 'react-redux';
class GameContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io()
    }
  }
}

const mapStateToProps = (state) => {
    return {

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppContainer);
