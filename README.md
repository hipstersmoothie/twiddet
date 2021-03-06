# twiddet

[![CircleCI](https://circleci.com/gh/hipstersmoothie/twiddet.svg?style=svg)](https://circleci.com/gh/hipstersmoothie/twiddet)

A website that enables you to read twitter conversations like reddit posts. All tweets and replies are rendered as foldable trees.

## Development Setup

To get started developing twiddet run the following commands

```sh
# install dependencies
yarn
# start the development server watcher
yarn dev
```

## Architecture

twiddet is built withe the following technologies:

- next.js - server-side-rendered react app
- express - serves the next.js website and interacts with Twitter

Dev Tooling:

- typescript - all the files
- eslint - using the new typescript parser + plugin
- stylelint - Lints the css in styled-jsx's `style` tags
- now 2.0 - serverless lambdas :+1:
