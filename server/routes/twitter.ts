import * as express from 'express';

const router = express.Router();

router.get('/tweet', (req, res) => {
  res.end("We made it! And it's great");
});

export default router;
