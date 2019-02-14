import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const Body = styled.div`
  height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Heading = styled.h1`
  font-size: 50px;
  font-weight: 200;
  line-height: 40px;
  color: #e74c3c;
`;

const Content = styled.p`
  font-size: 30px;
  font-weight: 200;
  line-height: 40px;
  color: #e74c3c;
`;

const ContentLink = styled.a`
  color: #e74c3c;
  padding-bottom: 2px;
  border-bottom: 1px solid #c0392b;
  text-decoration: none;
  font-weight: 400;
  line-height: 30px;
  transition: border-bottom 0.2s;
  &:hover {
    border-bottom-color: #e74c3c;
  }
`;

export default () => (
  <Body>
    <Heading>You haven't logged into Twitter yet!</Heading>
    <Content>
      Maybe you want to{' '}
      <Link href="/auth/sign-in">
        <ContentLink>sign in</ContentLink>
      </Link>{' '}
      and see what happens?
    </Content>
  </Body>
);
