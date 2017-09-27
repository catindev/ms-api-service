const toObjectId = require('mongoose').Types.ObjectId
const { Account, Admin } = require('../schema')
const CustomError = require('../utils/error')

function createAccount({ name, author }) {
    const newAccount = new Account({ name, author });
    return newAccount.save()
}

async function updateAccount({ userID, accountID, data }) {
    if (typeof accountID === 'string') accountID = toObjectId(accountID)
    if (typeof userID === 'string') userID = toObjectId(userID)

    const admin = await Admin.findOne({ _id: userID })

    const query = admin.access === 'partner' ? 
        { _id: accountID, author: userID } : { _id: accountID }

    return Account.update(query, data)
}

async function allAccounts({ userID, query = {} }) {
    if (typeof userID === 'string') userID = toObjectId(userID)

    const admin = await Admin.findOne({ _id: userID })

    if (admin.access === 'partner') query.author = admin._id

    const accounts = await Account.find(query, { name: 1 })

    if (accounts && accounts.length > 0) return accounts
}

async function accountById({ userID, accountID }) {
    if (typeof accountID === 'string') accountID = toObjectId(accountID)
    if (typeof userID === 'string') userID = toObjectId(userID)

    const admin = await Admin.findOne({ _id: userID })
    const query = admin.access === 'partner' ? 
        { _id: accountID, author: userID } : { _id: accountID }
            
    return Account.findOne(query, { __v: false })
            .populate('author')
            .exec()
}

async function haveAccessToAccount({ admin, account }) {
    if (typeof account === 'string') account = toObjectId(account)
    if (typeof admin === 'string') admin = toObjectId(admin)

    const { access } = await Admin.findOne({ _id: admin })
    if (access && access === 'admin') return true

    const isAccount = await Account.findOne({ _id: account, author: admin })
    return isAccount === null ? false : true
}


module.exports = {
    createAccount,
    updateAccount,
    allAccounts,
    accountById,
    haveAccessToAccount
}