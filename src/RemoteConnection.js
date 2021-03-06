
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
    this.SYNTH_BANK_CS        = makeUuid('9e12');
    this.SYNTH_BANK           = makeUuid('9e14');
    this.SYNTH_SERVICE_STATE  = makeUuid('9e01');
    this.SYNTH_EFFECT_STATE   = makeUuid('9e04');
    this.SYNTH_PRESET         = makeUuid('9e17');
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
    let bank = JSON.parse(buf.toString());
    bank = bank.map((e,i) => ({id:i.toString(), name:e}));
    return bank;
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
    const buf = Buffer.from([parseInt(preset)]);
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

  async getSynthBankCs() {
    console.log(`... BleConnection.getSynthBankCs`);
    let characteristic = await this.bleManager.readCharacteristicForDevice(
      this.device.id, this.SERVICE, this.SYNTH_BANK_CS, this.transact());
    this.transaction = null;
    const buf = Buffer.from(characteristic.value, 'base64');
    return buf.toString();
  }

  async getSynthBank() {
    console.log(`... BleConnection.getSynthBank`);
    let characteristic = await this.bleManager.readCharacteristicForDevice(
      this.device.id, this.SERVICE, this.SYNTH_BANK, this.transact());
    this.transaction = null;
    const buf = Buffer.from(characteristic.value, 'base64');
    let bank = JSON.parse(buf.toString());
    bank = bank.map((e,i) => ({id:i.toString(), name:e}));
    return bank;
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

  async getSynthPreset() {
    console.log(`... BleConnection.getSynthPreset`);
    let characteristic = await this.bleManager.readCharacteristicForDevice(
      this.device.id, this.SERVICE, this.SYNTH_PRESET, this.transact());
    this.transaction = null;
    const buf = Buffer.from(characteristic.value, 'base64');
    return buf[0];
  }

  async setSynthPreset(preset) {
    console.log(`... BleConnection.setSynthPreset ${preset}`);
    const buf = Buffer.from([parseInt(preset)]);
    await this.bleManager.writeCharacteristicWithResponseForDevice(
      this.device.id, this.SERVICE, this.SYNTH_PRESET, buf.toString('base64'), this.transact());
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
    this.presetStatus = false;
  }

  startScan(success, failure) {
    console.log(`... FakeConnection.startScan`);
    const device = {id:"47283717", name:"Test device"};
    success(device);
  }

  stopScan() {
    console.log(`... FakeConnection.stopScan`);
  }

  async connect(device) {
    console.log(`... FakeConnection.connect ${device.id}`);
    this.device = device;
  }

  async disconnect() {
    if (this.device) {
      console.log(`... FakeConnection.disconnect`);
      this.device = null;
    }
  }

  async getEffectBankCs() {
    console.log(`... FakeConnection.getEffectBankCs`);
    return JSON.stringify(this.getEffectBank()).length.toString()
  }

  async getEffectBank() {
    console.log(`... FakeConnection.getEffectBank`);
    let bank = ["Buzz", "Snore", "Distort", "Reverb", "Echo", "Wah Wah", "Delay", "Flanger", "Noise"];
    bank = bank.map((e,i) => ({id:i.toString(), name:e}));
    return bank;
  }

  async getEffectState() {
    console.log(`... FakeConnection.getEffectState`);
    return this.presetStatus;
  }

  async setEffectState(status) {
    console.log(`... FakeConnection.setEffectState`);
    this.presetStatus = status;
  }

  async getEffectPreset() {
    console.log(`... FakeConnection.getEffectPreset`);
    return this.preset;
  }

  async setEffectPreset(preset) {
    console.log(`... FakeConnection.setEffectPreset`);
    this.preset = preset;
  }

  async getEffectControlList() {
    console.log(`... FakeConnection.getEffectControlList`);
    return ["FX%", "Distort%", "Reverb depth", "Arpie freq"];
  }

  async setEffectControls() {
    const effects = Object.values(arguments);
    for (let i=0; i+1<effects.length; i+=2) {
      console.log(`... FakeConnection.setEffectControls ${effects[i]}, ${effects[i+1]}`);
    }
  }

  async getSynthBankCs() {
    console.log(`... FakeConnection.getSynthBankCs`);
    return JSON.stringify(this.getSynthBank()).length.toString()
  }

  async getSynthBank() {
    console.log(`... FakeConnection.getSynthBank`);
    let bank = ["Piano", "Organ", "Violin", "Tuba", "Space woo woo", "Cling", "Aah"];
    bank = bank.map((e,i) => ({id:i.toString(), name:e}));
    return bank;
  }

  async getSynthServiceState() {
    console.log(`... FakeConnection.getSynthServiceState`);
    return this.synthStatus;
  }

  async setSynthServiceState(state) {
    console.log(`... FakeConnection.setSynthServiceState ${state}`);
    this.synthStatus = state;
  }

  async getSynthEffectState() {
    console.log(`... FakeConnection.getSynthEffectState`);
    return this.synthEffect;
  }

  async setSynthEffectState(state) {
    console.log(`... FakeConnection.setSynthEffectState ${state}`);
    this.synthEffect = state;
  }

  async getSynthPreset() {
    console.log(`... FakeConnection.getSynthPreset`);
    return this.synthPreset;
  }

  async setSynthPreset(preset) {
    console.log(`... FakeConnection.setSynthPreset ${preset}`);
    this.synthPreset = preset
  }

  async getSynthControlList() {
    console.log(`... FakeConnection.getSynthControlList`);
    return ["Volume", "Modulation"];
  }

  async setSynthControls() {
    const controls = Object.values(arguments);
    for (let i=0; i+1<controls.length; i+=2) {
      console.log(`... FakeConnection.setSynthControls ${controls[i]}, ${controls[i+1]}`);
    }
  }

  cancel() {
  }

}


export default RemoteConnection;
