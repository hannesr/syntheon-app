
import {BleManager, BleError, Device, State} from "react-native-ble-plx";
import {Buffer} from 'buffer';

class RemoteConnection {

  static instance = null;

  constructor() {
    console.log("... RemoteConnection.constructor");
    this.bleManager = new BleManager();
    this.device = null;
    this.SERVICE  = makeUuid('989e');
    this.BANK_CS  = makeUuid('9b43');
    this.BANK     = makeUuid('9b96');
    this.PRESET   = makeUuid('9d12');
    this.counter = 0;
    this.transaction = null;
  }

  static getInstance() {
    console.log("... RemoteConnection.getInstance");
    if (!RemoteConnection.instance) {
      RemoteConnection.instance = new RemoteConnection();
    }
    return RemoteConnection.instance;
  }

  startScan(success, failure) {
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
    this.bleManager.stopDeviceScan();
  }

  async connect(device) {
    console.log("... RemoteConnection: connecting to "+device.id);
    this.device = await this.bleManager.connectToDevice(device.id);
    await this.device.discoverAllServicesAndCharacteristics();
    //this.services = await this.device.services()
    //console.log(this.services.map((it) => (it.uuid)));
  }

  async disconnect() {
    if (this.device) {
      await this.bleManager.cancelDeviceConnection(this.device.id);
      this.device = null;
    }
  }

  async getBankCs() {
    console.log("... RemoteConnection.getBankCs");
    let characteristic = await this.bleManager.readCharacteristicForDevice(
      this.device.id, this.SERVICE, this.BANK_CS, this.transact());
    this.transaction = null;
    const buf = Buffer.from(characteristic.value, 'base64');
    return buf.toString();
  }

  async getBank() {
    console.log("... RemoteConnection.getBank");
    let characteristic = await this.bleManager.readCharacteristicForDevice(
      this.device.id, this.SERVICE, this.BANK, this.transact());
    this.transaction = null;
    const buf = Buffer.from(characteristic.value, 'base64');
    return JSON.parse(buf.toString());
  }

  async getPreset() {
    console.log("... RemoteConnection.getPreset");
    let characteristic = await this.bleManager.readCharacteristicForDevice(
      this.device.id, this.SERVICE, this.PRESET, this.transact());
    this.transaction = null;
    const buf = Buffer.from(characteristic.value, 'base64');
    return buf[0];
  }

  async setPreset(preset) {
    console.log("... RemoteConnection.setPreset "+preset);
    const buf = Buffer.from([preset]);
    await this.bleManager.writeCharacteristicWithResponseForDevice(
      this.device.id, this.SERVICE, this.PRESET, buf.toString('base64'), this.transact());
    this.transaction = null;
  }

  transact() {
    this.counter += 1;
    this.transaction = "syn-"+this.counter;
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

export default RemoteConnection;
