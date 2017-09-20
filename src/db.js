const mongoose = require('mongoose')

mongoose.Promise = Promise

mongoose.connection.openUri('mongodb://localhost/ms3')
	.once('open', () => console.log('MongoDB connected'))
	.on('close', () => {
		console.log('MongoDB connection closed')
		process.exit(0)
	})
	.on('error', (error) => console.warn('Warning', error))

module.exports = mongoose
