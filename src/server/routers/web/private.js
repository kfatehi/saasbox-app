var router = require('express').Router()
  , authorizeUser = require('../../middleware/authorizeUser')

router.use(authorizeUser)

router.get('/account', function(req, res) {
  res.render('my_account')
})

router.get('/apps', function(req, res) {
  req.user.populate('instances', function(err) {
    res.render('my_apps')
  })
})

router.get('/support', function(req, res) {
  res.render('support')
})

require('./admin')(router)

module.exports = router