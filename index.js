const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
  const type = ctx.path.slice(1);
  const wechatVerifyMatch = type.match(/MP_verify_([a-zA-Z0-9]+)\.txt/);
  if(wechatVerifyMatch) {
    return ctx.body = wechatVerifyMatch[1];
  }

  next();
});

module.exports = app.callback();