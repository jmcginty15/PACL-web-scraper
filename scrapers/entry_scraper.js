const fs = require('fs');
const axios = require('axios');
const { CONFIG } = require('../config');
const { parseEntryFile } = require('../parsers/entry_parser.js');
const { parseGames } = require('../parsers/game_parser');

async function getEntryHtml(path, eventId, sectionNum, lite) {
    const dotIndex = path.indexOf('.');
    const lastDashIndex = path.lastIndexOf('-');
    const pageName = path.slice(0, dotIndex);
    const memberId = path.slice(lastDashIndex + 1);
    const fileName = `${pageName}_${eventId}_${sectionNum}_${memberId}.html`;
    let file = findEntryFile(fileName);

    if (!file) {
        const findingMsg = `Finding detail page for entry ${eventId}.${sectionNum}.${memberId}...`;
        console.log(findingMsg);
        const res = await axios.get(`${CONFIG.API_URL}?api_key=${CONFIG.API_KEY}&url=${CONFIG.USCHESS_URL}${path}`);
        file = res.data;
        const savingMsg = `Saving detail page for entry ${eventId}.${sectionNum}.${memberId}...`;
        console.log(savingMsg);
        fs.writeFileSync(`html_pages/entries/${fileName}`, file);
    }

    await parseEntryFile(eventId, sectionNum, memberId, file);
    if (!lite) await parseGames(eventId, sectionNum, memberId, file);
}

function findEntryFile(fileName) {
    const entryFiles = fs.readdirSync('html_pages/entries', 'utf-8');
    for (let file of entryFiles) {
        if (file === fileName) {
            const fileHtml = fs.readFileSync(`html_pages/entries/${file}`, 'utf-8');
            return fileHtml;
        }
    }
    return null;
}

module.exports = { getEntryHtml };