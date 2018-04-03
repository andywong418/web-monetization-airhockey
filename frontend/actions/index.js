// Action Creators

import * as types from './types';

export const updateUsername = (newUsername) => {
  return {
    type: types.UPDATE_USERNAME,
    newUsername,
  }
}

export const updatePaymentPointer = (newPaymentPointer) => {
  return {
    type: types.UPDATE_PAYMENT_POINTER,
    newPaymentPointer,
  }
}
