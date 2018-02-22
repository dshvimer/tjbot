const config = require('./cal-config');
const CalendarAPI = require('node-google-calendar');

let cal = new CalendarAPI(config); 

async function createEvent(event) {
    try {
        let res = await cal.Events.insert('ottodatsteam@gmail.com', event)
        console.log(res)

    } catch (err) {
        console.log(err)
    }
}

module.exports = createEvent
