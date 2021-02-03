const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const url = this.ctx.href;
    const config = await this.service('wechat').getToken(url);

    this.assign({url, config, host: this.ctx.state.host});
    return this.display();
  }
};
