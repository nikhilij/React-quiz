const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('data/questions.json'); // Your JSON data file
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);
server.listen(process.env.PORT || 8000, () => {
  console.log('JSON Server is running');
});
