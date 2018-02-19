const TJBot = require('tjbot');
const wit = require('node-wit')

const client = new wit.Wit({
  accessToken: "6ZYUNU4AHWYHF46QOLDEB5ZYGPCHCWOA"
});

var hardware = ['led','microphone','camera','speaker'];
var configuration = {
	log:	{
			level: 'verbose'
		},
    robot: {
            gender: 'female'
        },
    listen: {
            language: 'en-US'
        },

	speak: {
		language: 'en-US',
		voice: undefined,
		speakerDeviceId: "plughw:0,1"
	},
};
var credentials = {
    speech_to_text: {
            username: '7eb8a783-a692-4bf1-a64e-274703bb3fbc',
            password: 'QxjS0OPZp7x0'
        },
 	visual_recognition:  {
	api_key: 'bbd810a79f89a54db9c4c8d0a8dd4db4dff610e2'
	},
 	language_translator: {
			username: '9c13599a-cc78-43ea-ae8e-0d0a50ecab15',
			password: '1AHcVnvLl3Jw'
		},
	text_to_speech: {
    username: '406ce53d-b021-4182-b868-ab3f6fa730dc',
    password: '34wvmTr12ex4'
		}
}
var tj = new TJBot(hardware, configuration, credentials);
//tj.shine('red');

//tj.listen(onRecvText)
//tj.speak("sup")
tj.play('/usr/share/sounds/alsa/Front_Center.wav')
//tj.takePhoto().then(function(filePath) {
    //console.log(filePath)
 //});


function onRecvText(text) {
	tj.shine('blue');
    client.message(text).then(onRecvIntent).catch((err) => err)
    tj.translate(text, 'en' ,'es').then(onRecvTrans)
	//console.log(text)
	//tj.speak(text);
	
}

function onRecvTrans(translation) {
	tj.shine('white');
	if(translation.translations.length >= 1){
		tj.speak(translation.translations[0].translation)
	}
}

function onRecvIntent(data) {
    //console.log(data.entities)
}
