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
const react_image_lightbox_1 = __importDefault(require("react-image-lightbox"));
const AttachedMedia = ({ images }) => {
    const [lightboxOpen, setLightboxOpen] = React.useState(false);
    const [photo, setPhoto] = React.useState(0);
    const media = images.map((image, index) => (<img key={image.src} src={image.src} height={image.height / 2} width={image.width / 2} onClick={e => {
        setLightboxOpen(true);
        setPhoto(index);
        e.stopPropagation();
    }}/>));
    return (<div className={classnames_1.default('attached-media', {
        multiple: images.length > 1
    })}>
      {media}

      {lightboxOpen && (<react_image_lightbox_1.default mainSrc={images[photo].src} nextSrc={images[(photo + 1) % images.length].src} prevSrc={images[(photo + images.length - 1) % images.length].src} onCloseRequest={() => setLightboxOpen(false)} onMovePrevRequest={() => setPhoto((photo + images.length - 1) % images.length)} onMoveNextRequest={() => setPhoto((photo + 1) % images.length)}/>)}

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
    </div>);
};
exports.default = AttachedMedia;
//# sourceMappingURL=AttachedMedia.jsx.map