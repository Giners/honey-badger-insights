const path = require('path')
const webpack = require('webpack')

module.exports = {
  // Entry point for our application. This is where webpack will start tracking dependencies
  // between modules
  entry: [
    '@babel/polyfill',
    'webpack-dev-server/client?http://0.0.0.0:8080',
    './src/client/containers/Root.jsx',
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
  },
  // webpack has the concept of modules which support the familiar concept of modular programming.
  // This is needed as modular programming for the web has been slow to arrive.
  //
  // webpack supports modules written in a variety of languages and preprocessors via rules
  // (formerly known as loaders). Rules describe to webpack how to process non-JavaScript modules
  // and includes these dependencies into your bundles.
  //
  // webpack only supports JS modules natively so for a module written in any other language you
  // will need to provide a rule to turn that module into JS.
  //
  // List of rules we use:
  // * babel-loader
  //   Allows for transpiling of JavaScript files using Babel. Babel is leveraged to transpile
  //   ES6 JS => ES5 JS
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
      },
    ],
  },
  // The 'resolve' field contains options for how webpack resolves modules. For more information please view the
  // following doc: https://webpack.js.org/concepts/module-resolution
  resolve: {
    // The 'extensions' field tells webpack to automatically resolve certain filename extensions.
    // This is what allows us to leave off the extension when using the 'import' statement.
    extensions: ['.js', '.jsx'],
  },
  // Plugins allow for the webpack build process to be customized
  //
  // List of plugins that we use:
  // * DefinePlugin
  //   Allows you to create global constants which can be configured at compile time.
  //   See: https://webpack.js.org/plugins/define-plugin/#src/components/Sidebar/Sidebar.jsx
  plugins: [
    new webpack.DefinePlugin({
      'process.env.HOST_URL': JSON.stringify(process.env.HOST_URL),
    }),
  ],
  // Webpack has a dev server that can be used to develop applications quickly. For example it can
  // serve your bundled assets as well as watch for changes, recompile your changes, and hot load
  // them. These options are picked up by the webpack dev server and change the way it behaves
  devServer: {
    // 'contentBase' tells the dev server where to serve static assets from. 'publicPath' will be
    // used to determine where bundles should be served from and it takes precedence.
    contentBase: './public',
    // When 'historyApiFallback' is set to true the index.html page will be served in place of any
    // 404 responses when using the HTML5 history API
    historyApiFallback: true,
  },
}
