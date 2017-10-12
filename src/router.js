const router = require('express').Router()
const { createAccount, allAccounts, accountById, updateAccount } = require('./queries/accounts')
const { createUser, userById, allUsers, updateUser, resetPassword } = require('./queries/users')
const { createTrunk, allTrunks, updateTrunk } = require('./queries/trunks')

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
    const author = request.adminID

    createAccount({ name, author })
        .then(({ _id }) => response.json({ status: 200, id: _id }))
        .catch(next)
})

router.get('/accounts',  (request, response, next) => {
    // TODO: потестить на юзере из ЦРМ
    const { adminID } = request

    allAccounts({ adminID })
        .then((items = []) => response.json({ 
            status: 200, 
            items: items.map(({ _id, name }) => ({ id: _id, name })) 
        }))
        .catch(next)
})

router.get('/accounts/:accountID',  (request, response, next) => {
    const { accountID } = request.params
    const { adminID } = request

    const moment = require('moment')
    moment.locale('ru')

    // TODO: дату создания в ЧПВ
    accountById({ adminID, accountID })
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
    const { body, adminID } = request

    updateAccount({ adminID, accountID, data: body })
        .then(() => response.json({ status: 200 }))
        .catch(next)
})

router.post('/accounts/:accountID/users',  (request, response, next) => {
    const { name } = request.body
    const { accountID } = request.params
    const { adminID } = request

    createUser({ name, adminID, accountID })
        .then(({ _id }) => response.json({ status: 200, id: _id }))
        .catch(next)
})

router.get('/accounts/:accountID/users',  (request, response, next) => {
    const { accountID, userID } = request.params
    const { adminID } = request

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
    const { adminID } = request

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
    const { adminID } = request

    updateUser({ adminID, userID, accountID, data: request.body })
        .then(() => response.json({ status: 200 }))
        .catch(next)
})

router.put('/accounts/:accountID/users/:userID/reset.password',  (request, response, next) => {
    const { accountID, userID } = request.params
    const { adminID } = request

    resetPassword({ adminID, userID, accountID })
        .then( password => response.json({ status: 200, password }))
        .catch(next)
})

router.post('/accounts/:accountID/trunks',  (request, response, next) => {
    const { name, phone } = request.body
    const { accountID } = request.params
    const { adminID } = request

    if (!name) return response.status(400).json({
        status:400,
        message: "Не заполнено название транка",
        fields: [ "name" ]
    })

    if (!phone) return response.status(400).json({
        status:400,
        message: "Не заполнен номер транка",
        fields: [ "phone" ]
    })

    createTrunk({ name, phone, adminID, accountID })
        .then(({ _id }) => response.json({ status: 200, id: _id }))
        .catch(next)
})

router.get('/accounts/:accountID/trunks',  (request, response, next) => {
    const { accountID } = request.params
    const { adminID } = request

    allTrunks({ adminID, accountID })
        .then((items = []) => response.json({ 
            status: 200, 
            items: items ? 
                items.map(({ _id, name, phone, active }) => ({ id: _id, name, phone, active })) 
                :
                []
        }))
        .catch(next)
})

router.put('/accounts/:accountID/trunks/:trunkID',  (request, response, next) => {
    const { accountID, trunkID } = request.params
    const { adminID, body } = request

    updateTrunk({ adminID, trunkID, accountID, data: body })
        .then(() => response.json({ status: 200 }))
        .catch(next)
})

router.all('*', (request, response) => response.status(404).json({
    status: 404,
    message: 'Здесь ничего нет'
}))

module.exports = router