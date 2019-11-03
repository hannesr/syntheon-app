
import { combineReducers } from 'redux'
import * as Types from '../actions/Types'

function message(state='', action) {
  switch(action.type) {
    case Types.SHOW_MESSAGE: return action.message
    default: return state
  }
}

function spinner(state=false, action) {
  switch(action.type) {
    case Types.SHOW_MESSAGE: return !!action.spinner
    default: return state
  }
}

function devices(state=[], action) {
  switch(action.type) {
    case Types.FOUND_DEVICE: return [...state, action.device]
    default: return state
  }
}

function device(state=null, action) {
  switch(action.type) {
    case Types.CURRENT_DEVICE: return action.device
    default: return state
  }
}

function modules(state=[], action) {
  switch(action.type) {
    case Types.MODULE_INIT:
    case Types.PROGRAMS_INIT:
    case Types.CONTROLS_INIT:
    case Types.PROGRAM:
    case Types.CONTROL:
     return Object.assign({}, state, {[action.module]: module(state[action.module], action)})
    default: return state
  }
}

function module(state={name:"?", programs:[], program:null, controls:[]}, action) {
  switch(action.type) {
    case Types.MODULE_INIT:
      return Object.assign({}, state, {name: name(state.name, action)})
    case Types.PROGRAMS_INIT:
      return Object.assign({}, state, {programs: programs(state.programs, action)})
    case Types.PROGRAM:
      return Object.assign({}, state, {program: program(state.program, action)})
    case Types.CONTROLS_INIT:
    case Types.CONTROL:
      return Object.assign({}, state, {controls: controls(state.controls, action)})
    default: return state
  }
}

function name(state="?", action) {
  switch(action.type) {
    case Types.MODULE_INIT: return action.name
  }
}

function programs(state=[], action) {
  switch(action.type) {
    case Types.PROGRAMS_INIT: return action.programs
    default: return state
  }
}

function program(state=null, action) {
  switch(action.type) {
    case Types.PROGRAM: return action.program
    default: return state
  }
}

function controls(state=[], action) {
  switch(action.type) {
    case Types.CONTROLS_INIT:
      return action.controls
    case Types.CONTROL:
      let i = state.findIndex(c => c.id==action.control)
      return [...state.slice(0,i), control(state[i], action), ...state.slice(i+1)]
    default: return state
  }
}

function control(state={}, action) {
  switch(action.type) {
    case Types.CONTROL: return Object.assign({}, state, {value: action.value})
  }
}

const appReducer = combineReducers({
  message,
  spinner,
  devices,
  device,
  modules,
});


export default appReducer;
