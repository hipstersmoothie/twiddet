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
    <div className="background">
      <div className="hero">
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
      </div>
      <main>
        {tweet && (
          <section>
            <TweetLoader tweet={tweet} />
          </section>
        )}
      </main>

      <style jsx>{`
        .background {
          background-color: rgb(230, 236, 240);
          min-height: 100vh;
          height: 100%;
          font-size: 20px;
          font-weight: 200;
          line-height: 30px;
          text-align: center;
        }

        main {
          width: 50%;
          margin: 0 auto;
          min-width: 750px;
        }

        label {
          padding-bottom: 25px;
          display: block;
        }

        input {
          min-width: 400px;
          border-radius: 9999px;
          text-indent: 20px;
          font-size: 20px;
          height: 35px;
          text-align: center;
        }

        section {
          text-align: left;
          background: white;
          padding-top: 20px;
          padding-right: 30px;
          padding-bottom: 40px;
          margin-bottom: 80px;
        }

        .hero {
          background: rgb(29, 161, 242);
          color: white;
          padding: 100px;
          font-size: 26px;
          margin-bottom: 25px;
        }
      `}</style>
    </div>
  );
};

export default Index;
