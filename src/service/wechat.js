const qs = require('querystring');
const crypto = require('crypto');

module.exports = class extends think.Service {
  async getAccessToken() {
    const accessToken = await think.cache('wechat_access_token');
    if(accessToken) {
      return accessToken;
    }

    const params = qs.stringify({
      grant_type: 'client_credential',
      appid: process.env.WECHAT_ID,
      secret: process.env.WECHAT_SECRET
    });
    const {
      errcode,
      errmsg,
      access_token,
      expires_in
    } = await this.fetch('https://api.weixin.qq.com/cgi-bin/token?' + params).then(resp => resp.json());
    if(errcode) {
      throw new Error(errmsg);
    }

    await think.cache('wechat_access_token', access_token, {
      timeout: expires_in
    });
    return access_token;  
  }

  async getTicket(accessToken) {
    const ticketToken = await think.cache('wechat_jsapi_ticket');
    if(ticketToken) {
      return ticketToken;
    }

    const params = qs.stringify({
      access_token: accessToken,
      type: 'jsapi'
    });
    const {
      errorcode,
      errmsg, 
      ticket,
      expires_in
    } = await this.fetch('https://api.weixin.qq.com/cgi-bin/ticket/getticket?' + params).then(resp => resp.json());

    if(errorcode) {
      throw new Error(errmsg);
    }

    await think.cache('wechat_jsapi_ticket', ticket, {
      timeout: expires_in
    });
    return ticket;
  }

  getNonceString() {
    return Math.random().toString(36).substr(2, 15);
  }

  getSignature(params) {
    const text = Object.keys(params).sort().map(k => k + '=' + params[k]).join('&');
    return crypto.createHash('sha1').update(text).digest('hex');
  }

  async getToken(url) {
    const accessToken = await this.getAccessToken();
    const ticket = await this.getTicket(accessToken);
    const noncestr = this.getNonceString();
    const timestamp = parseInt(new Date().getTime() / 1000) + '';
    
    const signature = this.getSignature({
      noncestr,
      url,
      jsapi_ticket: ticket,
      timestamp
    });

    return {
      debug: true,
      appId: process.env.WECHAT_ID,
      timestamp,
      nonceStr: noncestr,
      signature,
      jsApiList: [
        'updateAppMessageShareData',
        'updateTimelineShareData'
      ]
    };
  }
}