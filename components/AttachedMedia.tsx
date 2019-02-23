import * as React from 'react';
import makeClass from 'classnames';
import Lightbox from 'react-image-lightbox';

export interface Image {
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
      key={image.src}
      src={image.src}
      height={image.height / 2}
      width={image.width / 2}
      onClick={e => {
        setLightboxOpen(true);
        setPhoto(index);
        e.stopPropagation();
      }}
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
