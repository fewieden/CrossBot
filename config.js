/**
 * Created by fewieden on 28.02.16.
 */
var channel = "CHANNELNAME";

var config = {
    channel: channel,
    options: {
        options: {
            debug: true
        },
        connection: {
            cluster: "chat",
            reconnect: true,
            secure: true
        },
        identity: {
            username: "BOTNAME",
            password: "oauth:BOTOAUTHTOKEN"
        },
        channels: ["#"+channel]
    },
    sounds: {
        default: {
            index: 0,
            file: "test.mp3"
        },
        test: {
            index: 1,
            file: "test.mp3",
            volume: 0.5
        }
    }
};

module.exports = config;