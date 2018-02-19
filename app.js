const Wit = require('node-wit').Wit

const faceRec = require('./face-rec')
const tj = require('./tj')
const wit = new Wit({
  accessToken: "6ZYUNU4AHWYHF46QOLDEB5ZYGPCHCWOA"
});

tj.listen(onRecvText)


function onRecvText(text) {
	tj.shine('blue');
    wit.message(text).then(onRecvIntent).catch((err) => err)
	
}

function onRecvIntent(data) {
	tj.shine('white')
    let intents = data.entities.intent 
    console.log('intents', intents)
    if (intents.length >= 1) {
		let intent = intents[0]
		if (intent.value == 'introduction') {
			attemptToIdentify(data.entities)
		}
			
	}
}

function attemptToIdentify(entities) {
	console.log('identify')
	tj.takePhoto().then(filePath => {
		console.log('took photo')
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

		
