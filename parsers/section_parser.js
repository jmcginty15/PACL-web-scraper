function parseSectionFile(eventId, sectionNum, html) {
    const section = { event: eventId, sectionNum: sectionNum };

    let adjSectionNum = sectionNum;
    if (eventId === '201011288211') adjSectionNum = parseInt(sectionNum) + 6;
    if (eventId === '200504307281' && parseInt(sectionNum) === 3) adjSectionNum = 4;

    const sectionIndex = html.indexOf(`<b>Section ${adjSectionNum}`) + 14 + `${adjSectionNum}`.length;
    section.name = html.slice(sectionIndex, html.indexOf('</b>', sectionIndex));
    const chiefTdIndex = html.indexOf('Chief TD', sectionIndex);
    const endChiefTdIndex = html.indexOf('</small>', sectionIndex);
    section.chiefTd = null;
    if (chiefTdIndex !== -1 && chiefTdIndex < endChiefTdIndex) {
        const chiefTdIdIndex = html.indexOf('<small>', chiefTdIndex) + 8;
        section.chiefTd = html.slice(chiefTdIdIndex, html.indexOf(')', chiefTdIdIndex));
    }
    const datesIndex = html.indexOf('Section Date(s)', sectionIndex) + 15;
    const sectionDatesIndex = html.indexOf('<b>', datesIndex) + 3;
    section.dates = html.slice(sectionDatesIndex, html.indexOf('</b>', sectionDatesIndex));
    const statsIndex = html.indexOf('Stats', sectionIndex) + 5;
    const roundsIndex = html.indexOf('<b>', statsIndex) + 3;
    section.rounds = html.slice(roundsIndex, html.indexOf('Rounds', roundsIndex) - 1);
    const playersIndex = html.indexOf('&nbsp;', roundsIndex) + 7;
    section.players = html.slice(playersIndex, html.indexOf('Players', playersIndex) - 1);
    const kFactorIndex = html.indexOf('K Factor:', playersIndex) + 10;
    section.kFactor = html.slice(kFactorIndex, html.indexOf('&nbsp;', kFactorIndex) - 2);
    const ratingSysIndex = html.indexOf('Rating Sys:', kFactorIndex) + 12;
    section.ratingSys = html.slice(ratingSysIndex, html.indexOf('&nbsp;', ratingSysIndex) - 3);
    if (section.ratingSys.length > 1) {
        const spIndex = section.ratingSys.indexOf(' ');
        if (spIndex !== -1) section.ratingSys = section.ratingSys.slice(0, spIndex);
    }
    const tournamentTypeIndex = html.indexOf('Tnmt Type:', ratingSysIndex) + 11;
    section.tournamentType = html.slice(tournamentTypeIndex, html.indexOf('<br>', tournamentTypeIndex) - 2);
    if (section.tournamentType.length > 1) section.tournamentType = section.tournamentType.slice(0, 1);
    const timeControlIndex = html.indexOf('Time Control:', tournamentTypeIndex) + 14;
    section.timeControl = timeControlIndex === 13 ? null : html.slice(timeControlIndex, html.indexOf('</b>', timeControlIndex));

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

    section.entries = [];
    for (let detailIndex of detailIndices) {
        const phpIndex = html.indexOf('.php?', detailIndex) + 5;
        const nextEntry = html.slice(phpIndex, html.indexOf('>',phpIndex));
        section.entries.push(nextEntry);
    }

    return section;
}

module.exports = { parseSectionFile };