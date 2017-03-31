import CONFIG from '../build/config/config'
import clean from './clean'
import build from './build'
import start from './start'
import watchServer from '../watch/server'

const { HAS_SERVER } = CONFIG

/**
 * Rebuilds the client on changes
 * @param args
 * - server: Also watches and rebuilds server
 * - fast: disables type checking
 */
async function watch(...args: string[]) {

    if (args.indexOf('fast') !== -1) {
        process.env.START_FAST_MODE = 'true'
    }

    const isServerWatch = HAS_SERVER
        && args.indexOf('server') !== -1

    await clean()

    if (isServerWatch) {
        return watchServer()
    }

    if (HAS_SERVER) {
        await build('server', 'dev')
    }

    return start('watch')
}

export default watch