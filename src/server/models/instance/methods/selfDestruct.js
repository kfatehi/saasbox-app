var getAccountBalance = require('../../../../account_balance')
  , vpsRemoverQueue = require('../../../../queues').vpsRemover

module.exports = function(done) {
  this.populate('account', function(err, instance) {
    if (err) return done(err);
    instance.account.update({
      balance: getAccountBalance(instance.account, instance)
    }, function(err) {
      if (err) {
        logger.error(err.stack);
        return done(err);
      } else {
        instance.remove(function(err) {
          if (err) return done(err);
          var vpsId = null;
          try {
            vpsId = instance.agent.vps.id
          } catch (e) {}
          vpsRemoverQueue.add({
            cloudProvider: instance.cloudProvider,
            dnsRecords: [ instance.agent.fqdn, instance.fqdn ],
            vps: vpsId
          })
          instance.socketEmit({ destroyed: true })
          instance.account.sendInstanceDeletedEmail(instance)
          done(err);
        })
      }
    });
  })
}
