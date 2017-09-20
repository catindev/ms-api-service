const mongoose = require('mongoose')

mongoose.Promise = Promise
mongoose.connection.openUri('mongodb://localhost/ms3')

const { createAdmin } = require('./queries/admins')

createAdmin({ login: 'tv', password: '14005000' })
	.then( console.log )
	.catch( console.log )