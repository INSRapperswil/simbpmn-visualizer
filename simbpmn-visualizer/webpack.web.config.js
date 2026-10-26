const path = require('path');
const renderer = require('./webpack.renderer.config');

// Rebuild the compatibility bundle used by the simpleXflow web application.
module.exports = {
  ...renderer,
  mode: 'production',
  target: 'web',
  module: {
    rules: renderer.module.rules.filter(rule => rule.use?.loader !== '@vercel/webpack-asset-relocator-loader')
  },
  entry: './src/renderer.ts',
  output: {
    path: path.resolve(__dirname, '.webpack/web'),
    filename: 'main_window/index.js',
    publicPath: '/vendor/simbpmn/'
  },
  devtool: false
};

if (require.main === module) {
  require('webpack')(module.exports, (error, stats) => {
    if (error) console.error(error);
    else console.log(stats.toString({ colors: false, modules: false }));
    process.exitCode = error || stats.hasErrors() ? 1 : 0;
  });
}
