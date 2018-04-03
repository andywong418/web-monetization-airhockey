import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import io from 'socket.io-client';
// 'http://10.20.25.143:3000'

const socket = io()
const paymentPointer = '';
const username = '';
const copyState = (state) => {
  return Object.assign({}, state)
}
function rootReducer(state = {name: 'Horizons', socket, paymentPointer, username}, action) {
    let newState = copyState(state);
    switch (action.type) {
        case 'UPDATE_USERNAME':
          newState.username = action.newUsername;
          return newState;
        case 'UPDATE_PAYMENT_POINTER':
          newState.paymentPointer = action.newPaymentPointer;
          return newState;
        default:
            return state;
    }
}
const mainReducer = combineReducers({routing: routerReducer, rootReducer});
export default mainReducer;
