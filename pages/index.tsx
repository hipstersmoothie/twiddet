import * as React from 'react';
import styled from 'styled-components';
import fetch from 'isomorphic-unfetch';
import Tree, { TreeNode } from 'react-ui-tree';

import {
  Conversation,
  ConversationContent,
  TweetReference,
  Tweet,
  ConversationThread
} from 'types/twitter';

const Main = styled.div`
  max-width: 750px;
  margin: 0 auto;
  text-align: center;
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

async function fetchTweet(tweet: string) {
  try {
    const result = await fetch(`http://localhost:3000/api/tweet/${tweet}`);
    const body: Conversation = await result.json();

    return body;
  } catch (error) {}
}

interface ConversationComponentProps {
  conversation: Conversation;
}

const isTweet = (content: ConversationContent): content is TweetReference => {
  return content.hasOwnProperty('tweet');
};

const isConversation = (
  content: ConversationContent
): content is ConversationThread => {
  return content.hasOwnProperty('conversationThread');
};

function insertTweetIntoTree(
  tree: TreeNode<Tweet>,
  conversation: Conversation,
  content: ConversationContent
) {
  if (isTweet(content)) {
    if (!tree.module) {
      tree.module = conversation.globalObjects.tweets[content.tweet.id];
      tree.children = [];
    }
  } else if (isConversation(content)) {
    let parent = tree;

    content.conversationThread.conversationComponents.map(tweet => {
      const newNode = {
        module:
          conversation.globalObjects.tweets[
            tweet.conversationTweetComponent.tweet.id
          ],
        children: []
      };
      parent.children.push(newNode);
      parent = newNode;
    });

    // tree.children = parent.children;
  }

  return tree;
}

function convertConversationToTree(
  conversation: Conversation
): TreeNode<Tweet> {
  return conversation.timeline.instructions.reduce(
    (all, instruction) => {
      instruction.addEntries.entries.map(entry => {
        if (entry.content.operation) {
          return;
        }

        insertTweetIntoTree(all, conversation, entry.content.item.content);
      });

      return all;
    },
    {} as TreeNode<Tweet>
  );
}

const ConversationComponent: React.FC<ConversationComponentProps> = ({
  conversation
}) => {
  const [active, setActive] = React.useState(null);
  console.log({ conversation });
  console.log(convertConversationToTree(conversation));
  return (
    <ConversationTree>
      <Tree
        tree={convertConversationToTree(conversation)}
        renderNode={(node: TreeNode<Tweet>) => {
          return (
            <TreeNodeWrapper className={`node active`}>
              {
                conversation.globalObjects.users[node.module.user_id_str]
                  .screen_name
              }
              : {node.module.full_text}
            </TreeNodeWrapper>
          );
        }}
      />
    </ConversationTree>
  );
};

const Index = () => {
  const [userInput, setUserInput] = React.useState('');
  const [tweet, setTweet] = React.useState('');
  const [conversation, setConversation] = React.useState<
    Conversation | undefined
  >(undefined);

  React.useEffect(() => {
    if (!tweet) {
      return;
    }

    fetchTweet(tweet).then(body => setConversation(body));
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
          {conversation && (
            <ConversationComponent conversation={conversation} />
          )}
        </Content>
      </Main>
    </div>
  );
};

export default Index;
