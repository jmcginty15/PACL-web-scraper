const fs = require('fs');
const { CONFIG } = require('../config');
const { ScraperApi } = require('../api');

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
        file = await ScraperApi.get(`${CONFIG.API_URL}?api_key=${CONFIG.API_KEY}&url=${CONFIG.USCHESS_URL}${path}`);
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

module.exports = { getClubHtml };