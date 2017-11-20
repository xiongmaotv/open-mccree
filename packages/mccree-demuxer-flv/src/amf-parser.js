'use strict';
class AmfParser {
  constructor(data) {
    this.offset = 0;
    this.data = data;
  }

  parseMetadata() {
    let metadata = {};
    try {
      let scriptData = this.parseAMF();
      for(let i = 0; i < scriptData.length - 1; i++) {
        if(typeof scriptData[i] === 'string' && scriptData[i] === 'onMetaData' && typeof scriptData[i + 1] === 'object') {
          metadata = scriptData[i + 1];
        }
      }
    } catch(e) {
      // TODO: 异常处理
    }
    return metadata;
  }

  parseAMF() {
    let result = [];

    // find on metadata 
    while (this.offset < this.data.length) {
      let type = this.data[this.offset];
      this.offset++;
      let value = this._switchAmfType(type);
      result.push(value);
    }
    return result;
  }
  // TODO: implement XML etc.
  _switchAmfType(type) {
    let value = null;
    switch (type) {
      case 0x00:
        value = this._parseNum();
        break;
      case 0x01:
        value = this._parseBoolean();
        break;
      case 0x02:
        value = this._parseString();
        break;
      case 0x03:
        value = this._parseObject();
        break; 
      case 0x04:
        value = 'MovieClip'; //reserved, not supported
        this.offset++;
        break;
      case 0x05:
        value = null; //reserved, not supported
        this.offset++;
        break;
      case 0x06:
        value = undefined; //reserved, not supported
        this.offset++;
        break;
      case 0x08:
        value = this._parseECMAArrary();
        break;
    }
    return value;
  }

  _parseNum() {
    let numData = this.data.slice(this.offset, this.offset + 8);
    this.offset += 8;
    return new DataView(numData.buffer).getFloat64(0);
  }

  _parseString() {
    let lengthData = this.data.slice(this.offset, this.offset + 2);
    let length = lengthData[0] * 256 + lengthData[1];
    this.offset += 2;
    let stringData = this.data.slice(this.offset, this.offset + length);
    this.offset += length;
    let string = new TextDecoder("utf-8").decode(stringData);
    return string;
  }
  
  _parseObject() {
    let val = {};
    while (this.offset < this.data.length - 2 && this.data[this.offset + 2] !== 0x09) {
      let key = this._parseString();
      let valueType = this.data[this.offset];
      this.offset++;
      let value = this._switchAmfType(valueType);
      val[key] = value;
    }
    this.offset += 3;
    return val;
  }

  _parseECMAArrary() {
    // let lengthData = this.data.slice(this.offset, this.offset + 4);
    // let length = new DataView(lengthData.buffer).getUint32(0);
    this.offset += 4;
    return this._parseObject();
  }

  _parseBoolean() {
    this.offset++;
    return !(this.data[0] === 0x00);
  }
}

export default AmfParser;