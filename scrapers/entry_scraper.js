const fs = require('fs');
const { CONFIG } = require('../config');
const { ScraperApi } = require('../api');

async function getEntryHtml(path, eventId, sectionNum) {
    const dotIndex = path.indexOf('.');
    const lastDashIndex = path.lastIndexOf('-');
    const pageName = path.slice(0, dotIndex);
    const memberId = path.slice(lastDashIndex + 1);
    const fileName = `${pageName}_${eventId}_${sectionNum}_${memberId}.html`;
    let file = findEntryFile(fileName);

    if (!file) {
        const findingMsg = `Finding detail page for entry ${eventId}.${sectionNum}.${memberId}...`;
        console.log(findingMsg);
        file = await ScraperApi.get(`${CONFIG.API_URL}?api_key=${CONFIG.API_KEY}&url=${CONFIG.USCHESS_URL}${path}`);
        const savingMsg = `Saving detail page for entry ${eventId}.${sectionNum}.${memberId}...`;
        console.log(savingMsg);
        fs.writeFileSync(`html_pages/entries/${fileName}`, file);
    }

    return file;
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