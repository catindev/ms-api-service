const { Admin } = require('../schema')

function create(data) {
	const newAdmin = new Admin(data);
	return newAdmin.save()
		.then(console.log)
		.catch(console.log)
}


module.exports = {
	create,
}