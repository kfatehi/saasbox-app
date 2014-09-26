var redisModel = require('./model')
var redis = require('../../../../../redis')
var authorizeAdmin = require('../../../../middleware/authorizeAdmin')
var Promise = require('bluebird')

redisModel.setClient(redis.client)

module.exports = function (r) {
  r.route('/jobs')
  .all(authorizeAdmin)
  .get(sendJobs)
}

var sendJobs = function (req, res, next) {
  requestActive().then(function(data){
    res.json(data);
  }).error(next).catch(next)
}

var requestActive = function(req, res){
  return new Promise(function(resolve, reject) {
    redisModel.getStatus("active")
    .then(redisModel.getJobsInList)
    .then(redisModel.formatKeys)
    .then(redisModel.getProgressForKeys)
    .then(function(keyList){
      return redisModel.getStatusCounts().then(function(countObject){
        var model = {
          keys: keyList,
          counts: countObject,
          active: true,
          type: "Active"
        };
        resolve(model);
      });
    }).error(reject).catch(reject)
  });
}
