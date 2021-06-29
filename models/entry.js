const TYPES = require('tedious').TYPES;
const { executeSql } = require('../db');
const { getEntryHtml } = require('../scrapers/entry_scraper');
const { parseEntryFile } = require('../parsers/entry_parser');
const { parseGames } = require('../parsers/game_parser');

class Entry {
    constructor(eventId, sectionNum, playerId) {
        this.event = eventId;
        this.section = sectionNum;
        this.player = playerId;
        let pathSection = sectionNum;
        while (pathSection.length < 3) pathSection = `0${pathSection}`;
        this.path = `XtblPlr.php?${eventId}-${pathSection}-${playerId}`;
    }

    static async insertIfNotExists({ event, section, player, pairingNum, score, ratingBefore, ratingAfter, ratingDualBefore, ratingDualAfter }) {
        const entryCheckQuery = 'SELECT * FROM entries WHERE event = @event AND section = @section AND player = @player';
        const entryCheckParams = [
            { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
            { name: 'section', type: TYPES.Int, value: parseInt(section) },
            { name: 'player', type: TYPES.BigInt, value: parseInt(player) }
        ];
        const entryRes = await executeSql(entryCheckQuery, entryCheckParams, 'SELECT');

        if (entryRes.length === 0) {            
            const query = 'INSERT INTO entries (event, section, player, pairingNum, score, ratingBefore, ratingAfter, ratingDualBefore, ratingDualAfter) VALUES (@event, @section, @player, @pairingNum, @score, @ratingBefore, @ratingAfter, @ratingDualBefore, @ratingDualAfter)';
            const params = [
                { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
                { name: 'section', type: TYPES.BigInt, value: parseInt(section) },
                { name: 'player', type: TYPES.BigInt, value: parseInt(player) },
                { name: 'pairingNum', type: TYPES.Int, value: parseInt(pairingNum) },
                { name: 'score', type: TYPES.Float, value: parseFloat(score) },
                { name: 'ratingBefore', type: TYPES.Text, value: ratingBefore },
                { name: 'ratingAfter', type: TYPES.Text, value: ratingAfter },
                { name: 'ratingDualBefore', type: TYPES.Text, value: ratingDualBefore },
                { name: 'ratingDualAfter', type: TYPES.Text, value: ratingDualAfter }
            ];

            let msg = `Entry ${event}.${section}.${player} inserted`;
            try {
                await executeSql(query, params, 'INSERT');
            } catch (err) {
                console.log(err);
                msg = `Entry ${event}.${section}.${player} already exists`;
            }
            console.log(msg);
        } else console.log(`Entry ${event}.${section}.${player} already exists`);
    }

    static async findById(event, section, player) {
        const entryCheckQuery = 'SELECT * FROM entries WHERE event = @event AND section = @section AND player = @player';
        const entryCheckParams = [
            { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
            { name: 'section', type: TYPES.Int, value: parseInt(section) },
            { name: 'player', type: TYPES.BigInt, value: parseInt(player) }
        ];
        const entryRes = await executeSql(entryCheckQuery, entryCheckParams, 'SELECT');

        if (entryRes.length === 0) return null;
        else return entryRes[0];
    }

    async load() {
        const html = await getEntryHtml(this.path, this.event, this.section);
        this.parseHtml(html);
        this.parseGames(html);
    }

    parseHtml(html) {
        const entry = parseEntryFile(this.event, this.section, this.player, html);
        this.ratingBefore = entry.ratingBefore;
        this.ratingAfter = entry.ratingAfter;
        this.ratingDualBefore = entry.ratingDualBefore;
        this.ratingDualAfter = entry.ratingDualAfter;
        this.score = entry.score;
        this.pairingNum = entry.pairingNum;
    }

    parseGames(html) {
        this.games = parseGames(this.event, this.section, this.player, html);
    }
}

module.exports = { Entry };