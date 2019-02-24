"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const linkify_urls_1 = __importDefault(require("linkify-urls"));
const classnames_1 = __importDefault(require("classnames"));
const LinkCard_1 = __importDefault(require("./LinkCard"));
const Count_1 = __importDefault(require("./Count"));
const router_1 = __importDefault(require("next/router"));
const AttachedMedia_1 = __importDefault(require("./AttachedMedia"));
const Author_1 = __importStar(require("./Author"));
const TimeSince_1 = __importDefault(require("./TimeSince"));
const Stats = ({ tweet }) => (<p className="media-stats">
    <Count_1.default count={tweet.reply_count} icon="far fa-comment"/>
    <Count_1.default count={tweet.retweet_count} icon="fas fa-retweet"/>
    <Count_1.default count={tweet.favorite_count} icon="far fa-heart"/>

    <style jsx>{`
      .media-stats {
        border-bottom: 2px solid rgb(237, 239, 241);
        border-radius: 0px;
        display: flex;
        margin-top: 10px;
        padding-bottom: 10px;
      }
    `}</style>
  </p>);
const ShowMore = ({ tweet }) => (<div className="show-more">
    <button type="button" onClick={e => {
    router_1.default.push(`/?tweet=${tweet.id_str}`);
    e.stopPropagation();
}}>
      Show Conversation
    </button>

    <style jsx>{`
      .show-more {
        padding: 15px 0 5px;
        text-align: center;
        width: 100%;

        button {
          background: lightgrey;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          font-size: 16px;
          padding: 10px 20px;

          &:focus {
            box-shadow: 0 0 2px 2px rgb(29, 161, 242);
            outline: none;
          }
        }
      }
    `}</style>
  </div>);
const TweetComponent = ({ isRoot, tweet, isQuote, collapsed, setCollapsed }) => {
    const images = [];
    const urlsToRemove = [];
    if (tweet.entities && tweet.entities.media) {
        tweet.entities.media.forEach(entity => {
            if (entity.type === 'photo') {
                images.push({
                    src: entity.media_url,
                    height: entity.sizes.small.h / 2,
                    width: entity.sizes.small.w / 2
                });
                urlsToRemove.push(entity.indices);
            }
        });
    }
    if (tweet.entities && tweet.quoted_status_id_str) {
        tweet.entities.urls.forEach(url => {
            const id = url.expanded_url.match(/https:\/\/mobile\.twitter\.com\/\S+\/status\/(\d+)/);
            if (id && id[1] === tweet.quoted_status_id_str) {
                urlsToRemove.push(url.indices);
            }
        });
    }
    const displayText = urlsToRemove
        .sort((a, b) => (a[1] > b[1] ? 1 : -1))
        .reduceRight((text, indices) => text.slice(0, indices[0]), tweet.full_text);
    return (<div className={classnames_1.default('tweet', {
        'root-tweet': isRoot,
        'sub-tweet': !isRoot,
        'quote-tweet': isQuote
    })} onClick={e => {
        if (e.target instanceof Element &&
            e.target.className.includes('ril-')) {
            return;
        }
        setCollapsed(!collapsed);
    }}>
      {!isRoot && !isQuote && <Author_1.AuthorImage tweet={tweet}/>}

      <div className="content">
        <Author_1.default isRoot={isRoot} tweet={tweet}/>

        <p className="full-text" dangerouslySetInnerHTML={{
        __html: linkify_urls_1.default(displayText.slice(tweet.display_text_range[0]), {
            type: 'string'
        })
    }}/>

        <AttachedMedia_1.default images={images}/>
        <LinkCard_1.default tweet={tweet}/>

        {tweet.quote && (<TweetComponent isQuote tweet={tweet.quote} setCollapsed={setCollapsed}/>)}

        {isRoot && <TimeSince_1.default isRoot tweet={tweet}/>}
        <Stats tweet={tweet}/>

        {isQuote && <ShowMore tweet={tweet}/>}
      </div>

      <style jsx>{`
        .tweet {
          padding-bottom: 15px;
          width: 100%;
        }

        .quote-tweet {
          border: 1px solid rgb(204, 214, 221);
          border-radius: 14px;
          margin: 20px 0;
          padding: 15px;
          width: fit-content;
        }

        .sub-tweet {
          display: flex;
        }

        .content {
          width: calc(100% - 50px);
        }

        .full-text {
          font-size: 15px;
        }

        .root-tweet {
          .full-text {
            font-size: 23px;
            padding-bottom: 15px;
          }

          & > :global(*) {
            margin-left: 50px;
          }
        }
      `}</style>
    </div>);
};
exports.default = TweetComponent;
//# sourceMappingURL=TweetComponent.jsx.map