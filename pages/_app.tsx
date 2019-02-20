import App, { Container, NextAppContext } from 'next/app';
import Head from 'next/head';
import React from 'react';

import 'react-ui-tree/dist/react-ui-tree.css';
import './index.css';

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }: NextAppContext) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Head>
          <title>My new cool app</title>
        </Head>
        <Component {...pageProps} />
      </Container>
    );
  }
}
