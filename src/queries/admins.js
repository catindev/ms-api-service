const toObjectId = require('mongoose').Types.ObjectId
const { Admin } = require('../schema')

function createAdmin(data) {
	const newAdmin = new Admin(data);
	return newAdmin.save()
}

function adminById({ _id }) {
	if (typeof _id === 'string') _id = toObjectId(_id)
	return Admin.findOne({ _id })
}


module.exports = {
	createAdmin, adminById
}