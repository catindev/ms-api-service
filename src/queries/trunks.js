const toObjectId = require('mongoose').Types.ObjectId
const { Trunk, Admin, User, Account, Session } = require('../schema')
const { haveAccessToAccount } = require('./accounts')
const CustomError = require('../utils/error')
const md5 = require('../utils/md5')

async function createTrunk({ accountID, adminID, name, phone }) {
    if (typeof accountID === 'string') accountID = toObjectId(accountID)
    if (typeof adminID === 'string') adminID = toObjectId(adminID)

    const canCreate = await haveAccessToAccount({ admin: adminID, account: accountID })
    if (canCreate === false)
        throw new CustomError('У вас недостаточно прав доступа для этого действия', 403)

    const newTrunk = new Trunk({ name, phone, account: accountID });
    return newTrunk.save()
}

async function allTrunks({ adminID, accountID, query = {} }) {
    if (typeof accountID === 'string') accountID = toObjectId(accountID)
    if (typeof adminID === 'string') adminID = toObjectId(adminID)

    const canFetch = await haveAccessToAccount({ admin: adminID, account: accountID })  
    if (canFetch === false)
        throw new CustomError('У вас недостаточно прав доступа для этого действия', 403)

    return Trunk.find(
        Object.assign({ account: accountID }, query), { name: 1, phone: 1, active: 1 }
    )
}

async function updateTrunk({ adminID, accountID, trunkID, data }) {
    if (typeof accountID === 'string') accountID = toObjectId(accountID)
    if (typeof trunkID === 'string') trunkID = toObjectId(trunkID)
    if (typeof adminID === 'string') adminID = toObjectId(adminID)

    const canUpdate = await haveAccessToAccount({ admin: adminID, account: accountID })  
    if (canUpdate === false)
        throw new CustomError('У вас недостаточно прав доступа для этого действия', 403)

    if ('phone' in data) data.phone = formatNumber(data.phone)

    return Trunk.update({ _id: trunkID }, data)
}

module.exports = { createTrunk, allTrunks, updateTrunk }