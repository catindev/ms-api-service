const mongoose = require('mongoose')

mongoose.Promise = Promise
mongoose.connection.openUri('mongodb://localhost/ms3')

const { createAdmin } = require('./queries/admins')

createAdmin({ login: 'test', password: '111', access: 'partner' })
	.then( console.log )
	.catch( console.log )