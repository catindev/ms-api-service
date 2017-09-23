const toObjectId = require('mongoose').Types.ObjectId
const { Admin } = require('../schema')

function createAdmin(data) {
	const newAdmin = new Admin(data);
	return newAdmin.save()
}

function adminById({ userID }) {
	if (typeof userID === 'string') userID = toObjectId(userID)
	return Admin.findOne({ _id: userID }, { __v: false, password: false })
}


module.exports = {
	createAdmin, adminById
}