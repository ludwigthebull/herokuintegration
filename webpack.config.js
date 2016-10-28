module.exports = {
  entry: './src/client/index.js',
  output: {
    path: __dirname + '/src/public/js',
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader'
        ]
      }
    ]
  }
};
