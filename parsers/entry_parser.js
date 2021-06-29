function parseEntryFile(eventId, sectionNum, playerId, html) {
    const entry = { event: eventId, section: sectionNum, player: playerId };
    const entryRefIndex = html.indexOf(`(${playerId})`);

    const ratingRefIndex = html.indexOf('Rating', entryRefIndex);
    const ratingIndex = html.indexOf('<b>', ratingRefIndex) + 6;
    const ratingChange = html.slice(ratingIndex, html.indexOf('</b>', ratingIndex));
    const ratings = parseRatingChange(ratingChange);
    entry.ratingBefore = ratings[0];
    entry.ratingAfter = ratings[1];

    const ratingDualIndex = html.indexOf('<B>', ratingRefIndex);
    if (ratingDualIndex !== -1) {
        const ratingDualChange = html.slice(ratingDualIndex + 6, html.indexOf('</B>', ratingDualIndex + 6));
        const dualRatings = parseRatingChange(ratingDualChange);
        entry.ratingDualBefore = dualRatings[0];
        entry.ratingDualAfter = dualRatings[1];
    } else {
        entry.ratingDualBefore = null;
        entry.ratingDualAfter = null;
    }

    const scoreRefIndex = html.indexOf('Score', entryRefIndex);
    const scoreIndex = html.indexOf('<b>', scoreRefIndex) + 3;
    entry.score = html.slice(scoreIndex, html.indexOf('</b>', scoreIndex));

    const pairingNumRefIndex = html.indexOf('Pairing #', entryRefIndex);
    const pairingNumIndex = html.indexOf('<b>', pairingNumRefIndex) + 3;
    entry.pairingNum = html.slice(pairingNumIndex, html.indexOf('</b>', pairingNumIndex));

    return entry;
}

function parseRatingChange(ratingChange) {
    const ratings = ratingChange.split('->');
    const parsedRatings = [];
    for (let rating of ratings) {
        while (rating.slice(0, 1) === ' ') rating = rating.slice(1);
        while (rating.slice(-1) === ' ') rating = rating.slice(0, -1);
        parsedRatings.push(rating);
    }
    return parsedRatings;
}

module.exports = { parseEntryFile };