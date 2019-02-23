import React from 'react';
import Document, {
  Head,
  Main,
  NextScript,
  RenderPageResponse
} from 'next/document';
import flush from 'styled-jsx/server';

interface MyDocumentProps extends RenderPageResponse {
  styleTags: React.ReactNode;
}

export default class MyDocument extends Document<MyDocumentProps> {
  static getInitialProps() {
    return { styles: flush() };
  }

  render() {
    const cssFiles = [
      'https://unpkg.com/normalize.css@5.0.0/normalize.css',
      'https://unpkg.com/react-image-lightbox@5.1.0/style.css',
      'https://unpkg.com/react-treeview@0.4.7/react-treeview.css'
    ];

    return (
      <html>
        <Head>
          {this.props.styles}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.7.2/css/all.css"
            integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr"
            crossOrigin="anonymous"
          />
          {cssFiles.map(link => (
            <link key={link} href={link} rel="stylesheet" />
          ))}
          <style>{`
            * {
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
            }
            a {
              cursor: pointer;
            }
          `}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
