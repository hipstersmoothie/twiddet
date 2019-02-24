"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const head_1 = __importDefault(require("next/head"));
const router_1 = __importDefault(require("next/router"));
const isomorphic_unfetch_1 = __importDefault(require("isomorphic-unfetch"));
const react_spinners_1 = require("react-spinners");
const q = __importStar(require("query-string"));
const TreeNode_1 = __importDefault(require("../components/TreeNode"));
async function fetchTweet(tweet) {
    const result = await isomorphic_unfetch_1.default(`${window.location.origin}/api/tweet/${tweet}`);
    const body = await result.json();
    return body;
}
const TweetLoader = ({ tweet }) => {
    const [tree, setTree] = React.useState(undefined);
    React.useEffect(() => {
        if (!tweet) {
            return;
        }
        setTree(undefined);
        fetchTweet(tweet).then(body => setTree(body));
    }, [tweet]);
    if (!tree) {
        return (<div className="wrapper">
        <react_spinners_1.ClipLoader loading color="rgb(29, 161, 242)" size={100} sizeUnit="px"/>
        <style jsx>{`
          .wrapper {
            display: flex;
            justify-content: center;
            padding: 80px 0;
            width: 100%;
          }
        `}</style>
      </div>);
    }
    return (<>
      <head_1.default>
        <title>Twiddet - {tree.module.user.name}</title>
      </head_1.default>
      <TreeNode_1.default isRoot node={tree}/>
    </>);
};
const useQueryString = () => {
    const [queryString, setQueryString] = React.useState(q.parse(window.location.search));
    const updateQueryString = (update) => {
        const newQueryString = { ...queryString, ...update };
        setQueryString(newQueryString);
        const query = q.stringify(newQueryString);
        const newPath = `/?${query}`;
        router_1.default.replace(newPath, newPath, {
            shallow: true
        });
    };
    router_1.default.onRouteChangeComplete = (url) => {
        const update = q.parse(url.replace('/', ''));
        const newQueryString = { ...queryString, ...update };
        setQueryString(newQueryString);
    };
    return [queryString, updateQueryString];
};
const Index = () => {
    const [queryString, setQueryString] = useQueryString();
    const [userInput, setUserInput] = React.useState(queryString.tweet);
    const [tweet, setTweet] = React.useState(queryString.tweet);
    React.useEffect(() => {
        setUserInput(queryString.tweet);
        setTweet(queryString.tweet);
    }, [queryString]);
    return (<div className="background">
      <div className="hero">
        <label>Please enter a tweet id or a URL to a tweet</label>
        <input value={userInput} onChange={e => {
        let id = e.currentTarget.value;
        const match = id.match(/https:\/\/twitter\.com\/\S+\/status\/(\d+)/);
        setUserInput(id);
        if (match) {
            id = match[1];
        }
        setTweet(id);
        setQueryString({ tweet: id });
    }}/>
      </div>
      <main>
        {tweet && (<section>
            <TweetLoader tweet={tweet}/>
          </section>)}
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
    </div>);
};
exports.default = Index;
//# sourceMappingURL=index.jsx.map