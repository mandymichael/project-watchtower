import * as React from 'react'
import * as express from 'express'
import { renderToString } from 'react-dom/server'
import { addAssetsToHtml } from 'project-watchtower/lib/server/assets'
import { getHotReloadMiddleware, openBrowser } from 'project-watchtower/lib/server/dev'
import App from '../common/App'

const port = process.env.PORT || 3000
const isProduction = process.env.NODE_ENV === 'production'
const watchMode = process.env.START_WATCH_MODE === 'true'

const createServer = () => {
    const app = express()

    if (!isProduction && watchMode) {
        app.use(getHotReloadMiddleware())
    }

    app.use(express.static('public', {
        index: false,
    }))

    const ssr = renderToString(React.createElement(App))

    app.get('*', (_req, res) => {
        const content = addAssetsToHtml(`<!DOCTYPE html>
    <html>
    <head>
        <title>Demo Server</title>
    </head>
    <body>
        <div id="app-root">${ssr}</div>
    </body>
    </html>`)

        res.send(content)
    })

    app.listen(port, () => {
        // tslint:disable-next-line no-console
        console.log(`Server listening on port ${port}`)
        if (!isProduction && watchMode) {
            openBrowser(port)
        }
    })
}

export default createServer
