const { Event } = require('../models/event');
const { Section } = require('../models/section');
const { Entry } = require('../models/entry');
const { getEntryHtml } = require('../scrapers/entry_scraper');
const { getEventHtml } = require('../scrapers/event_scraper');
const { getSectionHtml } = require('../scrapers/section_scraper');

async function parseHistoryFile(memberId, html) {
    let refIndex = html.indexOf('<!-- Detail: 1  -->');
    let index = 1;
    const endIndex = html.indexOf('<!-- Resume Tabset Table -->');

    while (refIndex !== -1 && refIndex < endIndex) {
        const eventIndex = html.indexOf('<small>', refIndex) + 7;
        const eventId = html.slice(eventIndex, html.indexOf(' </small>', eventIndex));
        const event = await Event.findById(eventId);
        if (event === null) await getEventHtml(`XtblMain.php?${eventId}`, true);

        const sectionIndex = html.indexOf('<small>', eventIndex + 1) + 7;
        const sectionNum = html.slice(sectionIndex, html.indexOf(':', sectionIndex));
        const section = await Section.findById(eventId, sectionNum);
        if (section === null) await getSectionHtml(`XtblMain.php?${eventId}.${sectionNum}`, true);
        let sectionId = sectionNum;
        while (sectionId.length < 3) sectionId = `0${sectionId}`;
        await getEntryHtml(`XtblPlr.php?${eventId}-${sectionId}-${memberId}`, eventId, sectionNum, true);

        index += 1;
        refIndex = html.indexOf(`<!-- Detail: ${index}  -->`);
    }
}

async function updateHistoryFile(memberId, html) {
    let refIndex = html.indexOf('<!-- Detail: 1  -->');
    let index = 1;
    const endIndex = html.indexOf('<!-- Resume Tabset Table -->');
    let found = false;

    while (refIndex !== -1 && refIndex < endIndex && !found) {
        const eventIndex = html.indexOf('<small>', refIndex) + 7;
        const eventId = html.slice(eventIndex, html.indexOf(' </small>', eventIndex));

        const sectionIndex = html.indexOf('<small>', eventIndex + 1) + 7;
        const sectionNum = html.slice(sectionIndex, html.indexOf(':', sectionIndex));

        const entry = await Entry.findById(eventId, sectionNum, memberId);

        if (entry === null) {
            const event = await Event.findById(eventId);
            const section = await Section.findById(eventId, sectionNum);
            if (event === null) await getEventHtml(`XtblMain.php?${eventId}`, true);
            if (section === null) await getSectionHtml(`XtblMain.php?${eventId}.${sectionNum}`, true);
            let sectionId = sectionNum;
            while (sectionId.length < 3) sectionId = `0${sectionId}`;
            await getEntryHtml(`XtblPlr.php?${eventId}-${sectionId}-${memberId}`, eventId, sectionNum, true);

            index += 1;
            refIndex = html.indexOf(`<!-- Detail: ${index}  -->`);
        } else found = true;
    }
}

module.exports = { parseHistoryFile, updateHistoryFile };