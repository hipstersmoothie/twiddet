const express = require('express');
const next = require('next');
const twitter = require('./routes/twitter');

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

async function startServer() {
  await app.prepare();

  try {
    const server = express();

    server.use('/api', twitter);
    server.get('*', handle);
    server.listen(PORT, err => {
      if (err) {
        throw err;
      }

      console.log(`> Ready on ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

startServer();
