# wxhermit

wxhermit 是基于 `<iframe>` 方式解决多域名、无法备案域名微信分享自定义分享文案的解决方案。使用该方案，只需要有一个域名做好微信分享交互，其它域名即可通过该域名实现自定义分享。

## 使用方式

> **使用前提：**
> 1. 需要保证有一个已认证的微信公众号，并在后台“JS接口安全域名”中绑定了一个已备案域名。
> 2. 需要有一个固定 IP 的机器，并在微信公众号后台“IP白名单”中给该 IP 加白。

1. 使用 Docker 启动服务。
    ```
    docker run \
      -e WECHAT_ID=<WECHAT_ID> \
      -e WECHAT_SECRET=<WECHAT_SECRET> \
      -e ALLOW_HOST_LIST=<ALLOW_HOST_LIST> \
      -p 8360:8360
      lizheming/wxhermit
    ```
    **注：**
    1. `WECHAT_ID` 和 `WECHAT_SECRET` 是在微信公众号后台<kbd>开发</kbd>-<kbd>基本配置</kbd>中获取的“开发者ID”和“开发者密码”。
    2. `ALLOW_HOST_LIST` 用来配置允许哪些域名使用该服务，可以使用逗号拼接多个域名，例如 `imnerd.org,eming.li`。不在该列表中的域名会直接跳转会源地址。

2. 配置 Nginx，其中 `<domain>` 为已备案域名
    ```
    server {
      listen  80;
      server_name     <domain>;

      location / {
        proxy_http_version	1.1;
        proxy_set_header	X-Real-IP	$remote_addr;
        proxy_set_header	X-Forwarded-For	$proxy_add_x_forwarded_for;
        proxy_set_header	Host	$http_host;
        proxy_set_header	Upgrade	$http_upgrade;
        proxy_set_header	Connection	"upgrade";
        proxy_pass	http://127.0.0.1:8360$request_uri;
        proxy_redirect	off;
      }
    }
    ```

3. 服务启动后即可进入微信公众号后台在“JS安全域名”中配置该域名，同时在 <kbd>开发</kbd>-<kbd>基本配置</kbd>-<kbd>IP白名单</kbd>中将服务器 IP 进行加白处理。
4. 对于需要使用该服务自定义分享文案的网站，需要增加以下代码用于自定义分享文案：
    ```html
    <script>
    if (window.parent !== window) {
      window.parent.postMessage({ 
        type: 'wxhermit',
        title: '自定义分享的标题',
        desc: '自定义分享的描述',
        imgUrl: '自定义分享的封面图'
      }, '*');
    }
    </script>
    ```
5. 配置好后就可以在微信使用 `<domain>/?url=<url>` 来访问了，其中 `<domain>` 是你的已绑定的安全域名，`<url>` 则是在 `ALLOW_HOST_LIST` 中配置的可使用域名下的网址。
  

## 原理

方案的原理非常简单，基于某个已做了微信分享配置的域名，通过 `<iframe>` 内嵌的形式将多域名都挂靠在该域名下进行分享，本质还是分享该备案域名。

由于微信分享需要提供已认证公众号并绑定已备案域名，一个已认证公众号只能绑定至多 5 个安全域名，条件颇为苛刻。针对5个以上的域名，部分域名无法备案的情况，要自定义微信分享的文案就非常麻烦。本方案比较好的迂回解决该问题。

不过缺点是分享页打开顶部显示的域名使用都是一个域名，所以不建议在 2C 的生产环境中使用。

## 示例

<https://wechat.75.team/?url=https://imnerd.org>

## License

[MIT](https://github.com/lizheming/wxhermit/blob/master/LICENSE)