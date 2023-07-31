const { Client, GatewayIntentBits } = require('discord.js');
const winston = require('winston');
const config = require('./config.json');
const axios = require('axios')

// Configure logger settings

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
      new winston.transports.File({ filename: 'bot.log', level: 'info', maxsize: '10000',  maxFiles: '5',
				  format: winston.format.combine(
        winston.format.colorize(),
				      winston.format.timestamp(),
				      winston.format.simple()
				  ),
				  }),
    new winston.transports.Console( { colorize: true, timestamp: true })
  ]
});

// Initialize Discord Bot
var bot = new Client( { intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent ] } );

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ' + bot.user.tag);
});
bot.on('messageCreate', message => {
  try {
    
    // don't respond to ourselves, to web hooks, or to bots
    if (message.author == bot.user) { return; }
    if (bot.discriminator == '0000') { return; }
    if (message.author.bot === true) { return; }

    var nickname = null;  
    if (message.member) {
      nickname = message.member.nickname;
    }
    logger.info(`Handling message on ${message.channel.name} from ${message.author.username} (${nickname})`);
    
    post = message.cleanContent;
    if ((message.attachments || []).size > 0) {
      post = message.attachments.reduce((accumulate, attachment) => 
        `${accumulate}%r${attachment.url}`,`${post}%r- Attachments -`)
    }  
    else {
      post = message.cleanContent;
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
    } catch (error) {
      logger.error('Unexpected error: ' + error);
    }
});
bot.on('error', function (err) {
    logger.error('Unexpected error: ' + err);
});
bot.on('uncaughtException', function (err) {
    logger.error('Caught exception: ' + err);
    throw err;
});
bot.login(config.bot_token);