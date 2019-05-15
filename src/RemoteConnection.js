
import {BleManager, BleError, Device, State} from "react-native-ble-plx";
import {Buffer} from 'buffer';
import DeviceInfo from 'react-native-device-info';

class RemoteConnection {

  static instance = null;

  static getInstance() {
    console.log(`... RemoteConnection.getInstance`);
    if (!RemoteConnection.instance) {
      if (DeviceInfo.isEmulator())
        RemoteConnection.instance = new FakeConnection();
      else
        RemoteConnection.instance = new BleConnection();
    }
    return RemoteConnection.instance;
  }

}

class BleConnection {

  constructor() {
    console.log(`... BleConnection: constructor`);
    this.bleManager = new BleManager();
    this.device = null;
    this.SERVICE              = makeUuid('989e');
    this.EFFECT_BANK_CS       = makeUuid('9b43');
    this.EFFECT_BANK          = makeUuid('9b96');
    this.EFFECT_STATE         = makeUuid('9d10');
    this.EFFECT_PRESET        = makeUuid('9d12');
    this.EFFECT_CONTROL_LIST  = makeUuid('9d19');
    this.EFFECT_CONTROL       = makeUuid('9d1a');
    this.SYNTH_SERVICE_STATE  = makeUuid('9e01');
    this.SYNTH_EFFECT_STATE   = makeUuid('9e04');
    this.SYNTH_CONTROL_LIST   = makeUuid('9e08');
    this.SYNTH_CONTROL        = makeUuid('9e0a');
    this.counter = 0;
    this.transaction = null;
  }

  startScan(success, failure) {
    console.log(`... BleConnection.startScan`);
    this.bleManager.startDeviceScan(null, null, (e,d)=>{
      if (d) {
        const device = {id:d.id, name:(d.name || d.id)};
        success(device);
      } else {
        failure(e);
      }
    });
  }

  stopScan() {
    console.log(`... BleConnection.stopScan`);
    this.bleManager.stopDeviceScan();
  }

  async connect(device) {
    console.log(`... BleConnection.connect ${device.id}`);
    this.device = await this.bleManager.connectToDevice(device.id);
    await this.device.discoverAllServicesAndCharacteristics();
    //this.services = await this.device.services()
    //console.log(this.services.map((it) => (it.uuid)));
  }

  async disconnect() {
    if (this.device) {
      console.log(`... BleConnection: disconnect`);
      await this.bleManager.cancelDeviceConnection(this.device.id);
      this.device = null;
    }
  }

  async getEffectBankCs() {
    console.log(`... BleConnection.getEffectBankCs`);
    let characteristic = await this.bleManager.readCharacteristicForDevice(
      this.device.id, this.SERVICE, this.EFFECT_BANK_CS, this.transact());
    this.transaction = null;
    const buf = Buffer.from(characteristic.value, 'base64');
    return buf.toString();
  }

  async getEffectBank() {
    console.log(`... BleConnection.getEffectBank`);
    let characteristic = await this.bleManager.readCharacteristicForDevice(
      this.device.id, this.SERVICE, this.EFFECT_BANK, this.transact());
    this.transaction = null;
    const buf = Buffer.from(characteristic.value, 'base64');
    return JSON.parse(buf.toString());
  }

  async getEffectState() {
    console.log(`... BleConnection.getEffectState`);
    let characteristic = await this.bleManager.readCharacteristicForDevice(
      this.device.id, this.SERVICE, this.EFFECT_STATE, this.transact());
    this.transaction = null;
    const buf = Buffer.from(characteristic.value, 'base64');
    return buf[0] ? true : false;
  }

  async setEffectState(status) {
    console.log(`... BleConnection.setEffectState ${status}`);
    const buf = Buffer.from([status ? 1 : 0]);
    await this.bleManager.writeCharacteristicWithResponseForDevice(
      this.device.id, this.SERVICE, this.EFFECT_STATE, buf.toString('base64'), this.transact());
    this.transaction = null;
  }

  async getEffectPreset() {
    console.log(`... BleConnection.getEffectPreset`);
    let characteristic = await this.bleManager.readCharacteristicForDevice(
      this.device.id, this.SERVICE, this.EFFECT_PRESET, this.transact());
    this.transaction = null;
    const buf = Buffer.from(characteristic.value, 'base64');
    return buf[0];
  }

  async setEffectPreset(preset) {
    console.log(`... BleConnection.setEffectPreset ${preset}`);
    const buf = Buffer.from([preset]);
    await this.bleManager.writeCharacteristicWithResponseForDevice(
      this.device.id, this.SERVICE, this.EFFECT_PRESET, buf.toString('base64'), this.transact());
    this.transaction = null;
  }

  async getEffectControlList() {
    console.log(`... BleConnection.getEffectControlList`);
    let characteristic = await this.bleManager.readCharacteristicForDevice(
      this.device.id, this.SERVICE, this.EFFECT_CONTROL_LIST, this.transact());
    this.transaction = null;
    const buf = Buffer.from(characteristic.value, 'base64');
    return JSON.parse(buf.toString());
  }

  async setEffectControls() {
    const effects = Object.values(arguments);
    console.log(`... BleConnection.setEffectControls ${effects}`);
    const buf = Buffer.from(effects);
    await this.bleManager.writeCharacteristicWithoutResponseForDevice(
      this.device.id, this.SERVICE, this.EFFECT_CONTROL, buf.toString('base64'));
  }

