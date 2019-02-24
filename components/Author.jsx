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
const classnames_1 = __importDefault(require("classnames"));
const TimeSince_1 = __importDefault(require("./TimeSince"));
const VerifiedCheckMark = () => (<svg viewBox="0 0 24 24" aria-label="Verified account" className="checkmark">
    <g>
      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25a3.606 3.606 0 0 0-1.336-.25c-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5a.749.749 0 0 1-1.041.208l-.115-.094-2.415-2.415a.749.749 0 1 1 1.06-1.06l1.77 1.767 3.825-5.74a.75.75 0 0 1 1.25.833z"/>
    </g>

    <style jsx>{`
      .checkmark {
        fill: rgba(29, 161, 242, 1);
        height: 25px;
        padding: 0 5px;
        width: 25px;
      }
    `}</style>
  </svg>);
exports.AuthorImage = ({ tweet }) => (<a href={`https://twitter.com/${tweet.user.screen_name}`}>
    <img className="author-image" src={tweet.user.profile_image_url_https}/>

    <style jsx>{`
      .author-image {
        border-radius: 50%;
        height: 50px;
        margin-right: 10px;
        margin-top: 8px;
        min-height: 50px;
        min-width: 50px;
        padding-right: 3px;
        width: 50px;
      }
    `}</style>
  </a>);
const Author = ({ isRoot, tweet }) => (<div className={classnames_1.default('author', { isRoot })}>
    {isRoot && <exports.AuthorImage tweet={tweet}/>}

    <a className="author-details" href={`https://twitter.com/${tweet.user.screen_name}`}>
      <span className="name">
        {tweet.user.name}
        {tweet.user.verified && <VerifiedCheckMark />}
      </span>{' '}
      <span className="screen-name">@{tweet.user.screen_name}</span>
      {!isRoot && (<>
          <span className="time-spacer">·</span>
          <TimeSince_1.default tweet={tweet}/>
        </>)}
    </a>

    <style jsx>{`
      .name,
      .screen-name {
        font-size: 15px;
      }

      .time-spacer {
        padding: 0 5px;
      }

      .author-details {
        color: inherit;
        text-decoration: none;
      }

      .screen-name {
        color: rgb(136, 153, 166);
      }

      .name {
        align-items: center;
        display: inline-flex;
      }

      .isRoot {
        &.author {
          align-items: center;
          display: flex;
          margin-left: -50px;
          padding-bottom: 15px;
        }

        .screen-name {
          color: rgb(136, 153, 166);
          line-height: 20px;
        }

        .author-details {
          display: inline-flex;
          flex-direction: column;
        }
      }
    `}</style>
  </div>);
exports.default = Author;
//# sourceMappingURL=Author.jsx.map