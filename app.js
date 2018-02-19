const Wit = require('node-wit').Wit

const faceRec = require('./face-rec')
const tj = require('./tj')
const wit = new Wit({
  accessToken: "HABEOQ455XRJDBJ3NJKZHGPIAQY3QZKU"
});

tj.listen(onRecvText)
//console.log(tj.shineColors())

function onRecvText(text) {
	tj.pulse('white' , 0.7);
    wit.message(text).then(onRecvIntent).catch((err) => err)
    if (~text.indexOf('beat')) {
		discoParty();
		tj.play('./dropbeat.wav');
	}
}

function onRecvIntent(data) {
	
	console.log('entities', data.entities)
    let intents = data.entities.intent 
    if (intents.length >= 1) {
		let intent = intents[0]
		if (intent.value == 'introduction') {
			//handleIntroduction(data.entities)
			tj.pulse('plum' , 0.7);
		} else if(intent.value == 'plans') {
			tj.pulse('thistle 4' , 0.7);
		} else if(intent.value == 'dropBeat') {
			tj.play('./dropbeat.wav');
		}
			
	}
}

function discoParty() {
	let tjColors = tj.shineColors()
	let timer = setInterval(() => tj.shine(tjColors[Math.floor(Math.random() * tjColors.length)]), 220)
	setTimeout(() => clearInterval(timer), 8800)
    
}

function handleIntroduction(entities) {
	if (entities.contact) {
		let name = entities.contact[0].value
		saveFriend(name)
	}
	else {
		attemptToIdentify()
	}
}

function saveFriend(name) {
	console.log('otto is remembering your friend... allo')
	tj.takePhoto().then(filePath => {
		tj.pulse('orange' , 0.7);
		faceRec.createSnapshot('./taylor.jpg')
			.then(res => {
				let photo = res.url
				faceRec.createPerson(name, photo)
					.then(res => {
						console.log(res)
					})
					.catch(err => console.log(err))
			})
			.catch(err => console.log(err))
	})
}

function attemptToIdentify() {
	console.log('identify')
	tj.takePhoto().then(filePath => {
		console.log('took photo')
		tj.pulse('orange' , 0.7);
		faceRec.createSnapshot(filePath)
			.then(res => {
				let photo = res.url
				console.log(photo)
				faceRec.detectFace(photo)
					.then(res => {
let faceIds = res.data.map(item => item.faceId)
                let identify = {    
                    personGroupId: "friends",
                    faceIds: faceIds,
                    maxNumOfCandidatesReturned: 1,
                    confidenceThreshold: 0.5
                }
                faceRec.identify(identify)
                    .then(res => {
                        let c = res.data.reduce((acc, item) => acc.concat(item.candidates), [])
                        console.log(c)
                        if (c.length >= 1)
                            faceRec.getPerson(c[0].personId)
                                .then(res => tj.speak(res.data.name))
                                .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
					})
					.catch(err => console.log(err))
			})
			.catch(err => console.log(err))
			});
}

		
