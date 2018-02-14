const TJBot = require('tjbot');
const Wit = require('node-wit')

const client = new Wit({
  accessToken: "6ZYUNU4AHWYHF46QOLDEB5ZYGPCHCWOA"
});

var hardware = ['microphone'];
var configuration = {
    robot: {
            gender: 'female'
        },
    listen: {
            language: 'en-US'
        },
    speak: {
            language: 'en-US'
        }
};
var credentials = {
    speech_to_text: {
            username: '7eb8a783-a692-4bf1-a64e-274703bb3fbc',
            password: 'QxjS0OPZp7x0'
        }
}
var tj = new TJBot(hardware, configuration, credentials);

tj.listen(onRecvText)

function onRecvText(text) {
    client.message(text).then(onRecvIntent)
}

function onRecvIntent(data) {
    console.log(data.entities.intent)
    console.log(data.entities.intent[0].value)
    // if (data.entities.intent == 'introduction') {
    // }
}
