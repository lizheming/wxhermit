const Base = require('./base.js');
module.exports = class extends Base {
  async indexAction() {
    const {url: originalUrl} = this.get();
    this.assign({originalUrl, host: this.ctx.state.host});
    return this.display();
  }
};
