const mongoose = require('mongoose')
const { Schema } = mongoose
const { ObjectId } = Schema.Types
const md5 = require('./utils/md5')

function hidePassword( next ) {
    if (!this.isModified('password')) return next()
    this.password = md5(`${this.password}wow! much salt!`)
    next()
}

const Log = mongoose.model('Log', new Schema({
    level: String,
    who: { type: ObjectId, ref: 'Session' },
    when: { type: Date, expires: 1209600, default: Date.now() },
    what: String,
    details: String,
}))


const Account = mongoose.model('Account', new Schema({
    name: String,
    maxWaitingTime: { type: Number, default: 12000 },
    maxConversationTime: { type: Number, default: 120000 },
    funnelSteps: [String],
    noTargetReasons: [String],
    targetQuestion: { type: String, default: 'Клиент интересовался услугами вашей компании?' },
    author: { type: ObjectId, ref: 'Admin' },
    created: { type: Date, default: Date.now() }
}))


const AdminSchema = new Schema({
    login: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
 	access:{ type: String, enum: ['boss', 'manager'], default: 'admin',  },
    created: { type: Date, default: Date.now() }
})
AdminSchema.pre('save', hidePassword)
const Admin = mongoose.model('Admin', AdminSchema)


const Session = mongoose.model('Session', new Schema({
    user: { type: ObjectId, ref: 'User' },
    admin: { type: ObjectId, ref: 'Admin' },    
    token: String,
    created: { type: Date, default: Date.now() }
}))


const UserSchema = new Schema({
    account: { type: ObjectId, ref: 'Account' },
    created: { type: Date, default: Date.now() },
    access: { type: String, enum: ['boss', 'manager'], default: 'manager' },
    name: String,
    phones: [String],
    email: String,
    password: String
})

UserSchema.pre('save', hidePassword)
const User = mongoose.model('User', UserSchema)


module.exports = {
	Log, Admin, Account, Session, User
}