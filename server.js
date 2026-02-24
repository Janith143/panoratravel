// server.js - Custom entry point for cPanel/hPanel Passenger (Hostinger Node.js App)
// Do NOT delete this file. It is required for Hostinger to serve the Next.js App Router properly.

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.DB_HOST || 'localhost'
// NextJS often requires a default port when booting custom servers
const port = process.env.PORT || 3000

// Initialize Next.js in production or dev mode based on environment
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    createServer(async (req, res) => {
        try {
            // Be sure to pass `true` as the second argument to `url.parse`.
            // This tells it to parse the query portion of the URL.
            const parsedUrl = parse(req.url, true)
            const { pathname, query } = parsedUrl

            // Custom routing goes here if needed, otherwise pass everything to Next.js
            await handle(req, res, parsedUrl)

        } catch (err) {
            console.error('Error occurred handling', req.url, err)
            res.statusCode = 500
            res.end('Internal Server Error')
        }
    }).listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://${hostname}:${port}`)
    })
})
