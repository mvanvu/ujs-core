const path = require('path');

module.exports = {
   mode: 'production',
   entry: './src/index.ts',
   // devtool: 'inline-source-map',
   output: {
      globalObject: 'this',
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      library: {
         name: '$ujs', // you then can access it via window: `window.$ujs`
         type: 'umd',
         umdNamedDefine: true,
      },
      pathinfo: false,
   },
   devServer: {
      static: {
         directory: path.join(__dirname, 'public'),
      },
      hot: true,
   },
   resolve: {
      extensions: ['.ts', '.js'],
   },
   module: {
      rules: [
         {
            use: 'ts-loader',
            include: path.resolve(__dirname, 'src'),
            exclude: /node_modules/,
         },
      ],
   },
};
