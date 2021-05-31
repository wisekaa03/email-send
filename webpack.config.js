/** @format */
/* eslint global-require:0, @typescript-eslint/no-var-requires:0, no-console:0 */

const { resolve } = require('path');
const DotenvWebpackPlugin = require('dotenv-webpack');
const Webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = (options) => {
  const { NODE_ENV = 'production' } = process.env || options;

  console.log(`-- Webpack <${NODE_ENV}> build --`);

  let config;
  const configRaw =
    NODE_ENV === 'production'
      ? require('./webpack.production.js')(options)
      : require('./webpack.development.js')(options);

  const entry =
    NODE_ENV === 'production'
      ? options.entry ?? []
      : ['webpack/hot/poll?100', options.entry || undefined];

  if (options?.entry?.includes('/src/')) {
    config = {
      ...options,
      ...configRaw,
      entry,
      plugins: [
        ...configRaw.plugins,
        // new Webpack.DefinePlugin({
        //   __DEV__: JSON.stringify(NODE_ENV === 'development'),
        //   __PRODUCTION__: JSON.stringify(NODE_ENV === 'production'),
        //   __TEST__: JSON.stringify(NODE_ENV === 'test'),
        //   __SERVER__: JSON.stringify(true),
        // }),
        new DotenvWebpackPlugin({ path: resolve(__dirname, '.local/.env') }),
      ],
      // stats: { ...configRaw.stats, errorDetails: true },
    };
  } else {
    // config = {
    //   ...configRaw,
    //   // optimization: {
    //   //    minimize: false,
    //   // },
    //   // entry: resolve(__dirname, 'ormconfig.ts'),
    //   output: {
    //     path: resolve(__dirname, 'dist'),
    //     filename: 'ormconfig.js',
    //     libraryTarget: 'commonjs2',
    //     libraryExport: 'default',
    //   },
    //   resolve: {
    //     ...configRaw.resolve,
    //     extensions: ['.ts', '.js'],
    //     plugins: [
    //       new TsconfigPathsPlugin({
    //         configFile: resolve(__dirname, './tsconfig.json'),
    //       }),
    //     ],
    //   },
    //   plugins: [
    //     ...configRaw.plugins,
    //     // new Webpack.DefinePlugin({
    //     //   __DEV__: JSON.stringify(NODE_ENV === 'development'),
    //     //   __PRODUCTION__: JSON.stringify(NODE_ENV === 'production'),
    //     //   __TEST__: JSON.stringify(NODE_ENV === 'test'),
    //     //   __SERVER__: JSON.stringify(true),
    //     // }),
    //     new DotenvWebpackPlugin({ path: resolve(__dirname, '.local/.env') }),
    //   ],
    //   externals: [nodeExternals({ allowlist: [/apps/, /libs/] })],
    //   module: {
    //     rules: [
    //       {
    //         test: /\.js$/,
    //         use: [
    //           {
    //             loader: 'babel-loader',
    //             // options: {
    //             //   presets: ['es2018'],
    //             // },
    //           },
    //           {
    //             loader: 'shebang-loader',
    //           },
    //         ],
    //       },
    //       {
    //         loader: 'ts-loader',
    //         options: {
    //           transpileOnly: true,
    //           configFile: resolve(__dirname, './tsconfig.ormconfig.json'),
    //         },
    //       },
    //     ],
    //   },
    // };
  }

  return config;
};
