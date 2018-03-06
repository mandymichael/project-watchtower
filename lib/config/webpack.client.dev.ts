import * as webpack from 'webpack'
import * as merge from 'webpack-merge'
import * as ExtractTextPlugin from 'extract-text-webpack-plugin'
import baseConfig from './webpack.base'
import clientBaseConfig from './webpack.client'
import devConfig from './webpack.dev'
import getWebpackHooks, { getHook } from './webpack-hooks'
import { CreateWebpackConfig } from './index'

/** Webpack config for the client in development */
const config: CreateWebpackConfig = options => {
    const webpackHooks = getWebpackHooks(options.log, options.buildConfig.BASE)
    return merge(
        baseConfig(options),
        getHook(webpackHooks.base, options),
        clientBaseConfig(options),
        getHook(webpackHooks.client, options),
        devConfig,
        getHook(webpackHooks.dev, options),
        {
            entry: {
                main: ['webpack-hot-middleware/client?noInfo=true'],
            },
            output: {
                filename: options.buildConfig.ASSETS_PATH_PREFIX + 'js/[name].js',
                chunkFilename: options.buildConfig.ASSETS_PATH_PREFIX + 'js/[name].js',
            },
            plugins: [
                new ExtractTextPlugin(options.buildConfig.ASSETS_PATH_PREFIX + 'css/[name].css'),
                new webpack.HotModuleReplacementPlugin(),
            ],
        },
        getHook(webpackHooks.clientDev, options),
    )
}

export default config
