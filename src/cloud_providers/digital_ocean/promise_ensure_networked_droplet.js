var Promise = require('bluebird')
var _ = require('lodash')
var backoff = require('backoff')
var logger = require('../../logger')

module.exports = function(instance, client, options) {
  return function(new_droplet_payload) {
    return new Promise(function(resolve, reject){

      var waitForNetwork = function(droplet) {
        return new Promise(function(resolve, reject) {

          var fibonacciBackoff = backoff.fibonacci({
            randomisationFactor: 0,
            initialDelay: 1000,
            maxDelay: 120000
          });

          var check = function(number, delay) {
            logger.info('checking droplet network', droplet.id, 'backoff:', number + ' ' + delay + 'ms');
            client.fetchDroplet(droplet.id).then(function(droplet) {
              try {
                var ip = _.find(droplet.networks.v4, { type: 'public' }).ip_address
                if (ip) {
                  logger.info("found ip!", ip)
                  fibonacciBackoff.reset()
                  resolve(droplet);
                }
              } catch (e) {}
            })
          }

          fibonacciBackoff.on('backoff', function(number, delay) {
            // Do something when backoff starts, e.g. show to the
            // user the delay before next reconnection attempt.
          });

          var actedOnDelay = false;

          fibonacciBackoff.on('ready', function(number, delay) {
            if (options.onDelayed && ! actedOnDelay) {
              var time = options.onDelayed.time;
              if (delay > time) {
                var explanation = 'Still waiting for Digital Ocean. You are not being charged.'
                options.onDelayed.action(explanation)
                actedOnDelay = true;
              }
            }
            // Do something when backoff ends, e.g. retry a failed
            // operation (DNS lookup, API call, etc.). If it fails
            // again then backoff, otherwise reset the backoff
            // instance.
            check(number, delay)
            fibonacciBackoff.backoff();
          });

          fibonacciBackoff.backoff();

        })
      }

      var promise = null;
      var droplet = instance.agent.vps
      if (droplet) {
        logger.info("vps exists")
        promise = client.fetchDroplet(droplet.id)
      } else {
        logger.info("no vps exists, creating it")
        promise = client.createDroplet(new_droplet_payload)
      }
      promise
      .then(promiseUpdateAgentVps(instance))
      .then(waitForNetwork)
      .then(promiseUpdateAgentVps(instance))
      .then(resolve)
      .catch(reject)
      .error(reject)
    })
  }
}


function promiseUpdateAgentVps(instance) {
  return function (vps) {
    return new Promise(function(resolve, reject) {
      instance.agent.vps = vps
      instance.update({ agent: instance.agent }, function(err) {
        if (err) return reject(err);
        else return resolve(vps)
      })
    })
  }
}
