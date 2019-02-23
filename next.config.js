const withTypescript = require('@zeit/next-typescript');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const debug = process.env.NODE_ENV !== 'production';
const assetPrefix = debug ? '' : '/twiddet';

module.exports = withTypescript({
  publicRuntimeConfig: {
    assetPrefix
  },
  webpack(config, options) {
    // Do not run type checking twice:
    if (options.isServer) {
      config.plugins.push(new ForkTsCheckerWebpackPlugin());
    }

    return config;
  }
});
