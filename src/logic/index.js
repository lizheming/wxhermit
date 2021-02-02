const {parse} = require('url');

module.exports = class extends think.Logic {
  indexAction() {
    const {url} = this.get();
    const {userAgent} = this.ctx;
    if(!/micromessenger/i.test(userAgent)) {
      return this.redirect(url);
    }

    const allowList = process.env.ALLOW_HOST_LIST.split(',');
    this.ctx.state.host = (new URL(url)).host;
    if(!allowList.includes(this.ctx.state.host)) {
      return this.redirect(url);
    }
  }
}