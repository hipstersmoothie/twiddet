const withTypescript = require('@zeit/next-typescript');
const withCSS = require('@zeit/next-css');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = withCSS(
  withTypescript({
    webpack(config, options) {
      // Do not run type checking twice:
      if (options.isServer) {
        config.plugins.push(new ForkTsCheckerWebpackPlugin());
      }

      return config;
    }
  })
);
