const { Event } = require('../models/event');
const { getSectionHtml } = require('../scrapers/section_scraper');

async function parseEventFile(eventId, html, lite) {
    const eventSummaryIndex = html.indexOf('Event Summary') + 13;
    const eventIndex = html.indexOf('Event', eventSummaryIndex) + 5;
    const eventNameIndex = html.indexOf('<b>', eventIndex) + 3;
    const eventName = html.slice(eventNameIndex, html.indexOf('</b>', eventNameIndex));
    const locationIndex = html.indexOf('Location', eventSummaryIndex) + 8;
    const eventLocationIndex = html.indexOf('<b>', locationIndex) + 3;
    const zipIndex = html.indexOf('&nbsp;', eventLocationIndex) - 1;
    const eventLocation = html.slice(eventLocationIndex, zipIndex);
    const eventZip = html.slice(zipIndex + 7, html.indexOf('&nbsp;', zipIndex + 7) - 1);
    const datesIndex = html.indexOf('Event Date(s)', eventSummaryIndex) + 13;
    const eventDatesIndex = html.indexOf('<b>', datesIndex) + 3;
    const eventDates = html.slice(eventDatesIndex, html.indexOf('</b>', eventDatesIndex) - 1);
    const sponsorIndex = html.indexOf('Sponsoring Affiliate', eventSummaryIndex) + 20;
    const sponsorEndAIndex = html.indexOf('>', html.indexOf('<b>', sponsorIndex) + 11) + 1;
    const eventSponsorName = html.slice(sponsorEndAIndex, html.indexOf('</a>', sponsorEndAIndex));
    const eventSponsorIdIndex = html.indexOf('<small>', sponsorEndAIndex) + 8;
    const eventSponsorId = html.slice(eventSponsorIdIndex, html.indexOf(')', eventSponsorIdIndex));
    const chiefTdIndex = html.indexOf('Chief&nbsp; TD', eventSummaryIndex) + 13;
    const tdNameIndex = html.indexOf('<b>', chiefTdIndex) + 3;
    const tdName = html.slice(tdNameIndex, html.indexOf('</b>', tdNameIndex));
    const tdIdIndex = html.indexOf('<small>', tdNameIndex) + 8;
    const tdId = html.slice(tdIdIndex, html.indexOf(')', tdIdIndex));
    const statsIndex = html.indexOf('Stats', eventSummaryIndex) + 5;
    const sectionsIndex = html.indexOf('<b>', statsIndex) + 3;
    const sections = html.slice(sectionsIndex, html.indexOf('Section(s)', sectionsIndex) - 1);
    const playersIndex = html.indexOf('&nbsp;', sectionsIndex) + 7;
    const players = html.slice(playersIndex, html.indexOf('Players', playersIndex) - 1);
    await Event.insertIfNotExists(eventId, eventName, eventLocation, eventZip, eventDates, eventSponsorId, eventSponsorName, tdId, tdName, sections, players);

    if (!lite) {
        const sectionCount = parseInt(sections);
        for (let sectionNum = 1; sectionNum <= sectionCount; sectionNum++) {
            const nextPage = `XtblMain.php?${eventId}.${sectionNum}`;
            await getSectionHtml(nextPage, lite);
        }
    }
}

module.exports = { parseEventFile };