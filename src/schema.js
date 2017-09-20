const mongoose = require('mongoose')
const { Schema } = mongoose
const { ObjectId } = Schema.Types
const md5 = require('./utils/md5')

const Account = mongoose.model('Account', new Schema({
    name: String,
    maxWaitingTime: Number,
    maxAnswerTime: Number,
    funnelSteps: [String],
    noTargetReasons: [String],
    targetQuestion: String,
    author: { type: ObjectId, ref: 'Admin' },
    created: { type: Date, default: Date.now() }
}))


const AdminSchema = new Schema({
    login: String,
    password: String,
 	access:{ type: String, default: 'admin' },
    created: { type: Date, default: Date.now() }
})
AdminSchema.pre('save', function( next ) {
    if (!this.isModified('password')) return next()
    this.password = md5(this.password + 'wow! much salt!')
    next()
})
const Admin = mongoose.model('Admin', AdminSchema)


const Session = mongoose.model('Session', new Schema({
    account: { type: ObjectId, ref: 'Account' },
    admin: { type: ObjectId, ref: 'Admin' },    
    token: String,
    type: String,
    created: { type: Date, default: Date.now() }
}))


module.exports = {
	Admin, Account, Session,
}