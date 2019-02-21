import Document, {
  Head,
  Main,
  NextScript,
  NextDocumentContext,
  RenderPageResponse
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';

interface MyDocumentProps extends RenderPageResponse {
  styleTags: React.ReactNode;
}

export default class MyDocument extends Document<MyDocumentProps> {
  static getInitialProps({ renderPage }: NextDocumentContext) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />)
    );
    const styleTags = sheet.getStyleElement();

    return { ...page, styleTags };
  }

  render() {
    const cssFiles = ['https://unpkg.com/normalize.css@5.0.0/normalize.css'];

    return (
      <html>
        <Head>
          {this.props.styleTags}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.7.2/css/all.css"
            integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr"
            crossOrigin="anonymous"
          />

          {cssFiles.map((c, i) => (
            <link key={i} href={c} rel="stylesheet" />
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
