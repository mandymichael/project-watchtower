import test from '../../lib/bin/test'
import { getConfig } from '../../lib/runtime/config/config'

// Increase test timeout because tests might take a while
import { createConsoleLogger } from '../../lib/runtime/universal'
;(jasmine as any).DEFAULT_TIMEOUT_INTERVAL = 60000

const log = createConsoleLogger()
const buildConfig = getConfig(log, process.cwd())

describe('bin/test', () => {
    it('will test', async () => {
        await test(
            log,
            buildConfig,
            '--config',
            'jest.json',
            'math.test.ts', // make sure to not recursively test this file
        )
    })
})
