import Proptypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import CardContainer from '../components/CardContainer';
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state= {

    }
  }

  render() {
    return (
      <div>
        <CardContainer />
      </div>
    );
  }

}
const mapStateToProps = (state) => {
    return {
        name: state.rootReducer.name
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
