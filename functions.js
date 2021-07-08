const { Club } = require('./models/club');
const { Event } = require('./models/event');
const { Section } = require('./models/section');
const { Entry } = require('./models/entry');
const { Member } = require('./models/member');
const { Game } = require('./models/game');

async function insertClub(clubId) {
    const club = new Club(clubId);
    await club.load();
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

            if (event.id === '201011288211' && parseInt(event.section) > 4) event.section = parseInt(event.section) - 6;
            if (event.id === '200504307281' && parseInt(event.section) === 4) event.section = 3;
            const nextSection = new Section(event.id, event.section);
            await nextSection.load();
            if (nextSection.chiefTd) await Member.insertIfNotExists(nextSection.chiefTd);
            else nextSection.chiefTd = nextEvent.chiefTd;
            await Section.insertIfNotExists(nextSection);

            const entry = new Entry(event.id, event.section, member.id);
            await entry.load();
            await Entry.insertIfNotExists(entry);
        }
    }
}

async function updateClub(clubId) {
    const club = new Club(clubId);
    await club.load();
    const members = await Club.getMembers(clubId);

    if (members.length === 0) console.log(`\nNo members in the database for club ${clubId}.\nTo enter the club's members, use command 'node app.js club ${clubId}'.`);
    else {
        for (let member of members) {
            await Member.insertOrUpdate(member.id);
            const history = await Member.updateHistory(member.id);

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

                const entry = new Entry(event.id, event.section, member.id);
                await entry.load();
                await Entry.insertIfNotExists(entry);
            }
        }
    }
}

async function insertOrUpdateEvent(eventId) {
    const event = new Event(eventId);
    const error = await event.load();
    if (error === 'error') return error;
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
}

async function insertOrUpdateMember(memberId) {
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
}

module.exports = { insertClub, updateClub, insertOrUpdateEvent, insertOrUpdateMember };