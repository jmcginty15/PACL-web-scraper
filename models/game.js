const TYPES = require('tedious').TYPES;
const { executeSql } = require('../db');

class Game {
    static async insertIfNotExists({ event, section, round, white, black, colorsReported, result }) {
        let msg = `Game ${event}.${section}.${round} ${white}-${black} inserted`;

        if (black !== 0) {
            let alreadyEntered = false;

            const gameCheckQuery = 'SELECT * FROM games WHERE event = @event AND section = @section AND round = @round AND white = @white AND black = @black';
            const gameCheckParams = [
                { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
                { name: 'section', type: TYPES.Int, value: parseInt(section) },
                { name: 'round', type: TYPES.BigInt, value: parseInt(round) },
                { name: 'white', type: TYPES.BigInt, value: parseInt(white) },
                { name: 'black', type: TYPES.BigInt, value: parseInt(black) }
            ];
            const gameRes = await executeSql(gameCheckQuery, gameCheckParams, 'SELECT');
            if (gameRes.length !== 0) alreadyEntered = true;

            if (!colorsReported) {
                gameCheckParams[3].value = parseInt(black);
                gameCheckParams[4].value = parseInt(white);
                const secondCheckRes = await executeSql(gameCheckQuery, gameCheckParams, 'SELECT');
                if (secondCheckRes.length !== 0) alreadyEntered = true;
            }

            if (!alreadyEntered) {
                const query = 'INSERT INTO games (event, section, round, white, black, colorsReported, result) VALUES (@event, @section, @round, @white, @black, @colorsReported, @result)';
                const params = [
                    { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
                    { name: 'section', type: TYPES.Int, value: parseInt(section) },
                    { name: 'round', type: TYPES.BigInt, value: parseInt(round) },
                    { name: 'white', type: TYPES.BigInt, value: parseInt(white) },
                    { name: 'black', type: TYPES.BigInt, value: parseInt(black) },
                    { name: 'colorsReported', type: TYPES.Bit, value: colorsReported },
                    { name: 'result', type: TYPES.Text, value: result }
                ];
                
                try {
                    await executeSql(query, params, 'INSERT');
                } catch (err) {
                    console.log(err);
                }    
            } else msg = `Game ${event}.${section}.${round} ${white}-${black} already exists`;
        }

        console.log(msg);
    }
}

module.exports = { Game }