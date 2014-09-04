module.exports = function(scope, argv) {
  return {
    install: function (done) {
      scope.applyConfig({
        create: {
          Image: "niallo/strider:latest",
          Env: {
            /* https://github.com/Strider-CD/strider#configuring */
          },
          Memory: 512000000
        },
        start: {
          Binds: scope.managedVolumes({
            home: '/home/strider'
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
              url: "http://"+ip+":3000",
              email: "user@example.com",
              password: Math.random().toString(24).substring(2)
            },
            ssh: {
              port: 22,
              username: "strider",
              password: Math.random().toString(24).substring(2),
              notes: "Root access is prohibited by default through ssh. To get root access login as strider and su to root."
            }
          });
        });
      });
    }
  }
}
