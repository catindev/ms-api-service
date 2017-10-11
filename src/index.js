const PORT = 5000

const db = require('./db')

const Raven = require('raven')
Raven
    .config('https://376b0e70be5d44c6b686dfc6e2759fac:fabee281ea014c37966b9daab78bc2e3@sentry.io/159971')
    .install()

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use(require('./utils/validateSession'))
app.use(require('./router'))

app.use((error, request, response, next) => {
    Raven.captureException(error)
    const { message, code = 500 } = error
    response.status(code).json({ status: code, message })
})

app.listen(PORT)

console.log(`Listening on ${ PORT }...`)