"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isomorphic_unfetch_1 = __importDefault(require("isomorphic-unfetch"));
const tree_converter_1 = __importDefault(require("./tree-converter"));
// eslint-disable-next-line new-cap
const router = express_1.default.Router();
function setUpTwitter(token) {
    const headers = {
        authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
        'x-guest-token': token
    };
    const memo = new Map();
    return {
        get: async (tweet, cursor) => {
            const url = `https://api.twitter.com/2/timeline/conversation/${tweet}.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_composer_source=true&include_ext_alt_text=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&count=20&ext=mediaStats%2ChighlightedLabel%2CcameraMoment${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`;
            if (memo.get(url)) {
                console.log('USED MEMO');
                return memo.get(url);
            }
            const response = await isomorphic_unfetch_1.default(url, {
                headers
            });
            const json = await response.json();
            memo.set(url, json);
            return json;
        }
    };
}
async function getGuestToken() {
    const result = await isomorphic_unfetch_1.default('https://mobile.twitter.com/ericclemmons/status/1098673740156530688', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.81 Safari/537.36'
        }
    });
    const body = await result.text();
    const match = body.match(/gt=(\d+)/);
    console.log(body);
    if (!match) {
        throw new Error('No token found!');
    }
    return match[1];
}
router.get('/tweet/:tweet', async (req, res) => {
    try {
        const token = await getGuestToken();
        const twitter = setUpTwitter(token);
        const json = await twitter.get(req.params.tweet);
        const treeConverter = new tree_converter_1.default(json, req.params.tweet, twitter.get);
        const tree = await treeConverter.convert();
        res.end(JSON.stringify(tree, null, 2));
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = router;
//# sourceMappingURL=twitter.js.map