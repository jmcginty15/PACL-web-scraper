function parseEventFile(eventId, html) {
    const event = { id: eventId };

    const eventSummaryIndex = html.indexOf('Event Summary') + 13;
    const eventIndex = html.indexOf('Event', eventSummaryIndex) + 5;
    const eventNameIndex = html.indexOf('<b>', eventIndex) + 3;
    event.name = html.slice(eventNameIndex, html.indexOf('</b>', eventNameIndex));
    const locationIndex = html.indexOf('Location', eventSummaryIndex) + 8;
    const eventLocationIndex = html.indexOf('<b>', locationIndex) + 3;
    const zipIndex = html.indexOf('&nbsp;', eventLocationIndex) - 1;
    event.locationCity = html.slice(eventLocationIndex, zipIndex);
    if (event.locationCity.slice(0, 12) === 'Online Event') event.locationCity = 'ONLINE';
    if (event.locationCity.indexOf(',') !== -1) {
        let [tempCity, tempState] = event.locationCity.split(',');
        while (tempCity.slice(-1) === ' ') tempCity = tempCity.slice(0, -1);
        while (tempState.slice(0, 1) === ' ') tempState = tempState.slice(1);
        event.locationCity = `${tempCity}, ${tempState}`;
    }
    event.locationZip = html.slice(zipIndex + 7, html.indexOf('&nbsp;', zipIndex + 7) - 1);
    const datesIndex = html.indexOf('Event Date(s)', eventSummaryIndex) + 13;
    const eventDatesIndex = html.indexOf('<b>', datesIndex) + 3;
    event.dates = html.slice(eventDatesIndex, html.indexOf('</b>', eventDatesIndex) - 1);
    const sponsorIndex = html.indexOf('Sponsoring Affiliate', eventSummaryIndex) + 20;
    const sponsorEndAIndex = html.indexOf('>', html.indexOf('<b>', sponsorIndex) + 11) + 1;
    event.sponsorName = html.slice(sponsorEndAIndex, html.indexOf('</a>', sponsorEndAIndex));
    const eventSponsorIdIndex = html.indexOf('<small>', sponsorEndAIndex) + 8;
    event.sponsoringClub = html.slice(eventSponsorIdIndex, html.indexOf(')', eventSponsorIdIndex));
    const chiefTdIndex = html.indexOf('Chief&nbsp; TD', eventSummaryIndex) + 13;
    const tdNameIndex = html.indexOf('<b>', chiefTdIndex) + 3;
    event.tdName = html.slice(tdNameIndex, html.indexOf('</b>', tdNameIndex));
    const tdIdIndex = html.indexOf('<small>', tdNameIndex) + 8;
    event.chiefTd = html.slice(tdIdIndex, html.indexOf(')', tdIdIndex));
    if (event.chiefTd === '') event.chiefTd = '0';
    const statsIndex = html.indexOf('Stats', eventSummaryIndex) + 5;
    const sectionsIndex = html.indexOf('<b>', statsIndex) + 3;
    const sections = html.slice(sectionsIndex, html.indexOf('Section(s)', sectionsIndex) - 1);
    const playersIndex = html.indexOf('&nbsp;', sectionsIndex) + 7;
    event.players = html.slice(playersIndex, html.indexOf('Players', playersIndex) - 1);
    event.sections = parseInt(sections);

    return event;
}

module.exports = { parseEventFile };