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
  const images =
    (tweet.extended_entities && tweet.extended_entities.media) ||
    tweet.entities.media ||
    [];

  if (images.length === 0) {
    return null;
  }

  const renderedImages = new Set<string>();

  const media = images
    .map((image, index) => {
      if (image.media_url.includes('video_thumb')) {
        let videoUrl = image.media_url;

        if (image.video_info) {
          const variant = image.video_info.variants.find(
            variant => variant.content_type === 'video/mp4'
          );

          if (variant) {
            videoUrl = variant.url;
          }
        }

        if (renderedImages.has(image.media_url)) {
          return null;
        }

        renderedImages.add(image.media_url);

        return (
          <video
            key={`${image.media_url}-${tweet.id_str}`}
            autoPlay
            playsInline
            loop
            preload="auto"
            src={videoUrl}
            height={image.sizes.small.h / 2}
            width={image.sizes.small.w / 2}
            onClick={e => {
              setLightboxOpen(true);
              setPhoto(index);
              e.stopPropagation();
            }}
          />
        );
      }

      if (renderedImages.has(image.media_url)) {
        return null;
      }

      renderedImages.add(image.media_url);

      return (
        <img
          key={`${image.media_url}-${tweet.id_str}`}
          alt={image.ext_alt_text}
          src={image.media_url}
          height={image.sizes.small.h / 2}
          width={image.sizes.small.w / 2}
          onClick={e => {
            setLightboxOpen(true);
            setPhoto(index);
            e.stopPropagation();
          }}
        />
      );
    })
    .filter(Boolean);

  return (
    <div
      className={makeClass('attached-media', {
        multiple: media.length > 1
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
