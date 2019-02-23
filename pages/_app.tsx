import App, { Container, NextAppContext } from 'next/app';
import Head from 'next/head';
import React from 'react';

import 'react-treeview/react-treeview.css';

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
          <title>Twiddet</title>
        </Head>
        <Component {...pageProps} />
      </Container>
    );
  }
}
