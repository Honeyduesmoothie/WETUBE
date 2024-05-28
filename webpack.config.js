const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const path = require("path")

module.exports = {
    entry: "./src/public/js/app.js",
    mode:"development",
    plugins: [new MiniCssExtractPlugin({
        filename: "css/style.css"
    })],
    output: {
        filename: "js/app.js",
        path: path.resolve(__dirname, "assets"),
        clean: true,
    },
    watch: true,
    module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: "defaults" }]
                ]
              }
            }
          },
          {
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            //  run in the opposite order
          }
        ]
      }
}