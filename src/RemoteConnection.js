
import {BleManager, BleError, Device, State} from "react-native-ble-plx";
import {Buffer} from 'buffer';

class RemoteConnection {

  static instance = null;

  static getInstance() {
    console.log(`... RemoteConnection.getInstance`);
    if (!RemoteConnection.instance) {
      if (__DEV__)
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
    this.SERVICE  = makeUuid('989e');
    this.BANK_CS  = makeUuid('9b43');
    this.BANK     = makeUuid('9b96');
    this.PRESET   = makeUuid('9d12');
    this.counter = 0;
    this.transaction = null;
  }

  startScan(success, failure) {
    console.log(`... BleConnection: startScan`);
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
    console.log(`... BleConnection: stopScan`);
    this.bleManager.stopDeviceScan();
  }

  async connect(device) {
    console.log(`... BleConnection: connecting to ${device.id}`);
    this.device = await this.bleManager.connectToDevice(device.id);
    await this.device.discoverAllServicesAndCharacteristics();
    //this.services = await this.device.services()
    //console.log(this.services.map((it) => (it.uuid)));
  }

  async disconnect() {
    if (this.device) {
      console.log(`... BleConnection: disconnecting`);
      await this.bleManager.cancelDeviceConnection(this.device.id);
      this.device = null;
    }
  }

  async getBankCs() {
    console.log(`... BleConnection.getBankCs`);
    let characteristic = await this.bleManager.readCharacteristicForDevice(
      this.device.id, this.SERVICE, this.BANK_CS, this.transact());
    this.transaction = null;
    const buf = Buffer.from(characteristic.value, 'base64');
    return buf.toString();
  }

  async getBank() {
    console.log(`... BleConnection.getBank`);
    let characteristic = await this.bleManager.readCharacteristicForDevice(
      this.device.id, this.SERVICE, this.BANK, this.transact());
    this.transaction = null;
    const buf = Buffer.from(characteristic.value, 'base64');
    return JSON.parse(buf.toString());
  }

  async getPreset() {
    console.log(`... BleConnection.getPreset`);
    let characteristic = await this.bleManager.readCharacteristicForDevice(
      this.device.id, this.SERVICE, this.PRESET, this.transact());
    this.transaction = null;
    const buf = Buffer.from(characteristic.value, 'base64');
    return buf[0];
  }

  async setPreset(preset) {
    console.log(`... BleConnection.setPreset ${preset}`);
    const buf = Buffer.from([preset]);
    await this.bleManager.writeCharacteristicWithResponseForDevice(
      this.device.id, this.SERVICE, this.PRESET, buf.toString('base64'), this.transact());
    this.transaction = null;
  }

  getEffects() {
    console.log(`... BleConnection: getEffects`);
    // TODO
  }

  setEffects() {
    console.log("... BleConnection: setEffects "+arguments);
    // TODO
  }

  transact() {
    this.counter += 1;
    this.transaction = `syn-${this.counter}`;
    return this.transaction;
  }

  cancel() {
    if (this.transaction) {
      this.bleManager.cancelTransaction(this.transaction);
      this.transaction = null;
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
  }

  startScan(success, failure) {
    console.log(`... FakeConnection: start scan`);
    const device = {id:"47283717", name:"Test device"};
    success(device);
  }

  stopScan() {
    console.log(`... FakeConnection: stop scan`);
  }

  connect(device) {
    console.log(`... FakeConnection: connect ${device.id}`);
    this.device = device;
  }

  disconnect() {
    if (this.device) {
      console.log(`... FakeConnection: disconnect`);
      this.device = null;
    }
  }

  getBankCs() {
    console.log(`... FakeConnection: getBankCs`);
    return JSON.stringify(this.getBank()).length.toString()
  }

  getBank() {
    console.log(`... FakeConnection: getBank`);
    return [null, "Buzz", "Snore", "Distort", "Noise"];
  }

  getPreset() {
    console.log(`... FakeConnection: getPreset`);
    return this.preset;
  }

  setPreset(preset) {
    console.log(`... FakeConnection: setPreset`);
    this.preset = preset;
  }

  getEffects() {
    console.log(`... FakeConnection: getEffects`);
    return ["FX%", "Distort%", "Reverb depth", "Arpie freq"];
  }

  setEffects() {
    for (let i=0; i+1<arguments.length; i+=2) {
      console.log(`... FakeConnection: setEffects ${arguments[i]}, ${arguments[i+1]}`);
    }
  }

  cancel() {
  }

}


export default RemoteConnection;
