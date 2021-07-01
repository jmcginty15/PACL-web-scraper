const process = require('process');
const { insertClub, updateClub, insertOrUpdateEvent, insertOrUpdateMember } = require('./functions');

const helpMessage = `
This tool scrapes data from the USCF Member Services Area at\nhttp://www.uschess.org/msa/ and updates the PACL database.

Commands:
node app.js club <clubId>: Enter new club
node app.js club <clubId> update: Update all club members
node app.js event <eventId>: Enter new event
node app.js member <memberId>: Update member

Entering a new club may take a while if the club has an extensive tournament history.`;

const errMessage = `
Command not recognized.
Use command 'node app.js help' to see list of available commands.`

switch (process.argv[2]) {
    case 'help':
        console.log(helpMessage);
        break;
    case 'club':
        const clubId = process.argv[3];
        if (process.argv[4] === 'update') updateClub(clubId);
        else insertClub(clubId);
        break;
    case 'event':
        const eventId = process.argv[3];
        insertOrUpdateEvent(eventId);
        break;
    case 'member':
        const memberId = process.argv[3];
        insertOrUpdateMember(memberId);
        break;
    default:
        console.log(errMessage);
        break;
}