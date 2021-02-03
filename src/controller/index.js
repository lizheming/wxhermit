const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const {url: originalUrl} = this.get();
    const url = this.ctx.href;
    const config = await this.service('wechat').getToken(url);

    this.assign({url, originalUrl, host: this.ctx.state.host, config});
    return this.display();
  }
};
