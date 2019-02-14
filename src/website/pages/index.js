import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';

import defaultPage from '../hocs/defaultPage';
import securePage from '../hocs/securePage';

const Main = styled.div`
  max-width: 750px;
  margin: 0 auto;
  text-align: center;
`;
const Heading = styled.h1`
  font-size: 40px;
  font-weight: 200;
  line-height: 40px;
`;
const Content = styled.p`
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
const ContentLink = styled.a`
  color: #333;
  padding-bottom: 2px;
  border-bottom: 1px solid #ccc;
  text-decoration: none;
  font-weight: 400;
  line-height: 30px;
  transition: border-bottom 0.2s;
  &:hover {
    border-bottomcolor: #333;
  }
`;

const createLink = (href, text) => (
  <ContentLink href={href}>{text}</ContentLink>
);

async function fetchTweet(tweet) {
  // You can await here
  console.log(tweet);
  try {
    console.log(`https://api.twitter.com/1.1/statuses/show.json?id=${tweet}`);
  } catch (error) {}
}

const Index = ({ isAuthenticated, ...props }) => {
  const [userInput, setUserInput] = React.useState('');
  const [tweet, setTweet] = React.useState(null);

  React.useEffect(() => {
    if (!tweet) {
      return;
    }

    fetchTweet(tweet);
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
          {tweet}
        </Content>
      </Main>
    </div>
  );
};

Index.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

export default securePage(Index);
