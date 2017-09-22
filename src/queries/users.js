const toObjectId = require('mongoose').Types.ObjectId
const { Admin, User, Account } = require('../schema')
const { isAuthor } = require('./accounts')
const CustomError = require('../utils/error')


async function createUser({ accountID, userID, name }) {
	if (typeof accountID === 'string') accountID = toObjectId(accountID)
	if (typeof userID === 'string') userID = toObjectId(userID)

	const canCreate = await isAuthor({ userID, accountID })
	if (canCreate === false) 
		throw new CustomError('У вас недостаточно прав доступа для этого действия', 403)

	const newUser = new User({ name, account: accountID });
	return newUser.save()		
}


module.exports = { createUser, isAuthor }