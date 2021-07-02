const TYPES = require('tedious').TYPES;
const { executeSql } = require('../db');

class Game {
    static async insertIfNotExists({ event, section, round, white, black, colorsReported, result }) {
        let msg = `Game ${event}.${section}.${round} ${white}-${black} inserted`;

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

        console.log(msg);
    }

    static async getById(event, section, round, white, black) {
        const query = 'SELECT * FROM games WHERE event = @event AND section = @section AND round = @round AND ((white = @white AND black = @black) OR (white = @black AND black = @white AND colorsReported = @colorsReported))';
        const params = [
            { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
            { name: 'section', type: TYPES.Int, value: parseInt(section) },
            { name: 'round', type: TYPES.BigInt, value: parseInt(round) },
            { name: 'white', type: TYPES.BigInt, value: parseInt(white) },
            { name: 'black', type: TYPES.BigInt, value: parseInt(black) },
            { name: 'colorsReported', type: TYPES.Bit, value: 0 }
        ];
        const gameRes = await executeSql(query, params, 'SELECT');

        let game = null;
        if (gameRes.length === 0) return game;
        else game = gameRes[0];

        game.event = await Game.getEvent(event);
        game.section = await Game.getSection(event, section);
        game.white = await Game.getPlayer(white);
        game.black = parseInt(game.black) === 0 ? null : await Game.getPlayer(black);

        return game;
    }

    static async getByPlayer(id) {
        const query = 'SELECT * FROM games WHERE white = @player OR black = @player ORDER BY event, section, round';
        const params = [{ name: 'player', type: TYPES.BigInt, value: parseInt(id) }];
        const games = await executeSql(query, params, 'SELECT');

        for (let game of games) {
            const event = game.event;
            game.event = await Game.getEvent(event);
            game.section = await Game.getSection(event, game.section);
            game.white = await Game.getPlayer(game.white);
            game.black = parseInt(game.black) === 0 ? null : await Game.getPlayer(game.black);
        }

        return games;
    }

    static async getByPlayerEvent(id, event) {
        const query = 'SELECT section, round, white, black, colorsReported, result FROM games WHERE event = @event AND (white = @player OR black = @player) ORDER BY section, round';
        const params = [
            { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
            { name: 'player', type: TYPES.BigInt, value: parseInt(id) }
        ];
        const games = await executeSql(query, params, 'SELECT');
        const eventObj = await Game.getEvent(event);

        for (let game of games) {
            game.section = await Game.getSection(event, game.section);
            game.white = await Game.getPlayer(game.white);
            game.black = parseInt(game.black) === 0 ? null : await Game.getPlayer(game.black);
        }

        return { event: eventObj, games: games };
    }

    static async getWhitesByPlayerEvent(id, event) {
        const query = 'SELECT section, round, white, black, colorsReported, result FROM games WHERE event = @event AND white = @player AND colorsReported = @colorsReported ORDER BY section, round';
        const params = [
            { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
            { name: 'player', type: TYPES.BigInt, value: parseInt(id) },
            { name: 'colorsReported', type: TYPES.BigInt, value: 1 }
        ];
        const games = await executeSql(query, params, 'SELECT');
        const eventObj = await Game.getEvent(event);

        for (let game of games) {
            game.section = await Game.getSection(event, game.section);
            game.white = await Game.getPlayer(game.white);
            game.black = parseInt(game.black) === 0 ? null : await Game.getPlayer(game.black);
        }

        return { event: eventObj, games: games };
    }

    static async getBlacksByPlayerEvent(id, event) {
        const query = 'SELECT section, round, white, black, colorsReported, result FROM games WHERE event = @event AND black = @player AND colorsReported = @colorsReported ORDER BY section, round';
        const params = [
            { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
            { name: 'player', type: TYPES.BigInt, value: parseInt(id) },
            { name: 'colorsReported', type: TYPES.BigInt, value: 1 }
        ];
        const games = await executeSql(query, params, 'SELECT');
        const eventObj = await Game.getEvent(event);

        for (let game of games) {
            game.section = await Game.getSection(event, game.section);
            game.white = await Game.getPlayer(game.white);
            game.black = parseInt(game.black) === 0 ? null : await Game.getPlayer(game.black);
        }

        return { event: eventObj, games: games };
    }

    static async getUnreportedsByPlayerEvent(id, event) {
        const query = 'SELECT section, round, white, black, colorsReported, result FROM games WHERE event = @event AND (white = @player OR black = @player) AND colorsReported = @colorsReported ORDER BY section, round';
        const params = [
            { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
            { name: 'player', type: TYPES.BigInt, value: parseInt(id) },
            { name: 'colorsReported', type: TYPES.BigInt, value: 0 }
        ];
        const games = await executeSql(query, params, 'SELECT');
        const eventObj = await Game.getEvent(event);

        for (let game of games) {
            game.section = await Game.getSection(event, game.section);
            game.white = await Game.getPlayer(game.white);
            game.black = parseInt(game.black) === 0 ? null : await Game.getPlayer(game.black);
        }

        return { event: eventObj, games: games };
    }

    static async getByPlayerEventSection(id, event, section) {
        const query = 'SELECT round, white, black, colorsReported, result FROM games WHERE event = @event AND section = @section AND (white = @player OR black = @player) ORDER BY round';
        const params = [
            { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
            { name: 'section', type: TYPES.BigInt, value: parseInt(section) },
            { name: 'player', type: TYPES.BigInt, value: parseInt(id) }
        ];
        const games = await executeSql(query, params, 'SELECT');
        const eventObj = await Game.getEvent(event);
        const sectionObj = await Game.getSection(event, section);

        for (let game of games) {
            game.white = await Game.getPlayer(game.white);
            game.black = parseInt(game.black) === 0 ? null : await Game.getPlayer(game.black);
        }

        return { event: eventObj, section: sectionObj, games: games };
    }

    static async getWhitesByPlayerEventSection(id, event, section) {
        const query = 'SELECT round, white, black, colorsReported, result FROM games WHERE event = @event AND section = @section AND white = @player AND colorsReported = @colorsReported ORDER BY round';
        const params = [
            { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
            { name: 'section', type: TYPES.BigInt, value: parseInt(section) },
            { name: 'player', type: TYPES.BigInt, value: parseInt(id) },
            { name: 'colorsReported', type: TYPES.BigInt, value: 1 }
        ];
        const games = await executeSql(query, params, 'SELECT');
        const eventObj = await Game.getEvent(event);
        const sectionObj = await Game.getSection(event, section);

        for (let game of games) {
            game.white = await Game.getPlayer(game.white);
            game.black = parseInt(game.black) === 0 ? null : await Game.getPlayer(game.black);
        }

        return { event: eventObj, section: sectionObj, games: games };
    }

    static async getBlacksByPlayerEventSection(id, event, section) {
        const query = 'SELECT round, white, black, colorsReported, result FROM games WHERE event = @event AND section = @section AND black = @player AND colorsReported = @colorsReported ORDER BY round';
        const params = [
            { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
            { name: 'section', type: TYPES.BigInt, value: parseInt(section) },
            { name: 'player', type: TYPES.BigInt, value: parseInt(id) },
            { name: 'colorsReported', type: TYPES.BigInt, value: 1 }
        ];
        const games = await executeSql(query, params, 'SELECT');
        const eventObj = await Game.getEvent(event);
        const sectionObj = await Game.getSection(event, section);

        for (let game of games) {
            game.white = await Game.getPlayer(game.white);
            game.black = parseInt(game.black) === 0 ? null : await Game.getPlayer(game.black);
        }

        return { event: eventObj, section: sectionObj, games: games };
    }

    static async getUnreportedsByPlayerEventSection(id, event, section) {
        const query = 'SELECT round, white, black, colorsReported, result FROM games WHERE event = @event AND section = @section AND (white = @player OR black = @player) AND colorsReported = @colorsReported ORDER BY round';
        const params = [
            { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
            { name: 'section', type: TYPES.BigInt, value: parseInt(section) },
            { name: 'player', type: TYPES.BigInt, value: parseInt(id) },
            { name: 'colorsReported', type: TYPES.BigInt, value: 0 }
        ];
        const games = await executeSql(query, params, 'SELECT');
        const eventObj = await Game.getEvent(event);
        const sectionObj = await Game.getSection(event, section);

        for (let game of games) {
            game.white = await Game.getPlayer(game.white);
            game.black = parseInt(game.black) === 0 ? null : await Game.getPlayer(game.black);
        }

        return { event: eventObj, section: sectionObj, games: games };
    }

    static async getByPlayers(id1, id2) {
        const query = 'SELECT * FROM games WHERE (white = @player1 AND black = @player2) OR (white = @player2 AND black = @player1) ORDER BY event, section, round';
        const params = [
            { name: 'player1', type: TYPES.BigInt, value: parseInt(id1) },
            { name: 'player2', type: TYPES.BigInt, value: parseInt(id2) }
        ];
        const games = await executeSql(query, params, 'SELECT');

        for (let game of games) {
            const event = game.event;
            game.event = await Game.getEvent(event);
            game.section = await Game.getSection(event, game.section);
            game.white = await Game.getPlayer(game.white);
            game.black = parseInt(game.black) === 0 ? null : await Game.getPlayer(game.black);
        }

        return games;
    }

    static async getWhitesByPlayer(id) {
        const query = 'SELECT * FROM games WHERE white = @player AND colorsReported = @colorsReported ORDER BY event, section, round';
        const params = [
            { name: 'player', type: TYPES.BigInt, value: parseInt(id) },
            { name: 'colorsReported', type: TYPES.BigInt, value: 1 }
        ];
        const games = await executeSql(query, params, 'SELECT');

        for (let game of games) {
            const event = game.event;
            game.event = await Game.getEvent(event);
            game.section = await Game.getSection(event, game.section);
            game.white = await Game.getPlayer(game.white);
            game.black = parseInt(game.black) === 0 ? null : await Game.getPlayer(game.black);
        }

        return games;
    }

    static async getBlacksByPlayer(id) {
        const query = 'SELECT * FROM games WHERE black = @player AND colorsReported = @colorsReported ORDER BY event, section, round';
        const params = [
            { name: 'player', type: TYPES.BigInt, value: parseInt(id) },
            { name: 'colorsReported', type: TYPES.BigInt, value: 1 }
        ];
        const games = await executeSql(query, params, 'SELECT');

        for (let game of games) {
            const event = game.event;
            game.event = await Game.getEvent(event);
            game.section = await Game.getSection(event, game.section);
            game.white = await Game.getPlayer(game.white);
            game.black = parseInt(game.black) === 0 ? null : await Game.getPlayer(game.black);
        }

        return games;
    }

    static async getUnreportedsByPlayer(id) {
        const query = 'SELECT * FROM games WHERE (white = @player OR black = @player) AND colorsReported = @colorsReported ORDER BY event, section, round';
        const params = [
            { name: 'player', type: TYPES.BigInt, value: parseInt(id) },
            { name: 'colorsReported', type: TYPES.BigInt, value: 0 }
        ];
        const games = await executeSql(query, params, 'SELECT');

        for (let game of games) {
            const event = game.event;
            game.event = await Game.getEvent(event);
            game.section = await Game.getSection(event, game.section);
            game.white = await Game.getPlayer(game.white);
            game.black = parseInt(game.black) === 0 ? null : await Game.getPlayer(game.black);
        }

        return games;
    }

    static async getEvent(id) {
        const query = 'SELECT * FROM events WHERE id = @id';
        const params = [{ name: 'id', type: TYPES.BigInt, value: parseInt(id) }];
        const eventRes = await executeSql(query, params, 'SELECT');
        const event = eventRes[0];
        event.id = parseInt(event.id);
        event.sponsoringClub = await Game.getEventSponsor(event.sponsoringClub);
        event.chiefTd = parseInt(event.chiefTd);
        return event;
    }

    static async getEventSponsor(id) {
        const query = 'SELECT * FROM clubs WHERE id = @id';
        const params = [{ name: 'id', type: TYPES.BigInt, value: parseInt(id) }];
        const sponsorRes = await executeSql(query, params, 'SELECT');
        const sponsor = sponsorRes[0];
        return `${sponsor.type}${sponsor.id}`;
    }

    static async getSection(event, id) {
        const query = 'SELECT id, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl FROM sections WHERE event = @event AND id = @id';
        const params = [
            { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
            { name: 'id', type: TYPES.BigInt, value: parseInt(id) }
        ];
        const sectionRes = await executeSql(query, params, 'SELECT');
        const section = sectionRes[0];
        section.chiefTd = parseInt(section.chiefTd);
        return section;
    }

    static async getPlayer(id) {
        const query = 'SELECT * FROM members WHERE id = @id';
        const params = [{ name: 'id', type: TYPES.BigInt, value: parseInt(id) }];
        const playerRes = await executeSql(query, params, 'SELECT');
        const player = playerRes[0];
        player.id = parseInt(player.id);
        if (player.FIDEID) player.FIDEID = parseInt(player.FIDEID);
        return player;
    }
}

module.exports = { Game }