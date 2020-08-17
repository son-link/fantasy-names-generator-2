const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const basePath = __dirname;
const distPath = 'dist';

module.exports = {
  mode: process.NODE_ENV || "development",
  entry: {
     app: ['./index.js'],
  },
  target: "node",
  output: {
    path: path.join(basePath, distPath),
    filename: "index.js"
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: { publicPath: "dist" }
          }
        ]
      },
      {
        test: /\.node$/,
        use: [
          {
            loader: "native-addon-loader",
            options: { name: "[name]-[hash].[ext]" }
          }
        ]
      }
    ]
  },
  node: {
    __dirname: false
  },
  plugins: [
  	new CleanWebpackPlugin(),
  	new CopyPlugin({
      		patterns: [
        		{ from: 'names', to: 'names' },
        		{ from: 'locales', to: 'locales' },
      		],
      	})
  ]
};
