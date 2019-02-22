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

interface ControlledLightboxProps {
  open: boolean;
  images: string[];
  closeLightbox(): void;
  photo: number;
  setPhoto: React.Dispatch<React.SetStateAction<number>>;
}

const ControlledLightbox: React.FC<ControlledLightboxProps> = ({
  open,
  images,
  closeLightbox,
  photo,
  setPhoto
}) => {
  if (!open) {
    return null;
  }

  return (
    <Lightbox
      mainSrc={images[photo]}
      nextSrc={images[(photo + 1) % images.length]}
      prevSrc={images[(photo + images.length - 1) % images.length]}
      onCloseRequest={closeLightbox}
      onMovePrevRequest={() =>
        setPhoto((photo + images.length - 1) % images.length)
      }
      onMoveNextRequest={() => setPhoto((photo + 1) % images.length)}
    />
  );
};

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
  let displayText = tweet.full_text;
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [photo, setPhoto] = React.useState(0);
  const media: React.ReactNode[] = [];
  const images: string[] = [];
  const Wrapper = isRoot
    ? React.Fragment
    : ({ children }: { children: React.ReactNode }) => (
        <div className="content">{children}</div>
      );

  if (tweet.entities && tweet.entities.media) {
    tweet.entities.media.map((entity, index) => {
      if (entity.type === 'photo') {
        images.push(entity.media_url);

        media.push(
          <img
            onClick={e => {
              setLightboxOpen(true);
              setPhoto(index);
              e.stopPropagation();
            }}
            key={entity.id_str}
            src={entity.media_url}
            height={entity.sizes.small.h / 2}
            width={entity.sizes.small.w / 2}
          />
        );

        displayText =
          displayText.substr(0, entity.indices[0]) +
          displayText.substr(entity.indices[1], displayText.length);
      }
    });
  }

  console.log(lightboxOpen);

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
      {!isRoot && !isQuote && (
        <a href={`https://twitter.com/${tweet.user.screen_name}`}>
          <img
            className="author-image"
            src={tweet.user.profile_image_url_https}
          />
        </a>
      )}

      <Wrapper>
        <div className="author">
          {isRoot && (
            <a href={`https://twitter.com/${tweet.user.screen_name}`}>
              <img
                className="author-image"
                src={tweet.user.profile_image_url_https}
              />
            </a>
          )}
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
                {
                  <span className="time-since-posted">
                    {format(tweet.created_at, 'en_US')}
                  </span>
                }
              </React.Fragment>
            )}
          </a>
        </div>
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
        <div
          className={makeClass('attached-media', {
            multiple: images.length > 1
          })}
        >
          {media}
          <ControlledLightbox
            photo={photo}
            setPhoto={setPhoto}
            images={images}
            open={lightboxOpen}
            closeLightbox={() => setLightboxOpen(false)}
          />
        </div>
        <LinkCard tweet={tweet} />
        {tweet.quote && (
          <TweetComponent
            isQuote
            tweet={tweet.quote}
            setCollapsed={setCollapsed}
          />
        )}
        {isRoot && (
          <span className="time-since-posted">
            {format(tweet.created_at, 'en_US')}
          </span>
        )}
        <p className="media-stats">
          <Count count={tweet.reply_count} icon="far fa-comment" />
          <Count count={tweet.retweet_count} icon="fas fa-retweet" />
          <Count count={tweet.favorite_count} icon="far fa-heart" />
        </p>
      </Wrapper>

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

        :global(.content) {
          width: 100%;
        }

        .media-stats {
          display: flex;
          margin-top: 10px;
          border-bottom: 2px solid rgb(237, 239, 241);
          border-radius: 0px;
          padding-bottom: 10px;
        }

        .name {
          display: inline-flex;
          align-items: center;
        }

        .name,
        .screen-name,
        .full-text,
        .time-since-posted {
          font-size: 15px;
        }

        .time-spacer {
          padding: 0 5px;
        }

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

        .author-details {
          text-decoration: none;
          color: inherit;
        }

        .time-since-posted,
        .screen-name {
          color: rgb(136, 153, 166);
        }

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

        .root-tweet {
          .full-text {
            font-size: 23px;
            padding-bottom: 15px;
          }

          .time-since-posted {
            padding-top: 10px;
            display: block;
          }

          > :global(*):not(.author):not(.author-details) {
            margin-left: 50px;
          }

          .author {
            display: flex;
            padding-bottom: 15px;
          }

          .screen-name {
            color: rgb(136, 153, 166);
            line-height: 12px;
          }

          .author-details {
            display: flex;
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default TweetComponent;
