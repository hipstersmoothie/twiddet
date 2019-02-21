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
            <span className="name">{tweet.user.name}</span>{' '}
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
        <div className="attached-media">
          {media}
          {isRoot && timeSince}
        </div>
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
