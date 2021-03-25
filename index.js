const { connect } = require('json-over-tcp');

class YunBridge {
  constructor(port) {
    this.port = port || 5700;
    this.socket = null;
    this.shouldCloseAtFunctionEnd = true;
  }

  waitResponse(socket, timeout) {
    return new Promise((res)=>{
      var callback = data => {
        res(data.answer);
      }
      socket.on('data', callback);
      setTimeout(()=>{
        this.socket.removeListener('data', callback);
        res(null);
      }, timeout*1000);
    });
  }

  async waitKey(key, socket, timeout) {
    let d = await this.waitResponse(socket, timeout);
    if (d == null) return null;
    if (d['key'] == key) return r['value'];
    return null;
  }

  socketOpen() {
    if (this.socket == null) this.socket = connect(this.port, ()=>{});
    return this.socket;
  }

  socketClose() {
    if (this.socket != null && this.shouldCloseAtFunctionEnd) {
      this.socket.close();
      this.socket = null;
    }
  }

  begin() {
    this.socketOpen();
    this.shouldCloseAtFunctionEnd = false;
  }

  close() {
    this.shouldCloseAtFunctionEnd = true;
    this.socketClose();
  }

  async get(key) {
    let s = this.socketOpen();
    s.write({command: 'get', key: key});
    let r = await self.waitKey(key, s, 10);
    self.socketClose();
    return r;
  }

  async getall() {
    let s = this.socketOpen();
    s.write({command: 'get'});
    let r = await self.waitResponse(s, 10);
    if (r != null) {
      r = r['value'];
    }
    self.socketClose();
    return r;
  }

  async put(key,value) {
    let s = this.socketOpen();
    s.write({command: 'put', key, value});
    let r = await this.waitKey(key, s, 10);
    this.socketClose();
    return r;
  }

  async delete(key) {
    let s = this.socketOpen();
    s.write({command: 'delete', key});
    let r = await this.waitResponse(s, 10);
    if (r != null && r['value'] != null) r = r['value'];
    this.socketClose();
    return r;
  }

  mailbox(message) {
    let s = this.socketOpen();
    s.write({command: 'raw', data: message});
    this.socketClose();
  }
}

module.exports = YunBridge;
