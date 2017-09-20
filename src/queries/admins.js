const { Admin } = require('../schema')

function createAdmin(data) {
	const newAdmin = new Admin(data);
	return newAdmin.save()
}


module.exports = {
	createAdmin,
}