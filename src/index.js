const PORT = 5000

const db = require('./db')

const Raven = require('raven');
Raven.config('https://376b0e70be5d44c6b686dfc6e2759fac:fabee281ea014c37966b9daab78bc2e3@sentry.io/159971').install();

const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const app = express()

app.set('view engine', 'ejs')
app.use(cookieParser())
app.use('/', express.static('static', { maxAge: 86400 }))
app.use(bodyParser.json())

// optionable
app.disable('view cache')

app.get('/', (request, response) => {
	const formatNumber = require('./utils/formatNumber');
	const formatNumberForHumans = require('./utils/formatNumberForHumans');
	response.send(formatNumberForHumans(formatNumber(request.query.number)));
})

app.use((error, request, response, next) => {
	Raven.captureException(error);
	const { message } = error;
	response.status(500).json({ message })
}) 

app.listen(PORT)

console.log(`Listening on ${ PORT }...`)