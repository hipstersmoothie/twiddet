import * as React from 'react';
import fetch from 'isomorphic-unfetch';
import { ClipLoader } from 'react-spinners';

import { TweetTree } from 'types/twitter';
import TreeNode from '../components/TreeNode';

async function fetchTweet(tweet: string): Promise<TweetTree> {
  const result = await fetch(`http://localhost:3000/api/tweet/${tweet}`);
  const body: TweetTree = await result.json();

  return body;
}

interface TweetLoaderProps {
  tweet: string;
}

const TweetLoader: React.FC<TweetLoaderProps> = ({ tweet }) => {
  const [tree, setTree] = React.useState<TweetTree | undefined>(undefined);

  React.useEffect(() => {
    if (!tweet) {
      return;
    }

    setTree(undefined);
    fetchTweet(tweet).then(body => setTree(body));
  }, [tweet]);

  if (!tree) {
    return (
      <div className="wrapper">
        <ClipLoader
          sizeUnit={'px'}
          size={100}
          color={'rgb(29, 161, 242)'}
          loading
        />
        <style jsx>{`
          .wrapper {
            width: 100%;
            padding: 80px 0;
            display: flex;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  }

  return <TreeNode node={tree} isRoot />;
};

const Index = () => {
  const [userInput, setUserInput] = React.useState('');
  const [tweet, setTweet] = React.useState('');

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
        {tweet && (
          <section>
            <TweetLoader tweet={tweet} />
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
