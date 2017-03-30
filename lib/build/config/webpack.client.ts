import * as fs from 'fs'
import * as webpack from 'webpack'
import * as autoprefixer from 'autoprefixer'
import * as ExtractTextPlugin from 'extract-text-webpack-plugin'
import * as AssetsPlugin from 'assets-webpack-plugin'
import CONFIG from './config'
import { updateAssetLocations } from '../../server/assets'
import { Assets } from '../../types'

const { CLIENT_ENTRY, CLIENT_OUTPUT, CLIENT_POLYFILLS, PUBLIC_PATH } = CONFIG

type EntryPoints = {
    [name: string]: string[],
}

const entry: EntryPoints = {
    main: [
        CLIENT_ENTRY,
    ],
}

if (CLIENT_POLYFILLS && fs.existsSync(CLIENT_POLYFILLS)) {
    entry.vendor = [
        CLIENT_POLYFILLS,
    ]
}

/**
 * Base webpack config for the client that is used both in development and production
 * - Compile SCSS to CSS and extract into external assets
 * - Create assets.json that maps the created assets to their locations
 * - Create vendor chunk with everything from node_modules except for SWM modules
 */
const clientBaseConfig: webpack.Configuration = {
    entry,
    output: {
        path: CLIENT_OUTPUT,
        publicPath: PUBLIC_PATH,
    },
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => [
                                    autoprefixer({ browsers: ['last 2 versions'] }),
                                ],
                            },
                        },
                        'resolve-url-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                }),
            },
        ],
    },
    plugins: [
        new AssetsPlugin({
            filename: 'assets.json',
            processOutput: (assets: Assets) => {
                updateAssetLocations(assets)
                return JSON.stringify(assets)
            },
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: (module: { context: string }) => (
                module.context
                && module.context.indexOf('node_modules') !== -1
                && module.context.indexOf('swm-component-library') === -1
                && module.context.indexOf('redux-data-loader') === -1
            ),
        }),
    ],
}

export default clientBaseConfig