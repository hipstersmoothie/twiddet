import express from 'express';
import next from 'next';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import * as env from 'dotenv';

import twitter from './routes/twitter';

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

async function startServer() {
  try {
    env.config();
    await app.prepare();

    const server = express();

    // enhance your app security with Helmet
    server.use(helmet());
    // use bodyParser to parse application/json content-type
    server.use(bodyParser.json());
    // enable all CORS requests
    server.use(cors());

    server.use('/api', twitter);
    server.get('*', (req, res) => handle(req, res));

    server.listen(PORT, (err: Error) => {
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
