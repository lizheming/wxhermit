const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const {url, debug} = this.get();
    const config = await this.service('wechat').getToken(url);
    config.debug = debug;
    
    return this.json(config);
  }
};
