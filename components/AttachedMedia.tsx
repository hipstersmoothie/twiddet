import * as React from 'react';
import makeClass from 'classnames';
import Lightbox from 'react-image-lightbox';
import { Tweet } from 'types/twitter';

interface AttachedMediaProps {
  tweet: Tweet;
}

const AttachedMedia: React.FC<AttachedMediaProps> = ({ tweet }) => {
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [photo, setPhoto] = React.useState(0);
  const images = tweet.entities.media || [];

  if (images.length === 0) {
    return null;
  }

  const media = images.map((image, index) =>
    image.media_url.includes('video_thumb') ? (
      // @ts-ignore
      <video
        key={image.media_url}
        autoPlay
        playsInline
        loop
        preload="auto"
        typeOf="video/mp4"
        src={image.media_url
          .replace(
            'http://pbs.twimg.com/tweet_video_thumb/',
            'https://video.twimg.com/tweet_video/'
          )
          .replace('.jpg', '.mp4')}
        height={image.sizes.small.h / 2}
        width={image.sizes.small.w / 2}
        onClick={e => {
          setLightboxOpen(true);
          setPhoto(index);
          e.stopPropagation();
        }}
      />
    ) : (
      <img
        key={image.media_url}
        src={image.media_url}
        height={image.sizes.small.h / 2}
        width={image.sizes.small.w / 2}
        onClick={e => {
          setLightboxOpen(true);
          setPhoto(index);
          e.stopPropagation();
        }}
      />
    )
  );

  return (
    <div
      className={makeClass('attached-media', {
        multiple: images.length > 1
      })}
    >
      {media}

      {lightboxOpen && (
        <Lightbox
          mainSrc={images[photo].media_url}
          nextSrc={images[(photo + 1) % images.length].media_url}
          prevSrc={
            images[(photo + images.length - 1) % images.length].media_url
          }
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
          display: grid;
          overflow: hidden;
          width: fit-content;

          &.multiple {
            grid-gap: 5px;
            grid-template-columns: repeat(auto-fill, minmax(25%, 1fr));
            margin: 20px 0;
            width: 100%;
          }

          :global(img) {
            cursor: pointer;
            height: auto;
            max-width: 100%;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AttachedMedia;
