import * as path from 'path'
import {
    formatFileSize,
    readFile,
    getFileSize,
    writeFile,
    getCustomConfigFile,
} from '../../../lib/runtime/util/fs'
import { expectPromiseToFail } from '../../test-helpers'
import { BuildConfigOverride } from '../../../lib/types'

const packageJson = path.resolve(process.cwd(), 'package.json')
const buildStatsFile = path.resolve(process.cwd(), 'build-stats.csv')

describe('util/fs', () => {

    it('readFile', async () => {
        const content = await readFile(packageJson)
        expect(content).toContain('project-watchtower')
    })

    it('readFile - non-existent file', async () => {
        expectPromiseToFail(readFile(packageJson + 'x'))
    })

    it('getFileSize', async () => {
        const size = await getFileSize(packageJson)
        expect(size).toBeGreaterThan(100)
    })

    it('writeFile', async () => {
        await writeFile(buildStatsFile, 'foobar')
        const content = await readFile(buildStatsFile)
        expect(content).toBe('foobar')
    })

    it('formatFileSize', () => {
        expect(formatFileSize(2048)).toBe('2.0')
    })

    it('getCustomConfigFile', () => {
        const buildConfig = getCustomConfigFile<BuildConfigOverride>('config/config', {})
        expect(buildConfig).toEqual({
            LINT_EXCLUDE: [
                'demo/**',
                'client/**',
                'server/**',
                'test/**',
            ],
        })

        const nonExistentConfig = getCustomConfigFile<BuildConfigOverride>('config/foobar', {})
        expect(nonExistentConfig).toEqual({})
    })

})
