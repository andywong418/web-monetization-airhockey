import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Title from '../components/Title';
import Home from './Home';
import { Route } from 'react-router-dom';
import AnotherPage from '../components/AnotherPage';
import Game from './Game';
import {ConnectedRouter} from 'react-router-redux';
import {withRouter} from 'react-router';
const HomeWrapper = ({name, socket}) => {
  console.log("WHAT", name, socket);
  return (
    <Home />
  )
}
const App = ({ name, socket }) => {
    return (
        <div>
            <Route exact path="/" component={Home}/>
            <Route path="/gameOn/:id/:challenge" component={Game}/>
        </div>
    );
};
const NonBlockApp = withRouter(App);
const AppContainer = ({history, store, name, socket}) => {

  return(
    <div>
          <ConnectedRouter history={history}>
            <NonBlockApp />
          </ConnectedRouter>
    </div>
  )
}
AppContainer.propTypes = {
    name: PropTypes.string,
};

const mapStateToProps = (state) => {
    return {
        name: state.name,
        socket: state.rootReducer.socket
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
