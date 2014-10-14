var config = require('./etc/config')
  , logger = require('./src/logger')
  , mongoose = require('mongoose')
  , cluster = require('./src/cluster')
  , enforcer = require('./src/enforcer')
  , app = require('./')

cluster(function() {
  mongoose.connect(config.mongodb);
  mongoose.connection.on('error', logger.error.bind(logger, 'err '+config.mongodb));
  var context = {
    Account: app.models.Accoun,
  }
  enforcer.activate('daily', context);
  enforcer.activate('monthly', context);
}, 1)