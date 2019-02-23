import * as React from 'react';
import linkifyUrls from 'linkify-urls';
import makeClass from 'classnames';

import { Tweet } from 'types/twitter';
import LinkCard from './LinkCard';
import Count from './Count';
import Router from 'next/router';
import AttachedMedia, { Image } from './AttachedMedia';
import Author, { AuthorImage } from './Author';
import TimeSince from './TimeSince';

interface StatsProps {
  tweet: Tweet;
}

const Stats: React.FC<StatsProps> = ({ tweet }) => (
  <p className="media-stats">
    <Count count={tweet.reply_count} icon="far fa-comment" />
    <Count count={tweet.retweet_count} icon="fas fa-retweet" />
    <Count count={tweet.favorite_count} icon="far fa-heart" />

    <style jsx>{`
      .media-stats {
        border-bottom: 2px solid rgb(237, 239, 241);
        border-radius: 0px;
        display: flex;
        margin-top: 10px;
        padding-bottom: 10px;
      }
    `}</style>
  </p>
);

interface ShowMoreProps {
  tweet: Tweet;
}

const ShowMore: React.FC<ShowMoreProps> = ({ tweet }) => (
  <div className="show-more">
    <button
      type="button"
      onClick={e => {
        Router.push(`/?tweet=${tweet.id_str}`);
        e.stopPropagation();
      }}
    >
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
  </div>
);

interface TweetProps {
  isRoot?: boolean;
  tweet: Tweet;
  collapsed?: boolean;
  isQuote?: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const TweetComponent: React.FC<TweetProps> = ({
  isRoot,
  tweet,
  isQuote,
  collapsed,
  setCollapsed
}) => {
  const images: Image[] = [];
  const urlsToRemove: [number, number][] = [];

  if (tweet.entities && tweet.entities.media) {
    tweet.entities.media.forEach(entity => {
      if (entity.type === 'photo') {
        images.push({
          src: entity.media_url,
          height: entity.sizes.small.h / 2,
          width: entity.sizes.small.w / 2
        });

        urlsToRemove.push(entity.indices as [number, number]);
      }
    });
  }

  if (tweet.entities && tweet.quoted_status_id_str) {
    tweet.entities.urls.forEach(url => {
      const id = url.expanded_url.match(
        /https:\/\/mobile\.twitter\.com\/\S+\/status\/(\d+)/
      );

      if (id && id[1] === tweet.quoted_status_id_str) {
        urlsToRemove.push(url.indices as [number, number]);
      }
    });
  }

  const displayText = urlsToRemove
    .sort((a, b) => (a[1] > b[1] ? 1 : -1))
    .reduceRight((text, indices) => text.slice(0, indices[0]), tweet.full_text);

  return (
    <div
      className={makeClass('tweet', {
        'root-tweet': isRoot,
        'sub-tweet': !isRoot,
        'quote-tweet': isQuote
      })}
      onClick={e => {
        if (
          e.target instanceof Element &&
          e.target.className.includes('ril-')
        ) {
          return;
        }

        setCollapsed(!collapsed);
      }}
    >
      {!isRoot && !isQuote && <AuthorImage tweet={tweet} />}

      <div className="content">
        <Author isRoot={isRoot} tweet={tweet} />

        <p
          className="full-text"
          dangerouslySetInnerHTML={{
            __html: linkifyUrls(
              displayText.slice(tweet.display_text_range[0]),
              {
                type: 'string'
              }
            )
          }}
        />

        <AttachedMedia images={images} />
        <LinkCard tweet={tweet} />

        {tweet.quote && (
          <TweetComponent
            isQuote
            tweet={tweet.quote}
            setCollapsed={setCollapsed}
          />
        )}

        {isRoot && <TimeSince isRoot tweet={tweet} />}
        <Stats tweet={tweet} />

        {isQuote && <ShowMore tweet={tweet} />}
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
    </div>
  );
};

export default TweetComponent;
