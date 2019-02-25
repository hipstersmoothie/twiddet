import express from 'express';
import fetch from 'isomorphic-unfetch';
import TreeConverter from '../utils/tree-converter';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import * as env from 'dotenv';

env.config();

// eslint-disable-next-line new-cap
const app = express();

// enhance your app security with Helmet
app.use(helmet());
// use bodyParser to parse application/json content-type
app.use(bodyParser.json());
// enable all CORS requests
app.use(cors());

function setUpTwitter(token: string) {
  const headers = {
    authorization:
      'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
    'x-guest-token': token
  };
  const memo = new Map<string, object>();

  return {
    get: async (tweet: string, cursor?: string) => {
      const url = `https://api.twitter.com/2/timeline/conversation/${tweet}.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_composer_source=true&include_ext_alt_text=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&count=20&ext=mediaStats%2ChighlightedLabel%2CcameraMoment${
        cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''
      }`;

      if (memo.get(url)) {
        console.log('USED MEMO');
        return memo.get(url);
      }

      const response = await fetch(url, {
        headers
      });
      const json = await response.json();

      memo.set(url, json);

      return json;
    }
  };
}

async function getGuestToken() {
  if (process.env.NODE_ENV === 'production') {
    const tokenResponse = await fetch('http://76.167.236.46:3000/api/token');
    const token = await tokenResponse.text();

    return token;
  }

  const result = await fetch(
    'https://mobile.twitter.com/ericclemmons/status/1098673740156530688',
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.81 Safari/537.36'
      }
    }
  );
  const body = await result.text();
  const match = body.match(/gt=(\d+)/);

  if (!match) {
    throw new Error('No token found!');
  }

  return match[1];
}

app.get('*', async (req, res) => {
  if (!req.query.tweet) {
    res.send('No tweet id provided! Call this endpoint like: /?tweet=TWEET_ID');
    return;
  }

  try {
    const token = await getGuestToken();
    const twitter = setUpTwitter(token);
    const json = await twitter.get(req.query.tweet);
    const treeConverter = new TreeConverter(json, req.query.tweet, twitter.get);
    const tree = await treeConverter.convert();

    res.end(JSON.stringify(tree, null, 2));
  } catch (error) {
    console.log(error);
  }
});

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, (err: Error) => {
    if (err) {
      throw err;
    }

    console.log(`> Ready on ${PORT}`);
  });
}

export default app;
