
import { combineReducers } from 'redux'
import * as Types from '../actions/Types'

const appReducer = combineReducers({

  message: (state='', action) => {
    switch(action.type) {
      case Types.SHOW_MESSAGE: return action.message
      default: return state
    }
  },

  spinner: (state=false, action) => {
    switch(action.type) {
      case Types.SHOW_MESSAGE: return !!action.spinner
      default: return state
    }
  },

  devices: (state=[], action) => {
    switch(action.type) {
      case Types.FOUND_DEVICE: return [...state, action.device]
      default: return state
    }
  },

  device: (state=null, action) => {
    switch(action.type) {
      case Types.CURRENT_DEVICE: return action.device
      default: return state
    }
  }
});

export default appReducer;
