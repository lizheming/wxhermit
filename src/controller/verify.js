const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    const {code} = this.get();
    this.body = code;
  }
}