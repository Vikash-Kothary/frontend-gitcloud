// file: storybook/main.js

const root = process.env.GITCLOUD_FRONTEND_PATH || '../../../..';

module.exports = {
  stories: [`${root}/docs/src/*.@(tsx|js|mdx|md)`,`${root}/docs/src/**/*.@(tsx|js|mdx|md)`,`${root}/docs/src/**/**/*.@(tsx|js|mdx|md)`],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ]
};
