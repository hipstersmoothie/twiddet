"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const document_1 = __importStar(require("next/document"));
const server_1 = __importDefault(require("styled-jsx/server"));
class MyDocument extends document_1.default {
    static getInitialProps() {
        return { styles: server_1.default() };
    }
    render() {
        const cssFiles = [
            'https://unpkg.com/normalize.css@5.0.0/normalize.css',
            'https://unpkg.com/react-image-lightbox@5.1.0/style.css',
            'https://unpkg.com/react-treeview@0.4.7/react-treeview.css'
        ];
        return (<html>
        <document_1.Head>
          {this.props.styles}
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossOrigin="anonymous"/>
          {cssFiles.map(link => (<link key={link} href={link} rel="stylesheet"/>))}
          <style>{`
            * {
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
            }
            a {
              cursor: pointer;
            }
          `}</style>
        </document_1.Head>
        <body>
          <document_1.Main />
          <document_1.NextScript />
        </body>
      </html>);
    }
}
exports.default = MyDocument;
//# sourceMappingURL=_document.jsx.map