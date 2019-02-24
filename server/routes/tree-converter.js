"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deepmerge_1 = __importDefault(require("deepmerge"));
const array_1 = __importDefault(require("@flatten/array"));
const isTweet = (content) => {
    return Boolean(content.tweet);
};
const isOperation = (content) => {
    return Boolean(content.operation);
};
const isConversation = (content) => {
    return Boolean(content.conversationThread);
};
class TreeConverter {
    constructor(conversation, rootTweetId, getTweet) {
        this.conversation = conversation;
        this.rootTweetId = rootTweetId;
        this.getTweet = getTweet;
        this.tweetMap = new Map();
        this.processedReplies = new Set();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.tree = {};
    }
    async convert() {
        this.processedReplies.add(this.rootTweetId);
        await this.convertConversation(this.conversation, this.rootTweetId);
        return this.tree;
    }
    async convertConversation(conversation, tweetId) {
        // 1. follow all cursors
        const allConversations = await this.followCursors(conversation, tweetId);
        const fullConversation = deepmerge_1.default.all([
            conversation,
            ...allConversations
        ]);
        // Now we have all top level replies
        // 2. make tree
        fullConversation.timeline.instructions.forEach(instr => {
            instr.addEntries.entries.forEach(entry => {
                if (isOperation(entry.content)) {
                    return;
                }
                this.tree = this.insertTweetIntoTree(fullConversation, entry.content.item.content);
            });
        });
        // 3. GO DEEPER
        await this.processReplies(fullConversation);
    }
    makeTreeNode(conversation, tweet) {
        let quote;
        if (tweet.is_quote_status) {
            quote = conversation.globalObjects.tweets[tweet.quoted_status_id_str];
            if (quote) {
                quote.user = conversation.globalObjects.users[quote.user_id_str];
            }
        }
        const node = {
            module: {
                ...tweet,
                quote,
                user: conversation.globalObjects.users[tweet.user_id_str]
            },
            children: []
        };
        this.tweetMap.set(tweet.id_str, node);
        return node;
    }
    async processReplies(conversation) {
        await Object.values(conversation.globalObjects.tweets).reduce(async (lastRun, tweet) => {
            await lastRun;
            const node = this.tweetMap.get(tweet.id_str);
            if (tweet.reply_count > 0 &&
                !this.processedReplies.has(tweet.id_str) &&
                (!node || node.children.length < tweet.reply_count)) {
                const subTweet = await this.getTweet(tweet.id_str);
                this.processedReplies.add(tweet.id_str);
                if (this.tweetMap.get(tweet.in_reply_to_status_id_str)) {
                    console.log('GETTING', tweet);
                    await this.convertConversation(subTweet, tweet.id_str);
                }
            }
        }, Promise.resolve());
    }
    async followCursors(conversation, tweetId) {
        const instruction = conversation.timeline.instructions[0];
        const cursors = await Promise.all(instruction.addEntries.entries.map(async (entry) => {
            if (isOperation(entry.content)) {
                return this.getTweet(tweetId, entry.content.operation.cursor.value);
            }
        }));
        const moreConversation = cursors.filter((x) => Boolean(x));
        const sub = await Promise.all(moreConversation.map(subConv => this.followCursors(subConv, tweetId)));
        return [...moreConversation, ...array_1.default(sub)];
    }
    findParent(tree, tweet) {
        if (tree.module.id_str === tweet.in_reply_to_status_id_str) {
            return tree;
        }
        return tree.children
            .map((child) => this.findParent(child, tweet))
            .filter(Boolean)[0];
    }
    insertTweetIntoTree(conversation, content) {
        if (isTweet(content)) {
            const tweet = conversation.globalObjects.tweets[content.tweet.id];
            if (this.tweetMap.get(tweet.id_str)) {
                console.log('TWEET ALREADY ADDED');
                return this.tree;
            }
            if (this.tree.module) {
                const parent = this.findParent(this.tree, tweet);
                if (parent) {
                    console.log('ADDED TWEET TO PARENT');
                    parent.children.push(this.makeTreeNode(conversation, tweet));
                }
                else {
                    console.log('COULD NOT FIND PARENT');
                }
            }
            else {
                console.log('MODE ROOT NODE');
                this.tree = this.makeTreeNode(conversation, tweet);
            }
        }
        else if (isConversation(content)) {
            let parent;
            content.conversationThread.conversationComponents.forEach(tweetTimeline => {
                const tweet = conversation.globalObjects.tweets[tweetTimeline.conversationTweetComponent.tweet.id];
                if (!tweet) {
                    console.log('TWEET NOT FOUND IN CONVERSATION');
                    return;
                }
                if (this.tweetMap.get(tweet.id_str)) {
                    console.log('TWEET ALREADY ADDED');
                    return;
                }
                if (!parent) {
                    parent = this.findParent(this.tree, tweet);
                }
                const newNode = this.makeTreeNode(conversation, tweet);
                if (parent) {
                    console.log('ADDED CONVERSATION TWEET TO PARENT');
                    parent.children.push(newNode);
                    parent = newNode;
                }
                else {
                    // this might not be right
                    console.log('ADDED CONVERSATION TWEET TO ROOT (THIS IS PROBS WRONG)');
                    this.tree.children.push(newNode);
                    parent = newNode;
                }
            });
        }
        return this.tree;
    }
}
exports.default = TreeConverter;
//# sourceMappingURL=tree-converter.js.map