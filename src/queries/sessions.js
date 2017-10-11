const { Session, User, Admin } = require('../schema')
const md5 = require('../utils/md5')
const CustomError = require('../utils/error')
const formatNumber = require('../utils/formatNumber')


async function SignIn({ login, password }) {
	const passwordHash = md5(`${ password }wow! much salt!`)

	const admin = await Admin.findOne({ login, password: passwordHash })
	if (admin === null) throw new CustomError('Неверный логин или пароль', 400)

	const token = md5(`${ new Date().getTime() }@${ passwordHash }@${ Math.random() }@woop!woop`)
	const newSession = new Session({ admin, token })
	newSession.save()

	return token
}


async function SignOut({ token }) {
	const { result } = await Session.findOne({ token }).remove().exec()
	return result
}


async function getTokenOwner({ token }) {

	function removeSystemKeys(original) {
		let replicant = JSON.parse(JSON.stringify(original))
		delete replicant.password
		delete replicant.__v
		return replicant
	}

	const session = await Session.findOne({ token })
		.populate('admin')
		.exec()
		
	if (session === null) throw new CustomError('Сессия не найдена', 403)

	const { admin } = session
	return removeSystemKeys(admin)		
}

module.exports = { SignIn, SignOut, getTokenOwner }