import express from 'express';
import fetch from 'isomorphic-unfetch';

const router = express.Router();

function setUpTwitter() {
  const headers = {
    authorization:
      'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
    'x-guest-token': '1098270637628375040'
  };

  return {
    get: async (url: string) => {
      return fetch(url, {
        headers
      });
    }
  };
}

router.get('/tweet/:tweet', async (req, res) => {
  try {
    const twitter = setUpTwitter();
    const response = await twitter.get(
      `https://api.twitter.com/2/timeline/conversation/${
        req.params.tweet
      }.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_composer_source=true&include_ext_alt_text=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&count=20&ext=mediaStats%2ChighlightedLabel%2CcameraMoment`
    );
    const json = await response.json();

    res.end(JSON.stringify(json, null, 2));
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
  }
});

export default router;
