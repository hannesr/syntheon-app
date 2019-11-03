import * as Types from '../actions/Types'
import RemoteConnection from '../RemoteConnection'

const remote = RemoteConnection.getInstance();

function message(msg, spin) {
  return {type: Types.SHOW_MESSAGE, message: msg, spinner: spin}
}

function startScan() {
  return async (dispatch, getState) => {
    remote.startScan(
      (d) => dispatch({type: Types.FOUND_DEVICE, device: d}),
      (err) => dispatch(Actions.message("Scan failed: "+err, false))
    )
  }
}

function stopScan() {
  return async (dispatch, getState) => {
    await remote.stopScan()
    dispatch(Actions.message(null))
  }
}

function connectDevice(device) {
  return async (dispatch, getState) => {
    dispatch({type:Types.MODULE_INIT, module: "rakarrack", name: "Effect"})
    dispatch({type:Types.MODULE_INIT, module: "zynaddsubfx", name: "Synth"})

    try {
      await remote.connect(device)
      dispatch(Actions.message("Initializing ...", true))
      dispatch({type: Types.CURRENT_DEVICE, device: device})

      let effectBank = await remote.getEffectBank()
      dispatch({type:Types.PROGRAMS_INIT, module:"rakarrack", programs:effectBank})
      let effectState = await remote.getEffectState()
      dispatch({type:Types.CONTROLS_INIT, module:"rakarrack", controls: [
        {id:"main", name:"On/Off", type:"bool", value:effectState}
      ] })
      let effectPreset = await remote.getEffectPreset()
      dispatch({type:Types.PROGRAM, module:"rakarrack", program:effectPreset})

      let synthBank = await remote.getSynthBank()
      dispatch({type:Types.PROGRAMS_INIT, module:"zynaddsubfx", programs:synthBank})
      let synthServiceState = await remote.getSynthServiceState()
      let synthEffectState = await remote.getSynthServiceState()
      dispatch({type:Types.CONTROLS_INIT, module:"zynaddsubfx", controls: [
        {id:"main", name:"On/Off", type:"bool", value:synthServiceState},
        {id:"effect", name:"Effect", type:"bool", value:synthEffectState}
      ] })
      let synthPreset = await remote.getSynthPreset()
      dispatch({type:Types.PROGRAM, module:"zynaddsubfx", program:synthPreset})
      dispatch(Actions.message("", false))
    } catch (err) {
      dispatch(Actions.message("Connect failed: "+err))
    }

  }
}

function disconnectDevice() {
  return async (dispatch, getState) => {
    try {
      await remote.disconnect()
      dispatch({type: Types.CURRENT_DEVICE, device: null})
    } catch (err) {
      dispatch(Actions.message("Disconnect failed: "+err))
    }
  }
}

function setProgram(module, program) {
  return async (dispatch, getState) => {
    try {
      await (module=='rakarrack' ? remote.setEffectPreset(program) : remote.setSynthPreset(program))
      dispatch({type: Types.PROGRAM, module: module, program: program})
    } catch (err) {
      dispatch(Actions.message("Command failed: "+err))
    }
  }
}

function setControl(module, control, value) {
  return async (dispatch, getState) => {
    try {
      await (module=='rakarrack' ? remote.setEffectState(value) :
            (control=='main' ? remote.setSynthServiceState(value) :
             remote.setSynthEffectState(value)))
      dispatch({type: Types.CONTROL, module: module, control: control, value: value})
    } catch(err) {
      dispatch(Actions.message("Command failed: "+err))
    }
  }
}

const Actions = {
  message,
  startScan,
  stopScan,
  connectDevice,
  disconnectDevice,
  setProgram,
  setControl,
}

export default Actions
