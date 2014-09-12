module.exports = function(scope, argv) {
  return {
    install: function (done) {
      scope.applyConfig({
        create: {
          Image: "wordpress/wordpress:latest",
          Env: {
            SECRET_KEY: argv.secret,
            SENTRY_URL_PREFIX: "https://"+argv.fqdn
            /* https://github.com/slafs/sentry-docker#available-environment-variables */
          },
          Memory: <%= memory %>
        },
        start: {
          Binds: scope.managedVolumes({
            sentry: '/data'
          }),
        }
      }, function (err) {
        if (err) throw err;
        scope.inspectContainer(function (err, data) {
          var ip = data.NetworkSettings.IPAddress;
          done(err, {
            running: data.State.Running,
            ip_address: ip,
            ports: data.NetworkSettings.Ports,
            app: {
              url: "http://"+ip+":3000"
            }
          });
        });
      });
    }
  }
}
