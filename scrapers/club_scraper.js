const fs = require('fs');
const { CONFIG } = require('../config');
const axios = require('axios');

async function getClubHtml(path) {
    const dotIndex = path.indexOf('.');
    const lastDotIndex = path.indexOf('.', dotIndex + 5);
    const pageName = path.slice(0, dotIndex);
    const page = lastDotIndex === -1 ? null : path.slice(lastDotIndex + 1);
    const clubId = lastDotIndex === -1 ? path.slice(dotIndex + 5) : path.slice(dotIndex + 5, lastDotIndex);
    const fileName = page ? `${pageName}_${clubId}_${page}.html` : `${pageName}_${clubId}.html`;
    let file = findClubFile(fileName);

    if (!file) {
        const findingMsg = page ? `Finding event list page ${page} for club ${clubId}...` : `Finding event list for club ${clubId}...`;
        console.log(findingMsg);
        const res = await axios.get(`${CONFIG.API_URL}?api_key=${CONFIG.API_KEY}&url=${CONFIG.USCHESS_URL}${path}`);
        file = res.data;
        const savingMsg = page ? `Saving event list page ${page} for club ${clubId}...` : `Saving event list for club ${clubId}...`;
        console.log(savingMsg);
        fs.writeFileSync(`html_pages/clubs/${fileName}`, file);
    }

    return file;
}

function findClubFile(fileName) {
    const clubFiles = fs.readdirSync('html_pages/clubs', 'utf-8');
    for (let file of clubFiles) {
        if (file === fileName) {
            const fileHtml = fs.readFileSync(`html_pages/clubs/${file}`, 'utf-8');
            return fileHtml;
        }
    }
    return null;
}

// async function updateAllMembers() {
//     const memberQuery = 'SELECT DISTINCT id FROM members RIGHT JOIN entries ON members.id = entries.player';
//     const memberRes = await executeSql(memberQuery, [], 'SELECT');
//     for (let member of memberRes) await getHistory(member.id);
// }

// async function updateParticipants(eventId) {
//     const participantQuery = 'SELECT DISTINCT player FROM entries WHERE event = @eventId';
//     const participantParams = [{ name: 'eventId', type: TYPES.BigInt, value: parseInt(eventId) }];
//     const participantRes = await executeSql(participantQuery, participantParams, 'SELECT');
//     for (let participant of participantRes) await updateHistory(participant.player);
// }


module.exports = { getClubHtml };