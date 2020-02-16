## Create a Discord App

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

## Add the Bot User To Your Server

Substitute your client ID (that you got in step 10 above) into this URL and go there in your browser:

https://discordapp.com/oauth2/authorize?&client_id=YOUR_CLIENT_ID_HERE&scope=bot&permissions=2048

You'll see a prompt asking you to connect your bot.  Select your game's discord server and click Authorize.

![Add Bot](images/addbot.png)

> **NOTE:** You'll need administrator permissions on the discord server to authorize a bot.

## Install the Bot

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

* **url**: This is the URL for the engine API port.  Typically it would be `https://yourmush.com:4203`.  Note that the port (4203) is your engine API port from server.yml, not the port you usually connect to from a MUSH client.
* **bot_token**: This is the bot token that you got from "Click to Reveal Token" when you created the bot.
* **api_token**: Make up a long password for your game.  This prevents random people from adding junk to your channels. The website [Guid Generator](https://www.guidgenerator.com/) is good for making up a password.

> **Note:** Make sure your config options are in quotes.

## Start the Bot

1. Log into your game's server shell.
2. Start the bot:

```
cd ares-discord
node bot.js&
```

You only need to do this the first time.  The installer sets it up so it'll start automatically when the server restarts.

## Add the Web Hooks

You'll need to set up a web hook in your Discord server for **each** MUSH channel you want to hook up to discord.

1. Go to the "Server Settings" panel of your Discord server.
2. Select "Webhooks".
3. Select "Create Webhook".
4. Give the hook a name (like "Ares Link"), and select the channel you want to hook it up to.
5. Copy the "Webhook URL".  You'll need this in the next step.

![Add Bot](images/webhook.png)


## Edit the Game Config

1. Log into your web portal with an admin character.
2. Go to Admin -> Setup.
3. Edit `secrets.yml`.
4. Add or edit a config option named 'discord'.

Here are the config options:

* **api_token**: This must match the `api_token` option that you put in the config.json file when installing the bot.
* **webhooks**: A list of web hooks.  For each hook, you must list the name of the MUSH channel, the name of the corresponding Discord channel, and the webhook URL from the previous step.  Remember that each channel needs a different webhook URL.

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
