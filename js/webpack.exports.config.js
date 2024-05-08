const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env) => {
  let entry = "./lib/web-dev.js";

  return {
    mode: "development",
    entry: entry,
    devtool: "inline-source-map",
    devServer: {
      static: "./web-dev",
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Development",
      }),
    ],
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "export"),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    optimization: {
      runtimeChunk: "single",
    },
  };
};
