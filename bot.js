var Discord = require('discord.js');
var winston = require('winston');
var config = require('./config.json');
var axios = require('axios')

// Configure logger settings

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'bot.log', level: 'info', maxsize: '10000' }),
    new winston.transports.Console( { colorize: true })
  ]
});

// Initialize Discord Bot
var bot = new Discord.Client();

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ' + bot.user.tag);
});
bot.on('message', message => {
 
    // don't respond to ourselves, to web hooks, or to bots
    if (message.author == bot.user) { return; }
    if (bot.discriminator == '0000') { return; }
    if (message.author.bot === true) { return; }

    logger.info(`Handling message from ${message.author.username}`)
    if (message.attachments.array().length > 0) {
      post = message.attachments.reduce((accumulate, attachment) => 
        `${accumulate}%r${attachment.url}`,`${post}%r- Attachments -`)
    }  
    else {
      post = message.cleanContent;
    }   
    var nickname = "";  
    if (message.member) {
      nickname = message.member.nickname;
    }
    axios.post(config.url + '/webhook', {
    		
          cmd: 'discord',
          token: config.api_token,
          message: post,
          channel: message.channel.name,
          user: message.author.username,
          userid: message.author.discriminator,
          nickname: nickname
    	})
      .catch(function (error) {
        logger.info(error);
      });
});

bot.login(config.bot_token);
