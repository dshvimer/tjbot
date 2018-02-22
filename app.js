const Wit = require('node-wit').Wit
const axios = require('axios')

const createEvent = require('./calendar')
const faceRec = require('./face-rec')
const tj = require('./tj')
const wit = new Wit({
    accessToken: "IXVIMPXYRXN265TMPSSYL3QCHDTDIXON"
});
const joke = axios.create({
    baseURL: 'https://icanhazdadjoke.com/',
    headers: {'Accept': 'application/json'}
})


try {
    // tj.pulse('blue')
    // tj.listen(onRecvText)
    createCalEvent()
}
catch(err) {
    onError(err) 
}

async function onRecvText(words) {
    try {
        let text = processCommand(words)
        tj.pulse('white' , 0.7);
        if (text.length > 0) {
            if(text.includes('beat')) {
                discoParty();
                tj.play('./dropbeat.wav');
            } else if(text.includes('joke') || text.includes('funny')) {
                await tellJoke()
            } else if(text.includes('thank')) {
                tj.speak('no problaymo')
            } else {
                let intent = await wit.message(text)
                onRecvIntent(intent, text)
            }
        }
    }
    catch(err) {
        onError(err) 
    }
}

function onRecvIntent(data, text) {
    console.log('entities', data.entities)
    let intents = data.entities.intent 
    if (intents && (intents.length >= 1)) {
        let intent = intents[0]
        if (shouldSaveFriend(data.entities)) {
            let contacts = data.entities.contact.map(c => c.value)
            saveFriend(contacts[0])
        } else if(intent.value == 'remember_friend') {
            attemptToIdentify()
        } else if(intent.value == 'plans') {
            createCalEvent(data.entities, text)
        }			
    }
}

function shouldSaveFriend(entities) {
    let intents = entities.intent.map(i => i.value)
    if (!intents.includes('save_friend'))
        return false
    if (!entities.contact.length)
        return false

    return true
}

function discoParty() {
    let tjColors = tj.shineColors()
    let timer = setInterval(() => tj.shine(tjColors[Math.floor(Math.random() * tjColors.length)]), 220)
    setTimeout(() => clearInterval(timer), 8800)

}

async function saveFriend(name) {
    try {
        tj.pulse('yellow', 0.7)
        let photo = await tj.takePhoto()
        tj.pulse('yellow', 0.7)
        let snap = await faceRec.createSnapshot(photo)
        tj.pulse('yellow', 0.7)
        let person = await faceRec.createPerson(name, snap.url)
        tj.pulse('yellow', 0.7)
        await faceRec.trainPersonGroup()
        tj.pulse('green', 0.7)
    }
    catch(err) {
        onError(err) 
    }
}

async function attemptToIdentify() {
    try {
        tj.pulse('orange' , 0.7);
        let filePath = await tj.takePhoto()
        tj.pulse('orange' , 0.7);
        let snap = await faceRec.createSnapshot(filePath)
        tj.pulse('orange' , 0.7);
        let faces = await faceRec.detectFace(snap.url)
        tj.pulse('orange' , 0.7);
        let faceIds = faces.data.map(item => item.faceId)
        let identify = {    
            personGroupId: "friends",
            faceIds: faceIds,
            maxNumOfCandidatesReturned: 1,
            confidenceThreshold: 0.5
        }
        let res = await faceRec.identify(identify)
        let c = res.data.reduce((acc, item) => acc.concat(item.candidates), [])
        if (c.length >= 1) {
            let person = await faceRec.getPerson(c[0].personId)
            tj.pulse('green' , 0.7);
            tj.speak(person.data.name)
        }
        else
            tj.speak('who dis?')
    }
    catch(err) {
        onError(err) 
    }
}

async function tellJoke() {
    try {
        let res = await joke.get('')
        tj.speak(res.data.joke)
    }
    catch(err) {
        onError(err) 
    }
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

async function createCalEvent(entities, text) {
    let location = ''
    let contact = ''

    if (entities.contact)
        contact = entities.contact.map(con => con.value)[0]

    if (entities.location)
        location = entities.location.map(loc => loc.value)[0]

    if (entities.datetime) {
        let date = entities.datetime.map(date => date.value)[0]
        let start = new Date(date)
        let end = new Date(start.getTime() + 120000);
        let event = {
            'start': { 'dateTime': start },
            'end': { 'dateTime': end },
            'location': location,
            'summary': contact || 'Plans made by Otto',
            'description': text,
            'status': 'confirmed',
            'colorId': 1
        }
        createEvent(event)
    }
}
