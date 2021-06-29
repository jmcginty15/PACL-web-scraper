const TYPES = require('tedious').TYPES;
const { executeSql } = require('../db');
const { getClubHtml } = require('../scrapers/club_scraper');
const { parseClubFile } = require('../parsers/club_parser');

class Club {
    constructor (id) {
        this.id = id;
        this.path = `AffDtlTnmtHst.php?${id}`;
    }

    static async insertIfNotExists({ id, name }) {
        let msg = `Club ${id} ${name} inserted`;

        const query = 'INSERT INTO clubs (id, name) VALUES (@id, @name)';
        const params = [
            { name: 'id', type: TYPES.BigInt, value: parseInt(id.slice(1)) },
            { name: 'name', type: TYPES.Text, value: name }
        ];

        try {
            await executeSql(query, params, 'INSERT');
        } catch (err) {
            msg = `Club ${id} ${name} already exists`;
        }

        console.log(msg);
    }

    static async getMembers(id) {
        const query = 'SELECT DISTINCT members.id FROM members RIGHT JOIN entries ON members.id = entries.player RIGHT JOIN events ON entries.event = events.id WHERE events.sponsoringClub = @sponsorId ORDER BY members.id';
        const params = [{ name: 'sponsorId', type: TYPES.BigInt, value: parseInt(id.slice(1)) }];
        return await executeSql(query, params, 'SELECT');
    }

    async load() {
        const html = await getClubHtml(this.path);
        this.parseHtml(html);
    }

    parseHtml(html) {
        const club = parseClubFile(this.id, html);
        this.name = club.name;
        this.events = club.events;
    }
}

module.exports = { Club };