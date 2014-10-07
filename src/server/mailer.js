var config = require('../../etc/config')
  , nodemailer = require('nodemailer')
  , transport = nodemailer.createTransport(config.email);

module.exports = {
  sendMail: function(opts, callback) {
    if (!opts.subject) throw new Error('no mail subject')
    if (!opts.to) throw new Error('no mail recipients')
    if (!opts.text) throw new Error('no mail body')
    transport.sendMail({
      from: 'Pillbox <no-reply@'+config.zone+'>',
      subject: 'Pillbox: '+opts.subject,
      to: opts.to,
      text: opts.text
    }, callback)
  }
}