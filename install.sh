echo "cd /home/ares/ares-discord" >> /home/ares/onboot.sh
echo "nohup node bot.js&" >> /home/ares/onboot.sh
cp config.json.default config.json
npm install
