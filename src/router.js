const router = require('express').Router()
const { createAccount, allAccounts, accountById, updateAccount } = require('./queries/accounts')
const { createUser, userById, allUsers, updateUser, resetPassword } = require('./queries/users')

// TODO: страничка с доками для авторизованного админа
router.get('/', (request, response) => response.json({
    name: 'api-service',
    version: 1
}))

router.post('/sessions', (request, response, next) => {
    const { login, password } = request.body

    if (!login || !password) return response.status(400).json({
        message: 'Введите логин и пароль'
    })

    const { SignIn } = require('./queries/sessions')
    SignIn({ login, password })
        .then(token => response.json({ status: 200, token }))
        .catch(error => { next(error) })
})

router.get('/sessions', (request, response, next) => {
    const { getTokenOwner } = require('./queries/sessions')
    const { session_token } = request.query
     
    getTokenOwner({ token: session_token })
        .then(user => {
            const id = user._id
            delete user._id
            response.json(Object.assign({ status: 200, id }, user))
        })
        .catch(next)
})

router.post('/accounts', (request, response, next) => {
    const { name } = request.body
    const { userID } = request

    createAccount({ name, author: userID })
        .then(({ _id }) => response.json({ status: 200, id: _id }))
        .catch(next)
})

router.get('/accounts',  (request, response, next) => {
    // TODO: потестить на юзере из ЦРМ
    const { userID } = request

    allAccounts({ userID })
        .then((items = []) => response.json({ 
            status: 200, 
            items: items.map(({ _id, name }) => ({ id: _id, name })) 
        }))
        .catch(next)
})

router.get('/accounts/:accountID',  (request, response, next) => {
    const { accountID } = request.params
    const { userID } = request

    const moment = require('moment')
    moment.locale('ru')

    // TODO: дату создания в ЧПВ
    accountById({ userID, accountID })
        .then(account => {
            if (account === null) return response
                .status(404)
                .json({ status: 404, message: 'Аккаунт не найден' })

        	const acc = account.toJSON()
        	const id = acc._id
        	delete acc._id

            acc.author = acc.author.login
            acc.created = moment(acc.created).format('DD MMMM')

        	response.json(Object.assign({ status: 200, id }, acc))
        })
        .catch(next)
})

router.put('/accounts/:accountID',  (request, response, next) => {
	const { accountID } = request.params
    const { body, userID } = request

    updateAccount({ userID, accountID, data: body })
        .then(() => response.json({ status: 200 }))
        .catch(next)
})

router.post('/accounts/:accountID/users',  (request, response, next) => {
    const { name } = request.body
    const { accountID } = request.params
    const { userID } = request

    createUser({ name, userID, accountID })
        .then(({ _id }) => response.json({ status: 200, id: _id }))
        .catch(next)
})

router.get('/accounts/:accountID/users',  (request, response, next) => {
    const { accountID, userID } = request.params
    const adminID = request.userID

    allUsers({ adminID, userID, accountID })
        .then(items => response.json({ 
            status: 200, 
            items: items ? 
                items.map(({ _id, name }) => ({ id: _id, name })) 
                :
                []
        }))
        .catch(next)
})

router.get('/accounts/:accountID/users/:userID',  (request, response, next) => {
    const { accountID, userID } = request.params
    const adminID = request.userID

    userById({ adminID, userID, accountID })
        .then(user => {
            if (user === null) return response
                .status(404)
                .json({ status: 404, message: 'Учётная запись не найдена' })

            const usr = user.toJSON()
            const id = usr._id
            delete usr._id

            response.json(Object.assign({ status: 200, id }, usr))
        })
        .catch(next)
})

router.put('/accounts/:accountID/users/:userID',  (request, response, next) => {
    const { accountID, userID } = request.params
    const adminID = request.userID

    updateUser({ adminID, userID, accountID, data: request.body })
        .then(() => response.json({ status: 200 }))
        .catch(next)
})

router.put('/accounts/:accountID/users/:userID/reset.password',  (request, response, next) => {
    const { accountID, userID } = request.params
    const adminID = request.userID

    resetPassword({ adminID, userID, accountID })
        .then( password => response.json({ status: 200, password }))
        .catch(next)
})

router.all('*', (request, response) => response.status(404).json({
    status: 404,
    message: 'Здесь ничего нет'
}))

module.exports = router