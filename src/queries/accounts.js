const { Account } = require('../schema')

function createAccount({ name, author }) {
	const newAccount = new Account({ name, author });
	return newAccount.save()
}

function updateAccount({ id, data }) {
	return Account.update({ _id: id }, data)
}


module.exports = { createAccount, updateAccount }