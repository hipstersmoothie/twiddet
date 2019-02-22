import * as React from 'react';
import { Tweet } from 'types/twitter';

interface LinkCardProps {
  tweet: Tweet;
}

const NoLinkImage = () => (
  <div className="no-image">
    <svg style={{ width: 35 }} viewBox="0 0 24 24">
      <g>
        <path d="M14 11.25H6a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5zm0-4H6a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5zm-3.25 8H6a.75.75 0 0 0 0 1.5h4.75a.75.75 0 0 0 0-1.5z" />
        <path d="M21.5 11.25h-3.25v-7C18.25 3.01 17.24 2 16 2H4C2.76 2 1.75 3.01 1.75 4.25v15.5C1.75 20.99 2.76 22 4 22h15.5a2.752 2.752 0 0 0 2.75-2.75V12a.75.75 0 0 0-.75-.75zm-18.25 8.5V4.25c0-.413.337-.75.75-.75h12c.413 0 .75.337.75.75v15c0 .452.12.873.315 1.25H4a.752.752 0 0 1-.75-.75zm16.25.75c-.69 0-1.25-.56-1.25-1.25v-6.5h2.5v6.5c0 .69-.56 1.25-1.25 1.25z" />
      </g>
    </svg>
    <style jsx>{`
      .no-image {
        min-width: 150px;
        min-height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `}</style>
  </div>
);

const LinkCard: React.FC<LinkCardProps> = ({ tweet }) => {
  if (!tweet.card) {
    return null;
  }

  return (
    <a
      href={tweet.card.binding_values.card_url.string_value}
      className="link-card"
    >
      {tweet.card.binding_values.thumbnail_image ? (
        <img
          className="image"
          src={tweet.card.binding_values.thumbnail_image.image_value.url}
          height={tweet.card.binding_values.thumbnail_image.image_value.height}
          width={tweet.card.binding_values.thumbnail_image.image_value.width}
        />
      ) : (
        <div className="image">
          <NoLinkImage />
        </div>
      )}
      <div className="content">
        <p className="title">{tweet.card.binding_values.title.string_value}</p>
        <p className="description">
          {tweet.card.binding_values.description.string_value}
        </p>
        <p className="link">
          {tweet.card.binding_values.vanity_url.string_value}
        </p>
      </div>

      <style jsx>{`
        .title,
        .link,
        .description {
          font-size: 15px;
        }

        .link-card {
          display: flex;
          border-radius: 14px;
          border: 1px solid rgb(204, 214, 221);
          margin-top: 10px;
          text-decoration: none;
        }

        .title {
          font-weight: 400;
          color: rgb(20, 23, 26);
        }

        .link,
        .description {
          font-weight: 400;
          line-height: 1.4;
          color: rgb(101, 119, 134);
        }

        .image {
          border-right: 1px solid rgb(204, 214, 221);
          max-width: 150px;
          max-height: 150px;
        }

        .content {
          padding: 10px;
        }

        .content :global(*) {
          text-decoration: none;
        }
      `}</style>
    </a>
  );
};

export default LinkCard;
