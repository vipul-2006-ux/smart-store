module.exports = {
  apps: [{
    name: "smartstore-api",
    script: "./server.js",
    instances: "max",
    env_production: {
      NODE_ENV: "production"
    }
  }]
};