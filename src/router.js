const router = require('express').Router()

router.get('/', (request, response) => {
	const formatNumber = require('./utils/formatNumber')
	const forHumans = require('./utils/formatNumberForHumans')
	response.send(forHumans(formatNumber(request.query.number)))
})

router.post('/sessions', (request, response, next) => {
	const { login, password, type } = request.body

	if (!login || !password) return response.status(400).json({
		message: 'Введите логин и пароль'
	})

	const { SignIn } = require('./queries/sessions')	
	SignIn({ login, password, type })
		.then( token => response.json({ token }))
		.catch( error => { next(error) })
})

router.post('/accounts', (request, response, next) => {
	const { name } = request.body
	const { userID } = request

	const { createAccount } = require('./queries/accounts')	
	createAccount({ name, author: userID })
		.then(({ _id }) => response.json({ id: _id }))
		.catch(next)
})


router.get('*', (request, response) => response.status(404).json({ 
	message: 'Здесь ничего нет' 
}))

module.exports = router