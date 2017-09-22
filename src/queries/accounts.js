const toObjectId = require('mongoose').Types.ObjectId
const { Account, Admin } = require('../schema')

function createAccount({ name, author }) {
	const newAccount = new Account({ name, author });
	return newAccount.save()
}

async function updateAccount({ userID, _id, data }) {
	const adminID = toObjectId(userID)

	const admin = await Admin.findOne({ _id: adminID })

	const query = admin.access === 'partner' ?
		{ _id, author: adminID }
		:
		{ _id }

	return Account.update(query, data)
}

async function allAccounts({ userID, query = {} }) {
	const admin = await Admin.findOne({ _id: toObjectId(userID) })
	
	if (admin.access === 'partner') query.author = admin._id

	return await Account.find(query, { name: 1 })
		.then(accounts => {
				if (accounts && accounts.length > 0) 
					return accounts.map(({_id, name}) => ({ id: _id, name }))
				return accounts
			})
}

function accountById({ id }) {
	return Account.findOne({ _id: toObjectId(id) })	
}


module.exports = { 
	createAccount, updateAccount, allAccounts, accountById 
}