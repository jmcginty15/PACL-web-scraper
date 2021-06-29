const process = require('process');
const { Club } = require('./models/club');
const { Event } = require('./models/event');
const { Section } = require('./models/section');
const { Entry } = require('./models/entry');
const { Member } = require('./models/member');
const { Game } = require('./models/game');

const helpMessage = `\nThis tool scrapes data from the USCF Member Services Area at\nhttp://www.uschess.org/msa/ and updates the PACL database.

Commands:
node app.js club <clubId>: Enter new club
node app.js club <clubId> update: Update all club members
node app.js event <eventId>: Enter new event
node app.js member <memberId>: Update member

Entering a new club may take a while if the club has an extensive tournament history.`;

async function run() {
    switch (process.argv[2]) {
        case 'help':
            console.log(helpMessage);
            break;
        case 'club':
            const clubId = process.argv[3];
            const club = new Club(clubId);
            await club.load();

            if (process.argv[4] === 'update') {
                const members = await Club.getMembers(clubId);

                if (members.length === 0) console.log(`\nNo members in the database for club ${clubId}.\nTo enter the club's members, use command 'node app.js club ${clubId}'.`);
                else {
                    for (let member of members) {
                        const history = await Member.updateHistory(member.id);

                        for (let event of history) {
                            const nextEvent = new Event(event.id);
                            await nextEvent.load();
                            await Member.insertOrUpdate(nextEvent.chiefTd);
                            await Event.insertIfNotExists(nextEvent);

                            const nextSection = new Section(event.id, event.section);
                            await nextSection.load();
                            if (nextSection.chiefTd) await Member.insertIfNotExists(nextSection.chiefTd);
                            else nextSection.chiefTd = nextEvent.chiefTd;
                            await Section.insertIfNotExists(nextSection);
                        }
                    }
                }
            } else {
                await Club.insertIfNotExists(club);

                for (let eventId of club.events) {
                    const event = new Event(eventId);
                    await event.load();
                    await Member.insertIfNotExists(event.chiefTd);
                    await Event.insertIfNotExists(event);

                    let sectionNum = 1;
                    while (sectionNum <= event.sections) {
                        const section = new Section(event.id, sectionNum);
                        await section.load();

                        if (section.chiefTd) await Member.insertIfNotExists(section.chiefTd);
                        else section.chiefTd = event.chiefTd;

                        await Section.insertIfNotExists(section);

                        const entries = [];
                        for (let entryId of section.entries) {
                            let [nextEventId, nextSectionNum, nextPlayerId] = entryId.split('-');
                            const entry = new Entry(nextEventId, sectionNum, nextPlayerId);
                            await entry.load();
                            await Member.insertIfNotExists(entry.player);
                            await Entry.insertIfNotExists(entry);
                            entries.push(entry);
                        }
                        for (let entry of entries) for (let game of entry.games) await Game.insertIfNotExists(game);

                        sectionNum++;
                    }
                }

                const members = await Club.getMembers(clubId);
                for (let member of members) {
                    const history = await Member.getHistory(member.id);

                    for (let event of history) {
                        const nextEvent = new Event(event.id);
                        await nextEvent.load();
                        await Member.insertIfNotExists(nextEvent.chiefTd);
                        await Event.insertIfNotExists(nextEvent);

                        const nextSection = new Section(event.id, event.section);
                        await nextSection.load();
                        if (nextSection.chiefTd) await Member.insertIfNotExists(nextSection.chiefTd);
                        else nextSection.chiefTd = nextEvent.chiefTd;
                        await Section.insertIfNotExists(nextSection);
                    }
                }
            }

            break;
        case 'event':
            const eventId = process.argv[3];
            const event = new Event(eventId);
            await event.load();
            await Member.insertIfNotExists(event.chiefTd);
            await Event.insertIfNotExists(event);

            let sectionNum = 1;
            while (sectionNum <= event.sections) {
                const section = new Section(event.id, sectionNum);
                await section.load();

                if (section.chiefTd) await Member.insertIfNotExists(section.chiefTd);
                else section.chiefTd = event.chiefTd;

                await Section.insertIfNotExists(section);

                const entries = [];
                for (let entryId of section.entries) {
                    let [nextEventId, nextSectionNum, nextPlayerId] = entryId.split('-');
                    const entry = new Entry(nextEventId, sectionNum, nextPlayerId);
                    await entry.load();
                    await Member.insertOrUpdate(entry.player);
                    await Entry.insertIfNotExists(entry);
                    entries.push(entry);
                }
                for (let entry of entries) for (let game of entry.games) await Game.insertIfNotExists(game);

                sectionNum++;
            }

            break;
        case 'member':
            const memberId = process.argv[3];
            await Member.insertOrUpdate(memberId);

            const history = await Member.updateHistory(memberId);
            for (let event of history) {
                const nextEvent = new Event(event.id);
                await nextEvent.load();
                await Member.insertIfNotExists(nextEvent.chiefTd);
                await Event.insertIfNotExists(nextEvent);

                const nextSection = new Section(event.id, event.section);
                await nextSection.load();
                if (nextSection.chiefTd) await Member.insertIfNotExists(nextSection.chiefTd);
                else nextSection.chiefTd = nextEvent.chiefTd;
                await Section.insertIfNotExists(nextSection);
            }

            break;
        default:
            console.log(`\nCommand not recognized.\nUse command 'node app.js help' to see list of available commands.`);
            break;
    }
}

run();