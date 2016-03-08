[![Dependency Status](https://img.shields.io/david/fewieden/CrossBot.svg)](https://david-dm.org/fewieden/CrossBot)
[![MIT Licensed](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

# CrossBot
IRC Bot for Twitch.tv

## Setup
* Install npm (Node package manager)
* Open a console, change to the directory where the package.json file is stored
* > npm install
* You need to edit the config.js and fill in your channelname, botname and the oauth token of your bot account. You can get the token from [TwitchApps](https://twitchapps.com/tmi/ "Get your token now.")
* Edit/Remove the commands you don't like
* For the sound system you have to put your sound files into /public/sfx directory. Then add those sounds into config.js

## Run
* To run your bot, you have to type the following command into a console
> npm start

## Usage
* Type !help, !stack, !raffle, !uptime or !sfx SOUNDNAME into your Twitch.tv chat
