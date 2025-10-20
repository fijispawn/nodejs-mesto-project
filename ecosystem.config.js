module.exports = {
  apps: [
    {
      name: "mesto-api",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],

  deploy: {
    production: {
      user: process.env.DEPLOY_USER || "user",
      host: process.env.DEPLOY_HOST || "51.250.34.72",
      ref: "origin/main",
      repo:
        process.env.DEPLOY_REPO ||
        "git@github.com:fijispawn/nodejs-mesto-project.git",
      path: process.env.DEPLOY_PATH || "/home/user/apps/mesto-api",

      ssh_options: [`-i ${process.env.DEPLOY_SSH_KEY || "~/.ssh/mesto-vm"}`],

      "pre-deploy-local":
        "set -a; [ -f .env.deploy ] && . ./.env.deploy; set +a; " +
        "ssh -i ~/.ssh/mesto-vm user@51.250.34.72 'mkdir -p /home/user/apps/mesto-api/shared' && " +
        "scp -i ~/.ssh/mesto-vm .env user@51.250.34.72:/home/user/apps/mesto-api/shared/.env",

      "post-deploy":
        "cd current && npm ci && cp ../shared/.env .env && pm2 reload ecosystem.config.js --env production",

      env: {
        NODE_ENV: "production",
      },
    },
  },
};
