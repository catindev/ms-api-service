const { adminById } = require('../queries/admins')

module.exports = function isCurrentUserAdmin(request, response, next) {
	const { userID } = request
    adminById({ userID })
        .then(admin => {
            if (admin === null) return response.status(403).json({
                status: 403,
                message: 'У вас недостаточно прав доступа для этого действия'
            })

            next()
        })
        .catch(next)
}