  async getSynthServiceState() {
    console.log(`... BleConnection.getSynthServiceState`);
    let characteristic = await this.bleManager.readCharacteristicForDevice(
      this.device.id, this.SERVICE, this.SYNTH_SERVICE_STATE, this.transact());
    this.transaction = null;
    const buf = Buffer.from(characteristic.value, 'base64');
    return buf[0] ? true : false;
  }

  async setSynthServiceState(status) {
    console.log(`... BleConnection.setSynthServiceState ${status}`);
    const buf = Buffer.from([status ? 1 : 0]);
    await this.bleManager.writeCharacteristicWithResponseForDevice(
      this.device.id, this.SERVICE, this.SYNTH_SERVICE_STATE, buf.toString('base64'), this.transact());
    this.transaction = null;
  }

  async getSynthEffectState() {
    console.log(`... BleConnection.getSynthEffectState`);
    let characteristic = await this.bleManager.readCharacteristicForDevice(
      this.device.id, this.SERVICE, this.SYNTH_EFFECT_STATE, this.transact());
    this.transaction = null;
    const buf = Buffer.from(characteristic.value, 'base64');
    return buf[0] ? true : false;
  }

  async setSynthEffectState(status) {
    console.log(`... BleConnection.setSynthEffectState ${status}`);
    const buf = Buffer.from([status ? 1 : 0]);
    await this.bleManager.writeCharacteristicWithResponseForDevice(
      this.device.id, this.SERVICE, this.SYNTH_EFFECT_STATE, buf.toString('base64'), this.transact());
    this.transaction = null;
  }

  async getSynthControlList() {
    console.log(`... BleConnection.getSynthControlList`);
    let characteristic = await this.bleManager.readCharacteristicForDevice(
      this.device.id, this.SERVICE, this.SYNTH_CONTROL_LIST, this.transact());
    this.transaction = null;
    const buf = Buffer.from(characteristic.value, 'base64');
    return JSON.parse(buf.toString());
  }

  async setSynthControls() {
    const controls = Object.values(arguments);
    console.log(`... BleConnection.setSynthControl ${controls}`);
    const buf = Buffer.from(controls);
    await this.bleManager.writeCharacteristicWithoutResponseForDevice(
      this.device.id, this.SERVICE, this.SYNTH_CONTROL, buf.toString('base64'));
  }

  transact() {
    this.counter += 1;
    this.transaction = `syn-${this.counter}`;
    return this.transaction;
  }

  cancel() {
    if (this.transaction) {
      this.bleManager.cancelTransaction(this.transaction);
    }
  }

}

function makeUuid(uuid) {
  // TODO - this only works with my own test device...
  return '0000xxxx-0000-1000-8000-00805f9b34fb'.replace('xxxx', uuid);
}

class FakeConnection {

  constructor() {
    console.log(`... FakeConnection.constructor`);
    this.device = null;
    this.preset = 0;
    this.synthStatus = false;
    this.synthEffect = false;
  }

  startScan(success, failure) {
    console.log(`... FakeConnection.startScan`);
    const device = {id:"47283717", name:"Test device"};
    success(device);
  }

  stopScan() {
    console.log(`... FakeConnection.stopScan`);
  }

  connect(device) {
    console.log(`... FakeConnection.connect ${device.id}`);
    this.device = device;
  }

  disconnect() {
    if (this.device) {
      console.log(`... FakeConnection.disconnect`);
      this.device = null;
    }
  }

  getEffectBankCs() {
    console.log(`... FakeConnection.getEffectBankCs`);
    return JSON.stringify(this.getEffectBank()).length.toString()
  }

  getEffectBank() {
    console.log(`... FakeConnection.getEffectBank`);
    return ["Buzz", "Snore", "Distort", "Noise"];
  }

  getEffectState() {
    console.log(`... FakeConnection.getEffectState`);
    return this.presetOn;
  }

  setEffectState(status) {
    console.log(`... FakeConnection.setEffectState`);
    this.presetOn = status;
  }

  getEffectPreset() {
    console.log(`... FakeConnection.getEffectPreset`);
    return this.preset;
  }

  setEffectPreset(preset) {
    console.log(`... FakeConnection.setEffectPreset`);
    this.preset = preset;
  }

  getEffectControlList() {
    console.log(`... FakeConnection.getEffectControlList`);
    return ["FX%", "Distort%", "Reverb depth", "Arpie freq"];
  }

  setEffectControls() {
    const effects = Object.values(arguments);
    for (let i=0; i+1<effects.length; i+=2) {
      console.log(`... FakeConnection.setEffectControls ${effects[i]}, ${effects[i+1]}`);
    }
  }

  getSynthServiceState() {
    console.log(`... FakeConnection.getSynthServiceState`);
    return this.synthStatus;
  }

  setSynthServiceState(state) {
    console.log(`... FakeConnection.setSynthServiceState ${state}`);
    this.synthStatus = state;
  }

  getSynthEffectState() {
    console.log(`... FakeConnection.getSynthEffectState`);
    return this.synthEffect;
  }

  setSynthEffectState(state) {
    console.log(`... FakeConnection.setSynthEffectState ${state}`);
    this.synthEffect = state;
  }

  getSynthControlList() {
    console.log(`... FakeConnection.getSynthControlList`);
    return ["Volume", "Modulation"];
  }

  setSynthControls() {
    const controls = Object.values(arguments);
    for (let i=0; i+1<controls.length; i+=2) {
      console.log(`... FakeConnection.setSynthControls ${controls[i]}, ${controls[i+1]}`);
    }
  }

  cancel() {
  }

}


export default RemoteConnection;
