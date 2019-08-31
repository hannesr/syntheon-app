import * as Types from '../actions/Types'
import RemoteConnection from '../RemoteConnection'

const remote = RemoteConnection.getInstance();

const Actions = {
  message: (msg, spin) => {
    return {type: Types.SHOW_MESSAGE, message: msg, spinner: spin}
  },

  startScan: () => {
    return (dispatch, getState) => {
      remote.startScan(
        (d) => dispatch(Actions.foundDevice(d)),
        (err) => dispatch(Actions.message("Scan failed: "+err, false))
      )
    }
  },

  stopScan: () => {
    return (dispatch, getState) => {
      remote.stopScan()
      dispatch(Actions.message(null))
    }
  },

  foundDevice: (d) => {
    return {type: Types.FOUND_DEVICE, device: d}
  },

  connectDevice: (d) => {
    return (dispatch, getState) => {
      remote.connect(d)
      .then(() => dispatch(Actions.currentDevice(d)))
      .catch((err) => dispatch(Actions.message("Connect failed: "+err, false)))
    }
  },

  disconnectDevice: () => {
    return (dispatch, getState) => {
      remote.disconnect()
      .then(() => dispatch(Actions.currentDevice(null)))
      .catch((err) => dispatch(Actions.message("Disconnect failed: "+err, false)))
    }
  },

  currentDevice: (d) => {
    return {type: Types.CURRENT_DEVICE, device: d}
  }
}

export default Actions
