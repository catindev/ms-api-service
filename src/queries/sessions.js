const { Session, User, Admin } = require('../schema')
const md5 = require('../utils/md5')
const CustomError = require('../utils/error')
const formatNumber = require('../utils/formatNumber')


async function SignIn({ login, password, type = 'admin' }) {
	let user, admin
	const passwordHash = md5(`${password}wow! much salt!`)

	if (type === 'admin') {
		admin = await Admin.findOne({ login, password: passwordHash })
		if (admin === null) throw new CustomError('Неверный логин или пароль', 400)
	}

	if (type === 'user') {
		user = await User.findOne({
		    password: passwordHash,
		    $or: [
		      { email: login.toLowerCase() },
		      { phones: formatNumber(login, false) }
		    ]			
		})
		if (user === null) throw new CustomError('Неверный логин или пароль', 400)
	}

	const token = md5(`${ new Date().getTime() }@${ passwordHash }@${ Math.random() }@woop!woop`)
	const newSession = new Session({ user, admin, token })
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
		.populate('user admin')
		.exec()
		
	if (session === null) throw new CustomError('Сессия не найдена', 403)

	const { user, admin } = session

	if (user) return removeSystemKeys(user)
	return removeSystemKeys(admin)		
}

module.exports = { SignIn, SignOut, getTokenOwner }