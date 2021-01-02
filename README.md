The Ares Discord app is an extension for AresMUSH that lets you connect your in-game chat channels to a  [Discord](https://discordapp.com/) server.

<img src="https://github.com/AresMUSH/ares-discord/blob/master/images/game.png?raw=true" width="400" alt="Game Chat" />

<img src="https://github.com/AresMUSH/ares-discord/blob/master/images/discord.png?raw=true" width="400" alt="Discord Chat" />

Chat from the game will be sent to the Discord server using a Discord Bot.  Though it will show up with the character's name (and icon, if set), you'll see `[Bot]` next to their name to show that it's not a regular Discord user. Also, because they're not a regular Discord user, you can't PM or @mention them.

In the game, chat from Discord is indicated by a prefix (`[D]` by default).

**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Setup](#setup)
  - [Create a Discord App](#create-a-discord-app)
  - [Add the Bot User](#add-the-bot-user)
  - [Install the Bot App](#install-the-bot-app)
  - [Start the Bot App](#start-the-bot-app)
  - [Add the Web Hooks](#add-the-web-hooks)
  - [Edit the Game Config](#edit-the-game-config)
  - [Additional Config Options](#additional-config-options)
  - [Adding or Changing Channels](#adding-or-changing-channels)
- [Troubleshooting](#troubleshooting)
  - [Bot Was Working and Suddenly Stopped](#bot-was-working-and-suddenly-stopped)
  - [Bot Not Running](#bot-not-running)
  - [Bot Not Online](#bot-not-online)
  - [Bot Config Mismatch](#bot-config-mismatch)
  - [Weird Bot Errors](#weird-bot-errors)
- [Upgrades](#upgrades)

## Setup

Setting up the Discord app is a pain, requiring multiple steps.  Fortunately the setup only needs to be done once.

### Create a Discord App

First you need to create an "application" in discord that will enable your bot.

1. Go to [Discord Developer Portal](https://discordapp.com/developers/applications) and log in with your Discord account.
2. Click "New Application".
3. Give it a name, like "My Ares Connection".
4. Select the "Bot" menu.
5. Click "Add Bot".
6. Give your bot a username and optionally an icon.
7. Give the bot the "Send Messages" permission.
8. Under the bot's username is a thing that says "Click to Reveal Token."  Click that and save the token somewhere safe.  You'll need it in a minute.
9. Select the "General Information" menu.
10. Copy the "Client ID" under the app name.  You'll need that in a minute too.

> **NOTE:** Never give your bot token to anyone, as it will allow them to control your bot in potentially malicious ways.

### Add the Bot User

Next you need to add the Bot you just defined to your game's Discord server.  This will create a bot 'user' in your game's Discord.

1. Substitute your client ID (that you got in step 10 above) into this URL and go there in your browser: https://discordapp.com/oauth2/authorize?&client_id=YOUR_CLIENT_ID_HERE&scope=bot&permissions=2048
2. You'll see a prompt asking you to connect your bot.  Select your game's discord server and click Authorize.

<img src="https://github.com/AresMUSH/ares-discord/blob/master/images/addbot.png?raw=true" width="500" alt="Discord Chat" />

> **NOTE:** You'll need administrator permissions on the discord server to authorize a bot.

### Install the Bot App

Now you can install the code that makes the bot run.  This is a tiny app that runs alongside the MUSH on your game server.

1. Log into your game's server shell.
2. Clone this repository using `git clone https://github.com/AresMUSH/ares-discord.git`.
3. Run the installer:

```
cd ares-discord
chmod +x install.sh
./install.sh
```

4. Edit `config.json` using your favorite text editor (`nano config.json` is a good choice if you don't have a favorite).

Here are the config options:

* **url**: This is your game's API endpoint.  For typical installs with https enabled it would be `https://YOUR_WEB_PORTAL/api`.
* **bot_token**: This is the bot token that you got from "Click to Reveal Token" when you created the bot.
* **api_token**: Make up a long password for your game.  This prevents random people from adding junk to your channels. The website [Guid Generator](https://www.guidgenerator.com/) is good for making up a password. Avoid symbols (other than `-` in your token password, as some of them can mess up the file parsing when used for the discord bot.)

> **Note:** Make sure your config options are in quotes.

### Start the Bot App

Once the bot code is installed, you need to start it up.

1. Log into your game's server shell.
2. Start the bot:

```
cd ares-discord
nohup node bot.js&
```

You only need to do this the first time.  The installer sets it up so it'll start automatically when the server restarts.

### Add the Web Hooks

You'll need to set up a web hook in your Discord server for **each** MUSH channel you want to hook up to discord.

1. Go to the "Server Settings" panel of your Discord server.
2. Select "Webhooks".
3. Select "Create Webhook".
4. Give the hook a name (like "Ares Link"), and select the channel you want to hook it up to.
5. Copy the "Webhook URL".  You'll need this in the next step.

<img src="https://github.com/AresMUSH/ares-discord/blob/master/images/webhook.png?raw=true" width="500" alt="Discord Chat" />


### Edit the Game Config

Finally you can update your game's configuration with the discord info.

1. Log into your web portal with an admin character.
2. Go to Admin -> Setup.
3. Edit `secrets.yml`.
4. Add or edit a config option named 'discord'.

Here are the config options:

* **`api_token`**: This must match the `api_token` option that you put in the config.json file when installing the bot.  (Be sure to use the *api* token, not the bot token.)
* **`webhooks`**: A list of web hooks.  For each hook, you must list the name of the MUSH channel, the name of the corresponding Discord channel, and the webhook URL from the previous step.  Remember that each channel needs a different webhook URL.

Here's an example:

```
    api_token: '123'
    webhooks:
      - 
        mush_channel: chat
        discord_channel: lobby
        webhook_url: 'https://discordapp.com/api/webhooks/WEBHOOK1'
      -
        mush_channel: sports
        discord_channel: sports
        webhook_url: 'https://discordapp.com/api/webhooks/WEBHOOK2'

```
### Additional Config Options

In `channels.yml` you can set up two additional config options:

* **`discord_prefix`** - This is the prefix that shows up on the in-game chat to indicate that the message came from Discord.
* **`discord_gravatar_style`** - If the player doesn't have an icon, the game will use a randomly-assigned one from Gravatar.  Gravatar supports [various styles](https://en.gravatar.com/site/implement/images/) such as 'robohash' (robots), 'retro' (blocky video game things),  'identicon' (geometric patterns) and more.

### Adding or Changing Channels

If you ever want to add extra channels or change how your channels are connected, you can add, edit or delete the webhooks in your Discord server settings.  Then just edit the MUSH configuration to match.

## Troubleshooting

If game chat is not showing up in Discord:

- Make sure the webhook URL matches the one you configured in Discord.

If Discord chat is not showing up in game, there are a few common issues:

### Bot Was Working and Suddenly Stopped

If your bot was working fine and suddenly stopped and nothing else changed, it could be that Discord reset your bot's token.  It does this occasionally for reasons unknown. (My suspicion is that it's just a test to see if anyone's actually using the bot for anything.)

1. Go to your [Discord Developer Portal](https://discordapp.com/developers/applications) and log in with your Discord account.
2. Select your Ares bot.
3. Click the "Bot" tab.
4. Click "Show Token" under your bot's username.
5. Make sure it's the same token you have in your ares-discord/config.json file.  If not, update the config file and restart the bot.

```
cd ares-discord
nohup node bot.js&
```
We've also seen Discord reset the bot's permissions randomly, so make sure it has the "Send Messages" permission checked.

### Bot Not Running

Make sure the bot is running on your game server.

Type `ps -aux | grep node` in the server shell and you should see an entry like this:

    ares      1234  0.0  1.8 1089216 37520 ?       Sl   Jul24   2:40 node bot.js

If the bot is not running, restart it:

```
cd ares-discord
nohup node bot.js&
```

### Bot Not Online

Make sure the Ares Link bot is visible in the "Online" list of your Discord channel.

<img src="https://github.com/AresMUSH/ares-discord/blob/master/images/botlink.png?raw=true" width="500" alt="Discord Bot" />


If it isn't, walk through the "Add the Bot User" steps again to check that your bot is set up correctly.

Also make sure your bot has the necessary Discord roles for the channels you want it to work on.

### Bot Config Mismatch

If the bot is running and online, double-check the settings in your bot configuration file (`config.json`) and game secrets file.  Pay particular attention to:

- Making sure the API key and game URL match.
- Making sure the channel names match exactly.

### Weird Bot Errors

If everything else is working, check the game log and the bot log (`ares-discord/bot##.log` - look for the highest numbered log) for any weird errors.


## Upgrades

If you ever need to upgrade your bot, here are the steps:

To upgrade the bot, log into your server shell and run `ps -aux | grep node`. You should see a line like this with "node bot.js" at the end:


    ares     1234  0.0  1.2 811652 25792 ?        Sl   01:01   0:02 node bot.js

The number in the second column is the process id. Stop the bot by typing:

    kill -9 <process ID>

Then do this to upgrade the bot code:

    cd ares-discord
    git pull
    npm install

Finally, restart the bot:

    nohup node bot.js&