function parseClubFile(clubId, html) {
    const club = { id: clubId };

    const clubNameIndex = html.indexOf(':', html.indexOf(`${clubId}:`)) + 2;
    const clubName = html.slice(clubNameIndex, html.indexOf('</b>', clubNameIndex));
    club.name = clubName;

    const detailIndices = [];
    let index = 0;
    while (index !== -1) {
        const nextIndex = html.indexOf('Detail: ', index + 1);
        detailIndices.push(nextIndex);
        index = nextIndex;
    }
    detailIndices.pop();

    club.events = [];
    for (let detailIndex of detailIndices) {
        const phpIndex = html.indexOf('.php?', detailIndex) + 5;
        const nextEvent = html.slice(phpIndex, html.indexOf('>', phpIndex));
        club.events.push(nextEvent);
    }

    return club;
}

module.exports = { parseClubFile };