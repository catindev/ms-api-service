const { Session } = require('../schema')

function create(data) {
	const newSession = new Session(data)
	return newSession.save()
}


module.exports = {
	create,
}