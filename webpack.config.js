const webpack = require('webpack')
const path = require('path')

module.exports = {
  target: 'node',
  mode: 'development',
  context: __dirname,
  entry:
    {
      index: './src/index.ts'
    },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    library: 'ReactPdfHandler',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/, '/sample/node_modules/']
      }
    ]
  },
  optimization: {
    minimize: false
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3005,
    watchOptions: {
      poll: true
    }
  }
}
