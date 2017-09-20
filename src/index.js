const PORT = 5000

const db = require('./db')

const Raven = require('raven')
Raven
	.config('https://376b0e70be5d44c6b686dfc6e2759fac:fabee281ea014c37966b9daab78bc2e3@sentry.io/159971')
	.install()

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()

app.use(cookieParser())
app.use(bodyParser.json())

app.use((request, response, next) => {
	const { path, method } = request
	if (path === '/sessions' && method === 'POST') return next()
	if (path === '/' && method === 'GET') return next()

	const { session } = request.cookies
	const { session_token } = request.query
	const { sessionID } = request.params

	const token = session || session_token || sessionID

	if (!token) return response.status(403).json({ 
		error: 'Нет доступа. Авторизуйтесь' 
	})

	const { getTokenOwner } = require('./queries/sessions')	
	getTokenOwner({ token })
		.then(ownerID => {
			next()
		})
		.catch(next)
})

app.use(require('./router'))

app.use((error, request, response, next) => {
	Raven.captureException(error)
	const { message, code = 500 } = error
	response.status(code).json({ message })
}) 

app.listen(PORT)

console.log(`Listening on ${ PORT }...`)