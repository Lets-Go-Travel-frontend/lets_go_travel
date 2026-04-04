module.exports = {
  apps: [{
    name: 'ms-veturis',
    script: 'dist/server.js', // Asumiremos compilación a dist/
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
