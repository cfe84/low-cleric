const path = require('path');

module.exports = {
  entry: './src/app.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'law-cleric.js',
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader' },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  mode: "development",
  plugins: [
  ],
  // node: { fs: "empty" }
};