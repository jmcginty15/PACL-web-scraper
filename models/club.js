const ExpressError = require('../expressError');
const TYPES = require('tedious').TYPES;
const { executeSql } = require('../db');
const { getClubHtml } = require('../scrapers/club_scraper');
const { parseClubFile } = require('../parsers/club_parser');

class Club {
    constructor(id) {
        this.id = id;
        this.path = `AffDtlTnmtHst.php?${id}`;
    }

    static async insertIfNotExists({ id, name }) {
        let msg = `Club ${id} ${name} inserted`;

        const query = 'INSERT INTO clubs (id, type, name) VALUES (@id, @type, @name)';
        const params = [
            { name: 'id', type: TYPES.BigInt, value: parseInt(id.slice(1)) },
            { name: 'type', type: TYPES.Text, value: id.slice(0, 1) },
            { name: 'name', type: TYPES.Text, value: name }
        ];

        try {
            await executeSql(query, params, 'INSERT');
        } catch (err) {
            msg = `Club ${id} ${name} already exists`;
        }

        console.log(msg);
    }

    static async getById(id) {
        const query = 'SELECT * FROM clubs WHERE id = @id';
        const params = [{ name: 'id', type: TYPES.BigInt, value: parseInt(id.slice(1)) }];
        const res = await executeSql(query, params, 'SELECT');

        if (res.length === 0) throw new ExpressError(`Club ${id} not found`, 404);

        const club = res[0];

        club.id = `${club.type}${club.id}`;
        delete club.type;
        club.events = await Club.getEvents(id);
        club.members = await Club.getMembers(id);

        return club;
    }

    static async getMembers(id) {
        const query = `SELECT * FROM members WHERE id IN (
                SELECT DISTINCT members.id FROM members
                    LEFT JOIN entries ON members.id = entries.player
                    LEFT JOIN events ON entries.event = events.id
                    WHERE entries.event IN (
                        SELECT events.id FROM events INNER JOIN clubs ON events.sponsoringClub = clubs.id WHERE clubs.id = @clubId
                    )
                )
            ORDER BY id`;
        const params = [{ name: 'clubId', type: TYPES.BigInt, value: parseInt(id.slice(1)) }];
        const members = await executeSql(query, params, 'SELECT');
        for (let member of members) {
            member.id = parseInt(member.id);
            if (member.FIDEID) member.FIDEID = parseInt(member.FIDEID);
        }
        return members;
    }

    static async getEvents(id) {
        const query = 'SELECT id, name, locationCity, locationZip, dates, chiefTd, sections, players FROM events WHERE sponsoringClub = @sponsoringClub ORDER BY id';
        const params = [{ name: 'sponsoringClub', type: TYPES.BigInt, value: parseInt(id.slice(1)) }];
        const events = await executeSql(query, params, 'SELECT');
        for (let event of events) {
            event.id = parseInt(event.id);
            event.chiefTd = parseInt(event.chiefTd);
        }
        return events;
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