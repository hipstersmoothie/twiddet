import * as React from 'react';
import makeClass from 'classnames';
import { format } from 'timeago.js';
import { Tweet } from 'types/twitter';

interface TimeSinceProps {
  tweet: Tweet;
  isRoot?: boolean;
}

const TimeSince: React.FC<TimeSinceProps> = ({ tweet, isRoot }) => (
  <span className={makeClass('time-since-posted', { isRoot })}>
    {format(tweet.created_at, 'en_US')}

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
  </span>
);

export default TimeSince;
