const toObjectId = require('mongoose').Types.ObjectId
const { Account } = require('../schema')

function createAccount({ name, author }) {
	const newAccount = new Account({ name, author });
	return newAccount.save()
}

function updateAccount({ id, data }) {
	return Account.update({ _id: id }, data)
}

function allAccounts(query = {}) {
	return Account.find(query, { name: 1 })
		.then(
			accounts => accounts.map(({_id, name}) => ({ id: _id, name }))
		)
}

function accountById({ id }) {
	return Account.findOne({ _id: toObjectId(id) })	
}


module.exports = { 
	createAccount, updateAccount, allAccounts, accountById 
}