module.exports = {
  apps : [{
    name: 'angular-app',
    script: 'server.ts',
    instances: 1,
    autorestart: true,
    watch: false,
    interpreter: 'node',
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 4200 // Change to your desired port
    }
  }]
};
