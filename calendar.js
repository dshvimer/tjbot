const config = require('./cal-config');
const CalendarAPI = require('node-google-calendar');

let cal = new CalendarAPI(config); 

async function createEvent(event) {
    // let event = {
    //     'start': { 'dateTime': '2018-02-23T07:00:00+08:00' },
    //     'end': { 'dateTime': '2018-02-23T08:00:00+08:00' },
    //     'location': 'Coffeeshop',
    //     'summary': 'Breakfast',
    //     'status': 'confirmed',
    //     'colorId': 1
    // }
    try {
        let res = await cal.Events.insert('ottodatsteam@gmail.com', event)
        console.log(res)

    } catch (err) {
        console.log(err)
    }
}

module.exports = createEvent
