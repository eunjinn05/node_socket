const Koa = require('koa');
const path = require('path');
const Pug = require('koa-pug');
const websockify = require('koa-websocket');
const route = require('koa-route');
const serve = require('koa-static');
const mount = require('koa-mount');

const app = websockify(new Koa());

app.use(mount('/public', serve('src')));

new Pug({
  viewPath: path.resolve(__dirname, './views'),
  app,
});

app.use(async (ctx) => {
  await ctx.render('main');
});

app.ws.use(
  route.all('/ws', function (ctx) {
    ctx.websocket.on('message', function (data) {
      const { message, nickname } = JSON.parse(data);

      const { server } = app.ws;

      server.clients.forEach((clients) => {
        clients.send(
          JSON.stringify({
            message,
            nickname,
          }),
        );
      });

      //   ctx.websocket.send(
      //     JSON.stringify({
      //       message,
      //       nickname,
      //     }),
      //   );
    });
  }),
);

app.listen(3000);
