import * as React from 'react';
import Head from 'next/head';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
import { ClipLoader } from 'react-spinners';
import * as q from 'query-string';

import { TweetTree } from 'types/twitter';
import TreeNode from '../components/TreeNode';

async function fetchTweet(tweet: string): Promise<TweetTree> {
  const result = await fetch(`${window.location.origin}/api/tweet/${tweet}`);
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
          loading
          color="rgb(29, 161, 242)"
          size={100}
          sizeUnit="px"
        />
        <style jsx>{`
          .wrapper {
            display: flex;
            justify-content: center;
            padding: 80px 0;
            width: 100%;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Twiddet - {tree.module.user.name}</title>
      </Head>
      <TreeNode isRoot node={tree} />
    </>
  );
};

const useQueryString = () => {
  const [queryString, setQueryString] = React.useState(
    q.parse(window.location.search)
  );

  const updateQueryString = (update: q.InputParams) => {
    const newQueryString = { ...queryString, ...update };
    setQueryString(newQueryString);

    const query = q.stringify(newQueryString);
    const newPath = `/?${query}`;

    Router.replace(newPath, newPath, {
      shallow: true
    });
  };

  Router.onRouteChangeComplete = (url: string) => {
    const update = q.parse(url.replace('/', ''));
    const newQueryString = { ...queryString, ...update };
    setQueryString(newQueryString);
  };

  return [queryString, updateQueryString] as [
    q.OutputParams,
    (update: q.InputParams) => void
  ];
};

const Index = () => {
  const [queryString, setQueryString] = useQueryString();
  const [userInput, setUserInput] = React.useState(queryString.tweet as string);
  const [tweet, setTweet] = React.useState(queryString.tweet as string);

  React.useEffect(() => {
    setUserInput(queryString.tweet as string);
    setTweet(queryString.tweet as string);
  }, [queryString]);

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
            setQueryString({ tweet: id });
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
          font-size: 20px;
          font-weight: 200;
          height: 100%;
          line-height: 30px;
          min-height: 100vh;
          text-align: center;
        }

        main {
          margin: 0 auto;
          min-width: 750px;
          width: 50%;
        }

        label {
          display: block;
          padding-bottom: 25px;
        }

        input {
          border: 2px solid #b3a8a854;
          border-radius: 9999px;
          font-size: 20px;
          height: 35px;
          min-width: 400px;
          text-align: center;
          text-indent: 20px;
        }

        section {
          background: white;
          margin-bottom: 80px;
          padding-bottom: 40px;
          padding-right: 30px;
          padding-top: 20px;
          text-align: left;
        }

        .hero {
          background: rgb(29, 161, 242);
          color: white;
          font-size: 26px;
          margin-bottom: 25px;
          padding: 100px;
        }
      `}</style>
    </div>
  );
};

export default Index;
