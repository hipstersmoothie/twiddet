import * as React from 'react';
import styled from 'styled-components';
import fetch from 'isomorphic-unfetch';
import TreeView from 'react-treeview';
import linkifyUrls from 'linkify-urls';
import { format } from 'timeago.js';

import { TweetTree, Tweet } from 'types/twitter';

const Main = styled.div`
  width: 50%;
  margin: 0 auto;
  text-align: center;
  min-width: 750px;
`;
const Content = styled.div`
  font-size: 20px;
  font-weight: 200;
  line-height: 30px;
`;
const InputLabel = styled.label`
  padding-bottom: 10px;
  display: block;
`;
const Input = styled.input`
  min-width: 400px;
`;
const ConversationTree = styled.div`
  text-align: left;
`;
const TreeNodeWrapper = styled.div`
  padding-bottom: 20px;
`;

async function fetchTweet(tweet: string): Promise<TweetTree> {
  const result = await fetch(`http://localhost:3000/api/tweet/${tweet}`);
  const body: TweetTree = await result.json();

  return body;
}

interface TreeNodeProps {
  node: TweetTree;
  isRoot?: boolean;
}

interface TweetProps {
  isRoot?: boolean;
  tweet: Tweet;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReplyCount = ({ count }) => {
  return (
    <span className="icon">
      <i className="far fa-comment" />
      <span className="count">{count}</span>
    </span>
  );
};

const RetweetCount = ({ count }) => {
  return (
    <span className="icon">
      <i className="fas fa-retweet" />
      <span className="count">{count}</span>
    </span>
  );
};

const FavoriteCount = ({ count }) => {
  return (
    <span className="icon">
      <i className="far fa-heart" />
      <span className="count">{count}</span>
    </span>
  );
};

const VerifiedCheckMark = () => (
  <svg viewBox="0 0 24 24" aria-label="Verified account" className="checkmark">
    <g>
      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25a3.606 3.606 0 0 0-1.336-.25c-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5a.749.749 0 0 1-1.041.208l-.115-.094-2.415-2.415a.749.749 0 1 1 1.06-1.06l1.77 1.767 3.825-5.74a.75.75 0 0 1 1.25.833z" />
    </g>
  </svg>
);

const NoLinkImage = () => (
  <svg style={{ width: 35 }} viewBox="0 0 24 24">
    <g>
      <path d="M14 11.25H6a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5zm0-4H6a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5zm-3.25 8H6a.75.75 0 0 0 0 1.5h4.75a.75.75 0 0 0 0-1.5z" />
      <path d="M21.5 11.25h-3.25v-7C18.25 3.01 17.24 2 16 2H4C2.76 2 1.75 3.01 1.75 4.25v15.5C1.75 20.99 2.76 22 4 22h15.5a2.752 2.752 0 0 0 2.75-2.75V12a.75.75 0 0 0-.75-.75zm-18.25 8.5V4.25c0-.413.337-.75.75-.75h12c.413 0 .75.337.75.75v15c0 .452.12.873.315 1.25H4a.752.752 0 0 1-.75-.75zm16.25.75c-.69 0-1.25-.56-1.25-1.25v-6.5h2.5v6.5c0 .69-.56 1.25-1.25 1.25z" />
    </g>
  </svg>
);

interface LinkCardProps {
  tweet: Tweet;
}

const LinkCard: React.FC<LinkCardProps> = ({ tweet }) => {
  if (!tweet.card) {
    return null;
  }

  return (
    <a
      href={tweet.card.binding_values.card_url.string_value}
      className="link-card-wrapper"
    >
      {tweet.card.binding_values.thumbnail_image ? (
        <img
          className="link-card-image"
          src={tweet.card.binding_values.thumbnail_image.image_value.url}
          height={tweet.card.binding_values.thumbnail_image.image_value.height}
          width={tweet.card.binding_values.thumbnail_image.image_value.width}
        />
      ) : (
        <div className="link-card-image">
          <NoLinkImage />
        </div>
      )}
      <div className="link-card-content">
        <p className="link-card-title">
          {tweet.card.binding_values.title.string_value}
        </p>
        <p className="link-card-description">
          {tweet.card.binding_values.description.string_value}
        </p>
        <p className="link-card-link">
          {tweet.card.binding_values.vanity_url.string_value}
        </p>
      </div>
    </a>
  );
};

const TweetComponent: React.FC<TweetProps> = ({
  isRoot,
  tweet,
  collapsed,
  setCollapsed
}) => {
  const Wrapper = isRoot
    ? React.Fragment
    : ({ children }) => <div className="content">{children}</div>;
  const media: React.ReactNode[] = [];
  const timeSince = (
    <span className="time-since-posted">
      {format(tweet.created_at, 'en_US')}
    </span>
  );
  let displayText = tweet.full_text;

  if (tweet.entities.media) {
    tweet.entities.media.map(entity => {
      if (entity.type === 'photo') {
        media.push(
          <img
            key={entity.id_str}
            src={entity.media_url}
            height={entity.sizes.small.h}
            width={entity.sizes.small.w}
          />
        );
      }
      displayText =
        displayText.substr(0, entity.indices[0]) +
        displayText.substr(entity.indices[1], displayText.length);
    });
  }

  return (
    <TreeNodeWrapper
      onClick={() => setCollapsed(!collapsed)}
      className={isRoot ? 'root-tweet' : 'sub-tweet'}
    >
      {!isRoot && (
        <img
          className="author-image"
          src={tweet.user.profile_image_url_https}
        />
      )}

      <Wrapper>
        <div className="author">
          {isRoot && (
            <img
              className="author-image"
              src={tweet.user.profile_image_url_https}
            />
          )}
          <div className="author-details">
            <span className="name">
              {tweet.user.name}
              {tweet.user.verified && <VerifiedCheckMark />}
            </span>{' '}
            <span className="screen-name">@{tweet.user.screen_name}</span>
            {!isRoot && (
              <React.Fragment>
                <span className="time-spacer">·</span>
                {timeSince}
              </React.Fragment>
            )}
          </div>
        </div>
        <p
          className="full-text"
          dangerouslySetInnerHTML={{
            __html: linkifyUrls(displayText, {
              type: 'string'
            })
          }}
        />
        <div className="attached-media">{media}</div>
        <LinkCard tweet={tweet} />
        {isRoot && timeSince}
        <p className="media-stats">
          <ReplyCount count={tweet.reply_count} />
          <RetweetCount count={tweet.retweet_count} />
          <FavoriteCount count={tweet.favorite_count} />
        </p>
      </Wrapper>
    </TreeNodeWrapper>
  );
};

const TreeNode: React.FC<TreeNodeProps> = ({ node, isRoot }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const toggleCollapsed = () => setCollapsed(!collapsed);

  return (
    <div className="tree-node">
      <TreeView
        onClick={toggleCollapsed}
        treeViewClassName={isRoot ? 'no-border' : ''}
        nodeLabel={
          <TweetComponent
            isRoot={isRoot}
            tweet={node.module}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        }
        collapsed={collapsed}
        style={node.children.length > 0 ? {} : { opacity: 0 }}
      >
        {node.children.map(child => (
          <TreeNode key={child.module.id_str} node={child} />
        ))}
      </TreeView>
      <div
        className={`connector ${collapsed &&
          node.children.length > 0 &&
          'collapsed'}`}
        onClick={toggleCollapsed}
      />
    </div>
  );
};

interface ConversationComponentProps {
  tree?: TweetTree;
}

const ConversationComponent: React.FC<ConversationComponentProps> = ({
  tree
}) => {
  if (!tree) {
    return null;
  }

  console.log(tree);

  return (
    <ConversationTree>
      <TreeNode node={tree} isRoot />
    </ConversationTree>
  );
};

const Index = () => {
  const [userInput, setUserInput] = React.useState('');
  const [tweet, setTweet] = React.useState('');
  const [tree, setTree] = React.useState<TweetTree | undefined>(undefined);

  React.useEffect(() => {
    if (!tweet) {
      return;
    }

    fetchTweet(tweet).then(body => setTree(body));
  }, [tweet]);

  return (
    <div>
      <Main>
        <Content>
          <InputLabel>Please enter a tweet id or a URL to a tweet</InputLabel>
          <Input
            value={userInput}
            onChange={e => {
              let id = e.currentTarget.value;
              const match = id.match(
                /https:\/\/twitter\.com\/\S+\/status\/(\d+)/
              );

              setUserInput(id);

              if (match) {
                id = match[1];
              }

              setTweet(id);
            }}
          />
          <ConversationComponent tree={tree} />
        </Content>
      </Main>
    </div>
  );
};

export default Index;
