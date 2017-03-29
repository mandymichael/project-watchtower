import doClean from '../clean'
import PATHS from '../build/config/paths'

const { CLIENT_OUTPUT, SERVER_OUTPUT } = PATHS

const clean = (...paths: string[]) => (
    doClean([
        CLIENT_OUTPUT,
        SERVER_OUTPUT,
        '{client,common,config,server}/**/*.{js,map}',
        ...paths,
    ])
)

export default clean
