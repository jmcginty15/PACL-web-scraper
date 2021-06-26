const { Game } = require('../models/game');
const { Member } = require('../models/member');

async function parseGames(eventId, sectionNum, playerId, html) {
    const firstGameRefIndex = html.indexOf('<b>Opponent</b>');
    const lastGameRefIndex = html.indexOf('<tr><td colspan=15> Click on opponent ID', firstGameRefIndex);

    let nextRefIndex = html.indexOf('<tr>', firstGameRefIndex);
    let roundNum = 1;
    while (nextRefIndex < lastGameRefIndex && nextRefIndex !== -1) {
        const nextGame = {
            event: eventId,
            section: sectionNum,
            round: roundNum
        };
        const resultRef = html.indexOf('<td width=80 >', nextRefIndex) + 15;
        const result = html.slice(resultRef, resultRef + 1);
        const colorRef = html.indexOf('<td width=40 >', nextRefIndex) + 15;
        const color = html.slice(colorRef, colorRef + 1);
        const oppRef = html.indexOf('drill=', nextRefIndex) + 6;
        let oppId = html.slice(oppRef, html.indexOf('>', oppRef));

        switch (result) {
            case 'W':
                nextGame.result = color === 'B' ? '0-1' : '1-0';
                break;
            case 'L':
                nextGame.result = color === 'B' ? '1-0' : '0-1';
                break;
            case 'D':
                nextGame.result = '1/2-1/2';
                break;
            case 'U':
                nextGame.result = null;
                oppId = null;
                break;
        }

        if (nextGame.result) {
            nextGame.white = color === 'B' ? oppId : playerId;
            nextGame.black = color === 'B' ? playerId : oppId;
            nextGame.colorsReported = color === 'U' ? false : true;
        } else {
            nextGame.white = playerId;
            nextGame.black = 0;
            nextGame.colorsReported = null;
        }

        if (oppId) await Member.insertIfNotExists(oppId);
        await Game.insertIfNotExists(nextGame);
        nextRefIndex = html.indexOf('<tr>', nextRefIndex + 4);
        roundNum++;
    }
}

module.exports = { parseGames };