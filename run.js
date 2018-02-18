let faceRec = require('./face-rec')

// faceRec.listPersonGroups()
//     .then(res => console.log(res.data))
//     .catch(err => console.log(err.response.data))
// faceRec.createSnapshot('./test.jpg')
// faceRec.createSnapshot('./taylor.jpg')
//     .then(res => {
//         let photo = res.url
//         faceRec.createPerson('Taylor', photo)
//             .then(res => {
//                 console.log(res)
//             })
//             .catch(err => console.log(err))
//     })
//     .catch(err => console.log(err))
//
// faceRec.listPersonsForGroup('friends')
//     .then(res => console.log(res.data))
// faceRec.deletePerson('52dcef51-8a92-4aa6-a493-fc71914ca6e8')
// faceRec.trainPersonGroup()
//     .then(res => console.log(res.data))
//     .catch(err => console.log(err))
// faceRec.getTrainingStatus()
//     .then(res => console.log(res.data))
//     .catch(err => console.log(err))
faceRec.createSnapshot('./taylor-test.jpg')
    .then(res => {
        let photo = res.url
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
                                .then(res => console.log(res.data))
                                .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
