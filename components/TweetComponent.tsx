import * as React from 'react';
import linkifyUrls from 'linkify-urls';
import makeClass from 'classnames';
import { format } from 'timeago.js';
import Lightbox from 'react-image-lightbox';

import { Tweet } from 'types/twitter';
import LinkCard from './LinkCard';
import Count from './Count';

const VerifiedCheckMark = () => (
  <svg viewBox="0 0 24 24" aria-label="Verified account" className="checkmark">
    <g>
      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25a3.606 3.606 0 0 0-1.336-.25c-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5a.749.749 0 0 1-1.041.208l-.115-.094-2.415-2.415a.749.749 0 1 1 1.06-1.06l1.77 1.767 3.825-5.74a.75.75 0 0 1 1.25.833z" />
    </g>

    <style jsx>{`
      .checkmark {
        fill: rgba(29, 161, 242, 1);
        width: 25px;
        height: 25px;
        padding: 0 5px;
      }
    `}</style>
  </svg>
);

interface AuthorImageProps {
  tweet: Tweet;
}

const AuthorImage: React.FC<AuthorImageProps> = ({ tweet }) => (
  <a href={`https://twitter.com/${tweet.user.screen_name}`}>
    <img className="author-image" src={tweet.user.profile_image_url_https} />

    <style jsx>{`
      .author-image {
        border-radius: 50%;
        min-width: 50px;
        width: 50px;
        min-height: 50px;
        height: 50px;
        margin-right: 10px;
        margin-top: 8px;
        padding-right: 3px;
      }
    `}</style>
  </a>
);

interface TimeSinceProps {
  tweet: Tweet;
  isRoot?: boolean;
}

const TimeSince: React.FC<TimeSinceProps> = ({ tweet, isRoot }) => (
  <span className={makeClass('time-since-posted', { isRoot })}>
    {format(tweet.created_at, 'en_US')}

    <style jsx>{`
      .time-since-posted {
        font-size: 15px;
        color: rgb(136, 153, 166);
      }

      .root {
        padding-top: 10px;
        display: block;
      }
    `}</style>
  </span>
);

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
        display: flex;
        margin-top: 10px;
        border-bottom: 2px solid rgb(237, 239, 241);
        border-radius: 0px;
        padding-bottom: 10px;
      }
    `}</style>
  </p>
);

interface Image {
  src: string;
  height: number;
  width: number;
}

interface AttachedMediaProps {
  images: Image[];
}

const AttachedMedia: React.FC<AttachedMediaProps> = ({ images }) => {
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [photo, setPhoto] = React.useState(0);

  const media = images.map((image, index) => (
    <img
      onClick={e => {
        setLightboxOpen(true);
        setPhoto(index);
        e.stopPropagation();
      }}
      key={image.src}
      src={image.src}
      height={image.height / 2}
      width={image.width / 2}
    />
  ));

  return (
    <div
      className={makeClass('attached-media', {
        multiple: images.length > 1
      })}
    >
      {media}

      {lightboxOpen && (
        <Lightbox
          mainSrc={images[photo].src}
          nextSrc={images[(photo + 1) % images.length].src}
          prevSrc={images[(photo + images.length - 1) % images.length].src}
          onCloseRequest={() => setLightboxOpen(false)}
          onMovePrevRequest={() =>
            setPhoto((photo + images.length - 1) % images.length)
          }
          onMoveNextRequest={() => setPhoto((photo + 1) % images.length)}
        />
      )}

      <style jsx>{`
        .attached-media {
          border-radius: 15px;
          overflow: hidden;
          width: fit-content;
          display: grid;

          &.multiple {
            width: 100%;
            grid-template-columns: repeat(auto-fill, minmax(25%, 1fr));
            grid-gap: 5px;
            margin: 20px 0;
          }

          :global(img) {
            height: auto;
            max-width: 100%;
            width: 100%;
            cursor: pointer;
          }
        }
      `}</style>
    </div>
  );
};

interface AuthorProps {
  tweet: Tweet;
  isRoot?: boolean;
}

const Author: React.FC<AuthorProps> = ({ isRoot, tweet }) => (
  <div className={makeClass('author', { isRoot })}>
    {isRoot && <AuthorImage tweet={tweet} />}

    <a
      className="author-details"
      href={`https://twitter.com/${tweet.user.screen_name}`}
    >
      <span className="name">
        {tweet.user.name}
        {tweet.user.verified && <VerifiedCheckMark />}
      </span>{' '}
      <span className="screen-name">@{tweet.user.screen_name}</span>
      {!isRoot && (
        <React.Fragment>
          <span className="time-spacer">·</span>
          <TimeSince tweet={tweet} />
        </React.Fragment>
      )}
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
        text-decoration: none;
        color: inherit;
      }

      .screen-name {
        color: rgb(136, 153, 166);
      }

      .name {
        display: inline-flex;
        align-items: center;
      }

      .isRoot {
        &.author {
          display: flex;
          align-items: center;
          padding-bottom: 15px;
          margin-left: -50px;
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
  let displayText = tweet.full_text;

  if (tweet.entities && tweet.entities.media) {
    tweet.entities.media.map(entity => {
      if (entity.type === 'photo') {
        images.push({
          src: entity.media_url,
          height: entity.sizes.small.h / 2,
          width: entity.sizes.small.w / 2
        });

        displayText =
          displayText.substr(0, entity.indices[0]) +
          displayText.substr(entity.indices[1], displayText.length);
      }
    });
  }

  return (
    <div
      onClick={e => {
        if (
          e.target instanceof Element &&
          e.target.className.includes('ril-')
        ) {
          return;
        }

        setCollapsed(!collapsed);
      }}
      className={makeClass('tweet', {
        'root-tweet': isRoot,
        'sub-tweet': !isRoot,
        'quote-tweet': isQuote
      })}
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

        {isRoot && <TimeSince tweet={tweet} isRoot />}
        <Stats tweet={tweet} />
      </div>

      <style jsx>{`
        .tweet {
          padding-bottom: 15px;
          width: 100%;
        }

        .quote-tweet {
          border-radius: 14px;
          border: 1px solid rgb(204, 214, 221);
          padding: 15px;
          width: fit-content;
          margin: 20px 0;
        }

        .sub-tweet {
          display: flex;
        }

        .content {
          width: 100%;
        }

        .full-text {
          font-size: 15px;
        }

        .root-tweet {
          .full-text {
            font-size: 23px;
            padding-bottom: 15px;
          }

          > :global(*) {
            margin-left: 50px;
          }
        }
      `}</style>
    </div>
  );
};

export default TweetComponent;
