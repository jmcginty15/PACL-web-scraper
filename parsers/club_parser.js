const { Club } = require('../models/club');
const { getEventHtml } = require('../scrapers/event_scraper');

async function parseClubFile(clubId, html) {
    const clubNameIndex = html.indexOf(':', html.indexOf(`${clubId}:`)) + 2;
    const clubName = html.slice(clubNameIndex, html.indexOf('</b>', clubNameIndex));
    Club.insertIfNotExists(clubId, clubName);

    const detailIndices = [];
    let index = 0;
    while (index !== -1) {
        const nextIndex = html.indexOf('Detail: ', index + 1);
        detailIndices.push(nextIndex);
        index = nextIndex;
    }
    detailIndices.pop();

    for (let detailIndex of detailIndices) {
        const hrefIndex = html.indexOf('href=', detailIndex) + 5;
        const nextPage = html.slice(hrefIndex, html.indexOf('>', hrefIndex));
        await getEventHtml(nextPage, false);
    }
}

module.exports = { parseClubFile };