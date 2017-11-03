const toObjectId = require('mongoose').Types.ObjectId
const { Admin, User, Account, Session } = require('../schema')
const { haveAccessToAccount } = require('./accounts')
const CustomError = require('../utils/error')
const md5 = require('../utils/md5')
const formatNumber = require('../utils/formatNumber')

async function createUser({ accountID, adminID, name }) {
    if (typeof accountID === 'string') accountID = toObjectId(accountID)
    if (typeof adminID === 'string') adminID = toObjectId(adminID)

    const canCreate = await haveAccessToAccount({ admin: adminID, account: accountID })
    if (canCreate === false)
        throw new CustomError('У вас недостаточно прав доступа для этого действия', 403)

    const newUser = new User({ name, account: accountID });
    return newUser.save()
}

async function userById({ adminID, accountID, userID }) {
    if (typeof accountID === 'string') accountID = toObjectId(accountID)
    if (typeof userID === 'string') userID = toObjectId(userID)
    if (typeof adminID === 'string') adminID = toObjectId(adminID)

    const canFetch = await haveAccessToAccount({ admin: adminID, account: accountID })	
	if (canFetch === false)
        throw new CustomError('У вас недостаточно прав доступа для этого действия', 403)

    return User.findOne({ _id: userID }, { __v: false, password: false })
}

async function allUsers({ adminID, accountID, userID, query = {} }) {
    if (typeof accountID === 'string') accountID = toObjectId(accountID)
    if (typeof userID === 'string') userID = toObjectId(userID)
    if (typeof adminID === 'string') adminID = toObjectId(adminID)

    const canFetch = await haveAccessToAccount({ admin: adminID, account: accountID })	
	if (canFetch === false)
        throw new CustomError('У вас недостаточно прав доступа для этого действия', 403)

    return User.find(
        Object.assign({ account: accountID }, query), { name: 1 }
    )
}

async function updateUser({ adminID, accountID, userID, data }) {
    if (typeof accountID === 'string') accountID = toObjectId(accountID)
    if (typeof userID === 'string') userID = toObjectId(userID)
    if (typeof adminID === 'string') adminID = toObjectId(adminID)

    const canUpdate = await haveAccessToAccount({ admin: adminID, account: accountID })  
    if (canUpdate === false)
        throw new CustomError('У вас недостаточно прав доступа для этого действия', 403)

    if ('phones' in data) {
        data.phones = data.phones.map(formatNumber)
        const users = await User.find({ phones: { $in: data.phones } })
        if (users && users.length > 0) throw new CustomError('Номер уже используется одним из менеджеров', 400)        
    }

    return User.update({ _id: userID }, data)
}


module.exports = { createUser, userById, allUsers, updateUser }