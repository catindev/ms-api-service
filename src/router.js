const router = require('express').Router()

router.get('/', (request, response) => response.json({ 
	name: 'api-service', version: 1
}))

router.post('/session', (request, response, next) => {
	const { login, password, type } = request.body

	if (!login || !password) return response.status(400).json({
		message: 'Введите логин и пароль'
	})

	const { SignIn } = require('./queries/sessions')	
	SignIn({ login, password, type })
		.then( token => response.json({ token }))
		.catch( error => { next(error) })
})

router.get('/session', (request, response, next) => {
	const { getTokenOwner } = require('./queries/sessions')	
	const { session_token } = request.query
	getTokenOwner({ token: session_token })
		.then(user => response.json(user))
		.catch(next)
})

router.post('/account', (request, response, next) => {
	const { name } = request.body
	const { userID } = request

	const { createAccount } = require('./queries/accounts')	
	createAccount({ name, author: userID })
		.then(({ _id }) => response.json({ id: _id }))
		.catch(next)
})

router.get('/accounts', (request, response, next) => {
	const { allAccounts } = require('./queries/accounts')	
	allAccounts()
		.then( items => response.json({ items }))
		.catch(next)
})

router.get('/account/:id', (request, response, next) => {
	const { id } = request.params
	const { accountById } = require('./queries/accounts')	
	accountById({ id })
		.then( account => response.json(account))
		.catch(next)
})


router.get('*', (request, response) => response.status(404).json({ 
	message: 'Здесь ничего нет' 
}))

module.exports = router