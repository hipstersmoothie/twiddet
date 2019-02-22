import * as React from 'react';
import fetch from 'isomorphic-unfetch';

import { TweetTree } from 'types/twitter';
import TreeNode from '../components/TreeNode';

async function fetchTweet(tweet: string): Promise<TweetTree> {
  const result = await fetch(`http://localhost:3000/api/tweet/${tweet}`);
  const body: TweetTree = await result.json();

  return body;
}

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
      <main>
        <label>Please enter a tweet id or a URL to a tweet</label>
        <input
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
        {tree && (
          <section>
            <TreeNode node={tree} isRoot />
          </section>
        )}
      </main>

      <style jsx>{`
        main {
          width: 50%;
          margin: 0 auto;
          text-align: center;
          min-width: 750px;
          font-size: 20px;
          font-weight: 200;
          line-height: 30px;
        }

        label {
          padding-bottom: 10px;
          display: block;
        }

        input {
          min-width: 400px;
        }

        section {
          text-align: left;
        }
      `}</style>
    </div>
  );
};

export default Index;
