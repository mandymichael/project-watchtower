import { ChildProcess } from 'child_process'
import clean from './clean'
import build from './build'
import start from './start'
import { default as watchServer, WatchServer } from '../watch/server'
import { StartParam, WatchParam } from '../types'
import { BuildConfig } from '../../lib'
import { Logger } from '../runtime/universal'

/**
 * Rebuilds the client on changes
 * @param args
 * - server: Also watches and rebuilds server
 * - fast: disables type checking
 * - client: Only run client without a server
 */
const watch = async (
    log: Logger,
    buildConfig: BuildConfig,
    ...args: WatchParam[]
): Promise<ChildProcess | WatchServer> => {
    const { HAS_SERVER } = buildConfig
    const additionalStartParams: StartParam[] = []

    if (args.indexOf('fast') !== -1) {
        additionalStartParams.push('fast')
        process.env.START_FAST_MODE = 'true'
    }

    if (args.indexOf('inspect') !== -1) {
        additionalStartParams.push('inspect')
    }

    await clean(log, buildConfig)

    const isServerWatch = HAS_SERVER && args.indexOf('server') !== -1

    if (isServerWatch) {
        return watchServer(log, buildConfig)
    }

    const clientMode = !HAS_SERVER || args.indexOf('client') !== -1

    if (clientMode) {
        return start(log, buildConfig, 'watch', 'client', ...additionalStartParams)
    } else {
        await build(log, buildConfig, 'server', 'dev')
        return start(log, buildConfig, 'watch', ...additionalStartParams)
    }
}

export default watch
