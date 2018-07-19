const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = {
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
      }
    ]
  },
  devtool: 'source-map',
  mode: 'development',
  plugins: [
    new ExtractTextPlugin('style.css')
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['src', 'node_modules']
  },
  devServer: {
    contentBase: './',
    historyApiFallback: true,
    port: 8080
  }
}

module.exports = config