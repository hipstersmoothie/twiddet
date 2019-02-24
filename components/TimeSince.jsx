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
const timeago_js_1 = require("timeago.js");
const TimeSince = ({ tweet, isRoot }) => (<span className={classnames_1.default('time-since-posted', { isRoot })}>
    {timeago_js_1.format(tweet.created_at, 'en_US')}

    <style jsx>{`
      .time-since-posted {
        color: rgb(136, 153, 166);
        font-size: 15px;
      }

      .root {
        display: block;
        padding-top: 10px;
      }
    `}</style>
  </span>);
exports.default = TimeSince;
//# sourceMappingURL=TimeSince.jsx.map