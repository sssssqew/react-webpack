const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  // 자바스크립트 빌드
  entry: {
    app: ["babel-polyfill", "./src/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "../dist"), // __dirname : webpack config 파일이 위치한 곳 (현재는 /usr/src/app/config)
    filename: "index_bundle.js"
    // publicPath: "/" // http://0.0.0.0:3000/index_bundle.js 접속시 빌드 이후의 javascript 볼 수 있음
  },
  // 빌드된 파일의 크기가 512000 이상이면 경고 메시지 출력
  performance: {
    // hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  // 서버 설정
  devServer: {
    host: "0.0.0.0",
    port: process.env.REACT_PORT,
    disableHostCheck: true, // local 이외의 host에서도 접속하도록 허용
    historyApiFallback: true // 리액트 라우터가 제대로 동작하기 위한 설정
    // contentBase: path.resolve(__dirname, "dist"),
  },
  // Loader 적용
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: "babel-loader", // React 빌드
            options: {
              // webpack dev server 의 첫 로딩속도를 빠르게 함
              cacheDirectory: true,
              cacheCompression: false
            }
          }
        ],
        exclude: "/node_modules"
      },
      {
        test: /\.html$/,
        use: [{ loader: "html-loader", options: { minimize: true } }] // HTML 빌드와 minify
      },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] }, // CSS 빌드
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"] // SASS 빌드
      },
      // 이미지, 폰트 빌드
      // 10kb 이상 파일은 dist 폴더로 복사하고 10k 이하 파일은 문자열로 모듈에 추가함
      {
        // write image files under 10k to inline or copy image files over 10k
        test: /\.(jpg|jpeg|gif|png|svg|ico)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              fallback: "file-loader",
              name: "images/[name].[ext]"
            }
          }
        ]
      },
      {
        // write files under 10k to inline or copy files over 10k
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              fallback: "file-loader",
              name: "fonts/[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  //절대경로 설정
  resolve: {
    modules: [path.join(__dirname, "../src"), "node_modules"]
  },
  mode: "production", // production 모드인 경우 CSS, JAVASCRIPT minify, 자바스크립트 번들링 유무에 따라 파일크기가 엄청 다름
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html", // 빌드 전 HTML 파일 위치
      favicon: "src/assets/images/favicon.ico"
    }),
    // css 파일을 따로 추출함
    new MiniCssExtractPlugin({
      filename: "style.css" // 빌드 이후의 CSS 파일명
    }),
    new CleanWebpackPlugin(), // 사용하지 않는 빌드 파일 삭제
    new webpack.DefinePlugin({
      // 리액트 소스코드에 환경변수 주입
      "process.env.REACT_PORT": JSON.stringify(process.env.REACT_PORT)
    })
  ]
};