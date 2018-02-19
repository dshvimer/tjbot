const Wit = require('node-wit').Wit

const faceRec = require('./face-rec')
const tj = require('./tj')
const wit = new Wit({
  accessToken: "IXVIMPXYRXN265TMPSSYL3QCHDTDIXON"
});



 tj.listen(onRecvText)
//console.log(tj.shineColors())

function onRecvText(words) {
	let text = processCommand(words)
	tj.pulse('white' , 0.7);
    if (text.length > 0) {
		if(text.includes('beat')) {
			discoParty();
			tj.play('./dropbeat.wav');
		} else if(text.includes('joke') || text.includes('funny')) {
			let jokes = [jokeFish, jokeDrive, jokeSpider]
			let rand = Math.floor(Math.random() * jokes.length)
			jokes[rand]()
		} else {
			wit.message(text).then(onRecvIntent).catch(onError)
		}
	}
}

function onRecvIntent(data) {
	console.log('entities', data.entities)
    let intents = data.entities.intent 
    if (intents.length >= 1) {
		let intent = intents[0]
		if (shouldSaveFriend(data.entities)) {
			let contacts = data.entities.contacts.map(c => c.value)
			saveFriend(contacts[0])
		} else if(intent.value == 'remember_friend') {
			attemptToIdentify()
		}			
	}
}

function shouldSaveFriend(entities) {
	let intents = entities.intents.map(i => i.value)
	if (!intents.includes('save_friend'))
		return false
	if !entities.contacts.length
		return false
	
	return true
}

function discoParty() {
	let tjColors = tj.shineColors()
	let timer = setInterval(() => tj.shine(tjColors[Math.floor(Math.random() * tjColors.length)]), 220)
	setTimeout(() => clearInterval(timer), 8800)
    
}

function saveFriend(name) {
	tj.pulse('yellow', 0.7)
	console.log('otto is remembering your friend... allo')
	tj.takePhoto().then(filePath => {
		faceRec.createSnapshot(filePath)
			.then(res => {
				let photo = res.url
				faceRec.createPerson(name, photo)
					.then(res => {
						console.log(res)
						faceRec.trainPersonGroup()
						tj.pulse('green' , 0.7);
					})
					.catch(onError)
			})
			.catch(onError)
	})
}

function attemptToIdentify() {
	tj.pulse('thistle 4' , 0.7);
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
								tj.pulse('green' , 0.7);
								if (c.length >= 1)
									faceRec.getPerson(c[0].personId)
										.then(res => tj.speak(res.data.name))
										.catch(onError)
								else
									tj.speak('who dis?')
							})
							.catch(onError)
							})
							.catch(onError)
			})
			.catch(onError)
			});
}

function jokeSpider() {
    tj.speak('Two spiders got engaged').then(() => tj.speak('I heard they met on the web'))
}

function jokeDrive() {
	tj.speak('Why was the computer late to work').then(() => tj.speak('It had a hard drive'))
}
function jokeFish() {
	tj.speak('Give a man a fish, and he’ll Instagram it.').then(() => tj.speak('Teach a man to fish, and he’ll still Instagram it.'))
}

function mentionedOtto(text) {
	return /auto|otto|although/i.test(text)
}

function processCommand(words) {
	let text = words.toLowerCase().trim()
	if (mentionedOtto(text))
		text = text.replace(/auto|otto|although/i, '')
	else
		text = ""
		
	return text
}

function onError(err) {
	console.log(err)
	tj.pulse('red', 0.7)
}
