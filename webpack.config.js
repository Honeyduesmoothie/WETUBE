const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const BASE_URL = "./src/public/js";

module.exports = {
  entry: {
    main: BASE_URL + "/app.js",
    video: BASE_URL + "/videoPlayer.js",
    recorder: BASE_URL + "/recorder.js",
    comment: BASE_URL + "/comment.js",
    modal: BASE_URL + "/modal.js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/style.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        //  run in the opposite order
      },
    ],
  },
};
