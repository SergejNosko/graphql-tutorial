const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = {
  entry: {
    app: './src/index.jsx'
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
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              camelCase: true,
              localIdentName: '[name]__[local]__[hash:base64:6]'
            }
          },
          'sass-loader'
        ] 
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