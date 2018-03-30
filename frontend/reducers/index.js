import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import io from 'socket.io-client';

const socket = io()
function rootReducer(state = {name: 'Horizons', socket}, action) {
    switch (action.type) {
        default:
            return state;
    }
}
const mainReducer = combineReducers({routing: routerReducer, rootReducer});
export default mainReducer;
