const fs = require('fs')
const axios = require('axios')

class FaceRec {
    constructor() {
        this.MSFT_URL = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0'
        this.API_URL = 'http://localhost:3000'
        this.personGroupId = 'friends'
        this.msft = axios.create({
          baseURL: this.MSFT_URL,
          headers: {'Ocp-Apim-Subscription-Key': '2a6102d0e7284f2c8b14b0ffb574914d'}
        })
        this.api = axios.create({
          baseURL: this.API_URL
        })
    }

    listPersonGroups() {
        return this.msft.get('/persongroups')
    }

    listPersonsForGroup() {
        return this.msft.get(`/persongroups/friends/persons`)
    }

    createPersonGroup(groupName) {
        return this.msft.put(`/persongroups/${groupName}`, {name: groupName})
    }

    trainPersonGroup() {
        return this.msft.post('/persongroups/friends/train')
    }

    getTrainingStatus() {
        return this.msft.get('/persongroups/friends/training')
    }

    deletePerson(personId) {
        return this.msft.delete(`/persongroups/friends/persons/${personId}`)
    }
        
    createPerson(name, photo) {
        return new Promise((resolve, reject) => {
            this.msft.post(`/persongroups/${this.personGroupId}/persons`, {name: name})
                .then(res => {
                    let personId = res.data.personId
                    this.msft.post(`/persongroups/${this.personGroupId}/persons/${personId}/persistedFaces`, {url: photo})
                        .then(res => {
                            resolve(res.data)
                        })
                })

            })
    }

    detectFace(photo) {
        return this.msft.post('/detect', { url: photo })
    }

    identify(identify) {
        return this.msft.post('/identify', identify)
    }

    getPerson(personId) {
        return this.msft.get(`/persongroups/friends/persons/${personId}`)
    }

    getSnapshots() {
        this.api.get('/snapshots')
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
    }

    createSnapshot(path) {
        return new Promise((resolve, reject) => {
            const dataUri = 'data:image/jpg;base64'
            fs.readFile(path, 'base64', (err, data) => {
                const image = `${dataUri},${data}`
                this.api.post('/snapshots', { image: image })
                    .then(res => resolve(res.data))
                    .catch(err => reject(err))
            })        
        })
    }
}



module.exports = new FaceRec()
