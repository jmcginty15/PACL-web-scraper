const fs = require('fs');
const { CONFIG } = require('../config');
const { ScraperApi } = require('../api');

async function getEventHtml(path) {
    const dotIndex = path.indexOf('.');
    const pageName = path.slice(0, dotIndex);
    const eventId = path.slice(dotIndex + 5);
    const fileName = `${pageName}_${eventId}.html`;
    let file = findEventFile(fileName);

    if (!file) {
        const findingMsg = `Finding detail page for event ${eventId}...`;
        console.log(findingMsg);
        file = await ScraperApi.get(`${CONFIG.API_URL}?api_key=${CONFIG.API_KEY}&url=${CONFIG.USCHESS_URL}${path}`);
        if (checkError(file)) {
            console.log(`Event ${eventId} not found`);
            return 'error';
        }
        const savingMsg = `Saving detail page for event ${eventId}...`;
        console.log(savingMsg);
        fs.writeFileSync(`html_pages/events/${fileName}`, file);
    }

    return file;
}

function findEventFile(fileName) {
    const eventFiles = fs.readdirSync('html_pages/events', 'utf-8');
    for (let file of eventFiles) {
        if (file === fileName) {
            const fileHtml = fs.readFileSync(`html_pages/events/${file}`, 'utf-8');
            return fileHtml;
        }
    }
    return null;
}

function checkError(html) {
    if (html.indexOf('Error (1b): Could not retrieve') === -1 && html.indexOf('Error 0a - Invalid Event ID') === -1) return false;
    else return true;
}

module.exports = { getEventHtml };