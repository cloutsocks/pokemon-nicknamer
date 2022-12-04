const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const buildPath = path.resolve(__dirname, "dist");

module.exports = {
  mode: "production",

  devtool: "inline-source-map",

  devServer: {
    // contentBase: './dist',
    writeToDisk: false, // https://webpack.js.org/configuration/dev-server/#devserverwritetodisk-
  },

  // https://webpack.js.org/concepts/output/
  output: {
    filename: "[name].[contenthash].js",
    path: buildPath,
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // // Creates `style` nodes from JS strings
          // "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        // https://webpack.js.org/guides/asset-modules/#replacing-inline-loader-syntax
        resourceQuery: /raw/,
        type: "asset/source",
      },
      {
        // https://webpack.js.org/loaders/html-loader/#usage
        resourceQuery: /template/,
        loader: "html-loader",
      },
    ],
  },

  // https://webpack.js.org/concepts/plugins/
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),

    new MiniCssExtractPlugin(),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/img",
          to: "img",
        },
      ],
    }),
  ],

  optimization: {
    minimize: true
 },
};
