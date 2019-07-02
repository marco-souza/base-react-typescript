import webpack from 'webpack'

import Happypack from 'happypack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import FaviconsWebpackPlugin from 'favicons-webpack-plugin'
// import CopyPlugin from 'copy-webpack-plugin'
// import ServiceWorkerWebpackPlugin from 'serviceworker-webpack-plugin'
// import WebpackPwaManifest from 'webpack-pwa-manifest'

import { getVarEnv } from './utils'

const entry = getVarEnv('SRC_PATH')
const dest = getVarEnv('BUILD_DIR')
const htmlTemplate = getVarEnv('HTML_ROOT')
const appLogo = getVarEnv('APP_LOGO')
const appResolve = getVarEnv('APP_RESOLVE')
const assetsResolve = getVarEnv('ASSETS_RESOLVE')
const modulesResolve = getVarEnv('MODULES_RESOLVE')

console.log(appResolve)

export default {
  entry,
  output: {
    path: dest,
    filename: '[name].[hash].js',
  },
  resolve: {
    modules: [
      appResolve,
      assetsResolve,
      modulesResolve,
    ],
  },
  module: {
    rules: [
      // JS loader
      { test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          'happypack/loader',
        ] },

      // HTML template loader (pug)
      { test: /\.pug$/,
        use: [
          'pug-loader',
        ] },
    ],
  },

  // Plugins
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new Happypack({
      loaders: [
        { loader: 'babel-loader' },
        { loader: 'eslint-loader' },
      ],
    }),
    new HtmlWebpackPlugin({
      template: htmlTemplate,
    }),
    // Avoid to import React to use JSX syntax
    new webpack.ProvidePlugin({
      'React': 'react',
    }),
    // Create favicon
    new FaviconsWebpackPlugin(appLogo),
    // new WebpackPwaManifest(manifest),
    // Copy Assets
    // new CopyPlugin(app.copyAssets),
    // Service Workers
    // new ServiceWorkerWebpackPlugin({
    //   entry: app.workers.main,
    //   filename: 'sw-main.js',
    // }),
  ],

  // Optimizations
  optimization: {
    removeAvailableModules: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
      }),
    ],
    splitChunks: {
      chunks: 'all',
      hidePathInfo: false,
      minSize: 10000,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
      cacheGroups: {
        vendors: {
          test: /node_modules/,
        },
      },
    },
  },
}