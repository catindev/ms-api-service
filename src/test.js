const mongoose = require('mongoose')

mongoose.Promise = Promise
mongoose.connection.openUri('mongodb://localhost/ms3')
  .once('open', () => console.log('Good to go !'))
  .on('error', (error) => {
    console.warn('Warning', error);
  });
  

const { create } = require('./mutations/admins')

create({ login: 'testAdmin', password: '123' })
	.then( console.log )
	.catch( console.log )
