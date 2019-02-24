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
const app_1 = __importStar(require("next/app"));
const head_1 = __importDefault(require("next/head"));
const react_1 = __importDefault(require("react"));
class MyApp extends app_1.default {
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {};
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }
        return { pageProps };
    }
    render() {
        const { Component, pageProps } = this.props;
        return (<app_1.Container>
        <head_1.default>
          <title>Twiddet</title>
        </head_1.default>
        <Component {...pageProps}/>
      </app_1.Container>);
    }
}
exports.default = MyApp;
//# sourceMappingURL=_app.jsx.map