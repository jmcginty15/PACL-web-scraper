const { Section } = require('../models/section');
const { getEntryHtml } = require('../scrapers/entry_scraper');

async function parseSectionFile(eventId, sectionNum, html, lite) {
    const sectionIndex = html.indexOf(`<b>Section ${sectionNum}`) + 14 + `${sectionNum}`.length;
    const sectionName = html.slice(sectionIndex, html.indexOf('</b>', sectionIndex));
    const chiefTdIndex = html.indexOf('Chief TD', sectionIndex);
    const endChiefTdIndex = html.indexOf('</small>', sectionIndex);
    let chiefTdId = null;
    if (chiefTdIndex !== -1 && chiefTdIndex < endChiefTdIndex) {
        const chiefTdIdIndex = html.indexOf('<small>', chiefTdIndex) + 8;
        chiefTdId = html.slice(chiefTdIdIndex, html.indexOf(')', chiefTdIdIndex));
    }
    const datesIndex = html.indexOf('Section Date(s)', sectionIndex) + 15;
    const sectionDatesIndex = html.indexOf('<b>', datesIndex) + 3;
    const sectionDates = html.slice(sectionDatesIndex, html.indexOf('</b>', sectionDatesIndex));
    const statsIndex = html.indexOf('Stats', sectionIndex) + 5;
    const roundsIndex = html.indexOf('<b>', statsIndex) + 3;
    const rounds = html.slice(roundsIndex, html.indexOf('Rounds', roundsIndex) - 1);
    const playersIndex = html.indexOf('&nbsp;', roundsIndex) + 7;
    const players = html.slice(playersIndex, html.indexOf('Players', playersIndex) - 1);
    const kFactorIndex = html.indexOf('K Factor:', playersIndex) + 10;
    const kFactor = html.slice(kFactorIndex, html.indexOf('&nbsp;', kFactorIndex) - 2);
    const ratingSysIndex = html.indexOf('Rating Sys:', kFactorIndex) + 12;
    const ratingSys = html.slice(ratingSysIndex, html.indexOf('&nbsp;', ratingSysIndex) - 3);
    const tournamentTypeIndex = html.indexOf('Tnmt Type:') + 11;
    const tournamentType = html.slice(tournamentTypeIndex, html.indexOf('<br>', tournamentTypeIndex) - 2);
    const timeControlIndex = html.indexOf('Time Control:', tournamentTypeIndex) + 14;
    const timeControl = html.slice(timeControlIndex, html.indexOf('</b>', timeControlIndex));
    await Section.insertIfNotExists(eventId, sectionNum, sectionName, sectionDates, chiefTdId, rounds, players, kFactor, ratingSys, tournamentType, timeControl);

    if (!lite) {
        const startSectionIndex = html.indexOf('<pre>', timeControlIndex);
        const endSectionIndex = html.indexOf('</pre>', startSectionIndex);
        const detailIndices = [];
        let index = startSectionIndex;
        while (index >= startSectionIndex && index < endSectionIndex) {
            const nextIndex = html.indexOf('<a href=XtblPlr.php', index + 1) + 8;
            detailIndices.push(nextIndex);
            index = nextIndex;
        }
        detailIndices.pop();

        for (let detailIndex of detailIndices) {
            const nextPage = html.slice(detailIndex, html.indexOf('>', detailIndex));
            await getEntryHtml(nextPage, eventId, sectionNum, lite);
        }
    }
}

module.exports = { parseSectionFile };