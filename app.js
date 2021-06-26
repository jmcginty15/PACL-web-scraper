const process = require('process');
const { getClubHtml } = require('./scrapers/club_scraper');
const { getEventHtml } = require('./scrapers/event_scraper');
const { updateParticipants } = require('./scrapers/club_scraper');
const { Member } = require('./models/member');

const helpMessage = `This tool scrapes data from the USCF Member Services Area at\nhttp://www.uschess.org/msa/ and updates the PACL database.

Commands:
node app.js club <clubId>: Enter new club
node app.js event <eventId>: Enter new event
node app.js member <memberId>: Update member

Entering a new club may take a while if the club has an extensive tournament history.`;

switch (process.argv[2]) {
    case 'help':
        console.log(helpMessage);
        break;
    case 'club':
        const clubId = process.argv[3];
        getClubHtml(`AffDtlTnmtHst.php?${clubId}`);
        break;
    case 'event':
        const eventId = process.argv[3];
        getEventHtml(`XtblMain.php?${eventId}`, false).then(() => {
            updateParticipants(eventId);
        });
        break;
    case 'member':
        const memberId = process.argv[3];
        Member.update(memberId);
        break;
}
