var Queue = require('bull');
var agentCreation = {
  jobQueue: Queue('agent_creation:jobs', 6379, '127.0.0.1'),
  msgQueue: Queue('agent_creation:message', 6379, '127.0.0.1')
}

agentCreation.jobQueue.process(function(job, done){
  console.log('Received job from app server: ', job.data);

  var progress = 0;
  // do some stuff
  var interval = setInterval(function() {
    progress += 10;
    console.log('progress', progress);
    job.progress(progress)
    if (progress === 100)
      clearInterval(interval);
  }, 1000)

  // you got an ip address, give it back so the dns can start to propagate
  agentCreation.msgQueue.add({
    owner: job.data.owner,
    slug: job.data.slug,
    ip: '127.0.0.1',
    status: 'got ip'
  })

  // now kick off ansible, start sending me status updates about it
  done();
});

console.log('waiting for jobs');
