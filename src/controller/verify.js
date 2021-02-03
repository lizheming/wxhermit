const Base = require('./base.js');

module.exports = class extends Base {
  wechatAction() {
    const {code} = this.get();
    this.body = code;
  }
}