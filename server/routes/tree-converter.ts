import {
  Tweet,
  Conversation,
  ConversationContent,
  TweetReference,
  DataEntry,
  Operation,
  ConversationThread,
  TweetTree
} from 'types/twitter';
import merge from 'deepmerge';
import flatten from '@flatten/array';

const isTweet = (content: ConversationContent): content is TweetReference => {
  return content.hasOwnProperty('tweet');
};

const isOperation = (content: DataEntry | Operation): content is Operation => {
  return content.hasOwnProperty('operation');
};

const isConversation = (
  content: ConversationContent
): content is ConversationThread => {
  return content.hasOwnProperty('conversationThread');
};

type FetchTweet = (id: string, cursor?: string) => Promise<Conversation>;

export default class TreeConverter {
  private conversation: Conversation;
  private rootTweetId: string;
  private getTweet: FetchTweet;
  private tweetMap: Map<string, TweetTree>;
  private tree: TweetTree;
  private processedReplies: Set<string>;

  constructor(
    conversation: Conversation,
    rootTweetId: string,
    getTweet: FetchTweet
  ) {
    this.conversation = conversation;
    this.rootTweetId = rootTweetId;
    this.getTweet = getTweet;
    this.tweetMap = new Map<string, TweetTree>();
    this.processedReplies = new Set<string>();
    this.tree = {} as TweetTree;
  }

  public async convert() {
    this.processedReplies.add(this.rootTweetId);
    await this.convertConversation(this.conversation, this.rootTweetId);
    return this.tree;
  }

  private async convertConversation(
    conversation: Conversation,
    tweetId: string
  ) {
    // 1. follow all cursors
    const allConversations = await this.followCursors(conversation, tweetId);

    const fullConversation = merge.all([
      conversation,
      ...allConversations
    ]) as Conversation;

    // Now we have all top level replies

    // 2. make tree
    fullConversation.timeline.instructions.map(instr => {
      instr.addEntries.entries.map(entry => {
        if (isOperation(entry.content)) {
          return;
        }

        this.tree = this.insertTweetIntoTree(
          fullConversation,
          entry.content.item.content
        );
      });
    });

    // 3. GO DEEPER
    await this.processReplies(fullConversation);
  }

  private makeTreeNode(conversation: Conversation, tweet: Tweet): TweetTree {
    const node = {
      module: {
        ...tweet,
        user: conversation.globalObjects.users[tweet.user_id_str]
      },
      children: []
    };

    this.tweetMap.set(tweet.id_str, node);

    return node;
  }

  private async processReplies(conversation: Conversation) {
    await Object.values(conversation.globalObjects.tweets).reduce(
      async (lastRun, tweet) => {
        await lastRun;
        const node = this.tweetMap.get(tweet.id_str);

        if (
          tweet.reply_count > 0 &&
          !this.processedReplies.has(tweet.id_str) &&
          (!node || node.children.length < tweet.reply_count)
        ) {
          const subTweet = await this.getTweet(tweet.id_str);
          this.processedReplies.add(tweet.id_str);

          // TODO: figure out quoted tweets
          if (this.tweetMap.get(tweet.in_reply_to_status_id_str)) {
            console.log('GETTING', tweet);
            await this.convertConversation(subTweet, tweet.id_str);
          }
        }
      },
      Promise.resolve()
    );
  }

  private async followCursors(
    conversation: Conversation,
    tweetId: string
  ): Promise<Conversation[]> {
    let instruction = conversation.timeline.instructions[0];

    const cursors = await Promise.all(
      instruction.addEntries.entries.map(async entry => {
        if (isOperation(entry.content)) {
          return this.getTweet(tweetId, entry.content.operation.cursor.value);
        }
      })
    );

    const moreConversation = cursors.filter(
      (x: Conversation | undefined): x is Conversation => !!x
    );

    const sub = await Promise.all(
      moreConversation.map(subConv => this.followCursors(subConv, tweetId))
    );

    return [...moreConversation, ...flatten(sub)];
  }

  private findParent(tree: TweetTree, tweet: Tweet): TweetTree {
    if (tree.module.id_str === tweet.in_reply_to_status_id_str) {
      return tree;
    }

    return tree.children
      .map((child: TweetTree) => this.findParent(child, tweet))
      .filter(Boolean)[0];
  }

  private insertTweetIntoTree(
    conversation: Conversation,
    content: ConversationContent
  ) {
    if (isTweet(content)) {
      const tweet = conversation.globalObjects.tweets[content.tweet.id];

      if (this.tweetMap.get(tweet.id_str)) {
        console.log('TWEET ALREADY ADDED');
        return this.tree;
      }

      if (!this.tree.module) {
        console.log('MODE ROOT NODE');
        this.tree = this.makeTreeNode(conversation, tweet);
      } else {
        const parent = this.findParent(this.tree, tweet);

        if (parent) {
          console.log('ADDED TWEET TO PARENT');
          parent.children.push(this.makeTreeNode(conversation, tweet));
        } else {
          console.log('COULD NOT FIND PARENT');
        }
      }
    } else if (isConversation(content)) {
      let parent: TweetTree;

      content.conversationThread.conversationComponents.map(tweetTimeline => {
        const tweet =
          conversation.globalObjects.tweets[
            tweetTimeline.conversationTweetComponent.tweet.id
          ];

        if (!tweet) {
          console.log('TWEET NOT FOUND IN CONVERSATION');
          return;
        }

        if (!this.tweetMap.get(tweet.id_str)) {
          if (!parent) {
            parent = this.findParent(this.tree, tweet);
          }

          const newNode = this.makeTreeNode(conversation, tweet);

          if (parent) {
            console.log('ADDED CONVERSATION TWEET TO PARENT');
            parent.children.push(newNode);
            parent = newNode;
          } else {
            // this might not be right
            console.log(
              'ADDED CONVERSATION TWEET TO ROOT (THIS IS PROBS WRONG)'
            );
            this.tree.children.push(newNode);
            parent = newNode;
          }
        } else {
          console.log('TWEET ALREADY ADDED');
        }
      });
    }

    return this.tree;
  }
}
