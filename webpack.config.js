const path = require('path');

module.exports = {
   mode: 'development',
   entry: './src/index.ts',
   devtool: 'source-map',
   output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      library: {
         name: '$ujs', // you then can access it via window: `window.$ujs`
         type: 'umd',
         umdNamedDefine: true,
      },
   },
   devServer: {
      static: {
         directory: path.join(__dirname, 'public'),
      },
      hot: true,
   },
   resolve: {
      extensions: ['.ts', '.js'],
      fallback: {
         crypto: require.resolve('crypto-browserify'),
         stream: require.resolve('stream-browserify'),
         buffer: require.resolve('buffer/'),
      },
   },
   module: {
      rules: [
         {
            use: 'ts-loader',
            exclude: /node_modules/,
         },
      ],
   },
};
