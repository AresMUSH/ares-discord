echo "Are you sure the discord bot is not already running?"
select yn in "Yes" "No"; do
    case $yn in
        Yes )  
      echo "Starting bot."
      npm ci
	    rm nohup.out
	    nohup node bot.js&
	    echo "Bot started."
	    break;;
        No ) echo "Check to be sure the bot isn't running using 'ps -aux | grep bot.js' before restarting it. Otherwise you will end up with dueling bots."
	    exit;;
    esac
done


