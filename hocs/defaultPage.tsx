import React from 'react';
import Head from 'next/head';
import Router from 'next/router';
import styled from 'styled-components';

import { getUserFromServerCookie, getUserFromLocalCookie } from '../utils/auth';
import { NextContext, NextComponentType } from 'next';

const App = styled.div`
  height: 100vh;
  width: 100vw;
`;

const Main = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  padding: 30px;
`;

export interface DefaultPageProps {
  currentUrl: string;
  isAuthenticated: boolean;
  loggedUser: any;
}

const defaultPage = <P extends object>(Page: NextComponentType<P>) =>
  class DefaultPage extends React.Component<P & DefaultPageProps> {
    static getInitialProps(ctx: NextContext) {
      const loggedUser = process.browser
        ? getUserFromLocalCookie()
        : getUserFromServerCookie(ctx.req);

      const pageProps = Page.getInitialProps && Page.getInitialProps(ctx);

      return {
        ...pageProps,
        loggedUser,
        currentUrl: ctx.pathname,
        isAuthenticated: !!loggedUser
      } as P & DefaultPageProps;
    }

    constructor(props: P & DefaultPageProps) {
      super(props);

      this.logout = this.logout.bind(this);
    }

    logout(eve: StorageEvent) {
      if (eve.key === 'logout') {
        Router.push(`/?logout=${eve.newValue}`);
      }
    }

    componentDidMount() {
      window.addEventListener('storage', this.logout, false);
    }

    componentWillUnmount() {
      window.removeEventListener('storage', this.logout, false);
    }

    render() {
      return (
        <div>
          <Head>
            <title>twiddet</title>
          </Head>
          <App>
            <Main>
              <Page {...this.props} />
            </Main>
          </App>
        </div>
      );
    }
  };

export default defaultPage;
