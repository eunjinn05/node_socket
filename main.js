const Koa = require('koa');
const path = require('path');
const Pug = require('koa-pug');
const websockify = require('koa-websocket');
const route = require('koa-route');
const serve = require('koa-static');
const mount = require('koa-mount');
const mongoclient = require('./mongo');

const app = websockify(new Koa());

app.use(mount('/public', serve('src')));

new Pug({
  viewPath: path.resolve(__dirname, './views'),
  app,
});

app.use(async (ctx) => {
  await ctx.render('main');
});

const client = mongoclient.connect();

async function getChatsCollection() {
  client = await client;
  return client.db('chat').collection('chats');
}

app.ws.use(
  route.all('/ws', async (ctx) => {
    const chatsCursor = ChatsCollection;
    ctx.websocket.on('message', async (data) => {
      const chat = JSON.parse(data);

      const ChatsCollection = await getChatsCollection();
      await ChatsCollection.insertOne(chat);

      const { message, nickname } = chat;

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
