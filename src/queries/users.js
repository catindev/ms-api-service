const toObjectId = require('mongoose').Types.ObjectId
const { Admin, User, Account } = require('../schema')
const { isAccountAuthor } = require('./accounts')
const CustomError = require('../utils/error')


async function createUser({ accountID, userID, name }) {
	if (typeof accountID === 'string') accountID = toObjectId(accountID)
	if (typeof userID === 'string') userID = toObjectId(userID)

	const canCreate = await isAccountAuthor({ userID, accountID })
	if (canCreate === false) 
		throw new CustomError('У вас недостаточно прав доступа для этого действия', 403)

	const newUser = new User({ name, account: accountID });
	return newUser.save()		
}

async function userById({ adminID, accountID, userID }) {
    if (typeof accountID === 'string') accountID = toObjectId(accountID)
    if (typeof userID === 'string') userID = toObjectId(userID)
    if (typeof adminID === 'string') adminID = toObjectId(adminID)	

    const admin = await Admin.findOne({ _id: adminID })
	const query = admin.access === 'partner' ? 
        { _id: accountID, author: adminID } : { _id: accountID }

    const account = await Account.findOne(query)
    if (account === null) return account

    return User.findOne({ _id: userID }, { __v: false, password: false })	
}

async function allUsers({ adminID, accountID, userID, query = {} }) {
    if (typeof accountID === 'string') accountID = toObjectId(accountID)
    if (typeof userID === 'string') userID = toObjectId(userID)
    if (typeof adminID === 'string') adminID = toObjectId(adminID)

    const admin = await Admin.findOne({ _id: adminID })
	const accountQuery = admin.access === 'partner' ? 
        { _id: accountID, author: adminID } : { _id: accountID }

    const accounts = await Account.find(accountQuery, { name: 1 })

    if (accounts && accounts.length > 0) {
    	const usersQuery = Object.assign({ account: accountID }, query)
    	return User.find(usersQuery, { name: 1 })
    }

    return []	
}


module.exports = { createUser, userById, allUsers }