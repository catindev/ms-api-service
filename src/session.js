const { getTokenOwner } = require('./queries/sessions')	

module.exports = (request, response, next) => {
	const { path, method } = request
	if (path === '/sessions' && method === 'POST') return next()
	if (path === '/' && method === 'GET') return next()

	const { session } = request.cookies
	const { session_token } = request.query
	const { sessionID } = request.params

	const token = session || sessionID || session_token

	if (!token) return response.status(403).json({ 
		message: 'Нет доступа. Авторизуйтесь' 
	})

	getTokenOwner({ token })
		.then(ownerID => {
			request.userID = ownerID
			next()
		})
		.catch(next)
}