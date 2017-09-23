const router = require('express').Router()
const adminsOnly = require('./utils/isAdmin')
const {
    createAccount,
    allAccounts,
    accountById,
    updateAccount
} = require('./queries/accounts')
const { createUser } = require('./queries/users')


router.get('/', (request, response) => response.json({
    name: 'api-service',
    version: 1
}))

router.post('/session', (request, response, next) => {
    const { login, password, type } = request.body

    if (!login || !password) return response.status(400).json({
        message: 'Введите логин и пароль'
    })

    const { SignIn } = require('./queries/sessions')
    SignIn({ login, password, type })
        .then(token => response.json({ status: 200, token }))
        .catch(error => { next(error) })
})

router.get('/session', (request, response, next) => {
    const { getTokenOwner } = require('./queries/sessions')
    const { session_token } = request.query
    getTokenOwner({ token: session_token })
        .then(user => {
            user.id = user._id
            delete user._id
            response.json(Object.assign({ status: 200 }, user))
        })
        .catch(next)
})

router.post('/account', adminsOnly, (request, response, next) => {
    const { name } = request.body
    const { userID } = request

    createAccount({ name, author: userID })
        .then(({ _id }) => response.json({ status: 200, id: _id }))
        .catch(next)
})

router.get('/accounts', adminsOnly, (request, response, next) => {
    // TODO: потестить на юзере из ЦРМ
    const { userID } = request

    allAccounts({ userID })
        .then(items => response.json({ status: 200, items }))
        .catch(next)
})

router.get('/account/:accountID', adminsOnly, (request, response, next) => {
    const { accountID } = request.params
    const { userID } = request

    // TODO: дату создания в ЧПВ
    accountById({ userID, accountID })
        .then(account => {
            if (account === null) return response.status(404)
                .json({ status: 404, message: 'Аккаунт не найден' })

        	let acc = account.toJSON()
        	const id = acc._id
        	delete acc._id

        	response.json(Object.assign({ status: 200, id }, acc))
        })
        .catch(next)
})

router.put('/account/:accountID', adminsOnly, (request, response, next) => {
	const { accountID } = request.params
    const { body, userID } = request

    updateAccount({ userID, accountID, data: body })
        .then(() => response.json({ status: 200 }))
        .catch(next)
})

router.post('/account/:accountID/user', adminsOnly, (request, response, next) => {
    const { name } = request.body
    const { accountID } = request.params
    const { userID } = request

    createUser({ name, userID, accountID })
        .then(({ _id }) => response.json({ status: 200, id: _id }))
        .catch(next)
})


router.all('*', (request, response) => response.status(404).json({
    status: 404,
    message: 'Здесь ничего нет'
}))

module.exports = router