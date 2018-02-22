// Sample CalendarAPI settings
const SERVICE_ACCT_ID = 'otto-903@primeval-nectar-196006.iam.gserviceaccount.com'
const KEY = require('./calendar.json').private_key;
const TIMEZONE = 'UTC-08:00'
const CALENDAR_ID = {
	'primary': 'ottodatsteam@gmail.com'
};

module.exports.serviceAcctId = SERVICE_ACCT_ID;
module.exports.key = KEY;
module.exports.timezone = TIMEZONE;
module.exports.calendarId = CALENDAR_ID;

// Example for using json keys
// var key = require('./googleapi-key.json').private_key;
// module.exports.key = key;

