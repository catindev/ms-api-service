const { getTokenOwner } = require('../queries/sessions')

module.exports = (request, response, next) => {
    const { path, method } = request
    if (path === '/session' && method === 'POST') return next()
    if (path === '/' && method === 'GET') return next()

    const { session } = request.cookies
    const { sessionToken } = request.params
    const { session_token } = request.query

    const token = session || sessionToken || session_token

    if (!token) return response.status(403).json({
        status: 403,
        message: 'Нет доступа. Авторизуйтесь'
    })

    getTokenOwner({ token })
        .then(owner => {
            request.userID = owner._id
            next()
        })
        .catch(next)
}