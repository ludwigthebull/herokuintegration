const Bot = require('pb-node');

const bot = new Bot({
  app_id: process.env.PANDORABOTS_APP_ID,
  user_key: process.env.PANDORABOTS_USER_KEY,
  botname: process.env.PANDORABOTS_BOTNAME,
  url: process.env.PANDORABOTS_URL
});

module.exports = bot;
