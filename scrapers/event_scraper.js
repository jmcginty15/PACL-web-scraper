const fs = require('fs');
const axios = require('axios');
const { CONFIG } = require('../config');
const { parseEventFile } = require('../parsers/event_parser.js');

async function getEventHtml(path, lite) {
    const dotIndex = path.indexOf('.');
    const pageName = path.slice(0, dotIndex);
    const eventId = path.slice(dotIndex + 5);
    const fileName = `${pageName}_${eventId}.html`;
    let file = findEventFile(fileName);

    if (!file) {
        const findingMsg = `Finding detail page for event ${eventId}...`;
        console.log(findingMsg);
        const res = await axios.get(`${CONFIG.API_URL}?api_key=${CONFIG.API_KEY}&url=${CONFIG.USCHESS_URL}${path}`);
        file = res.data;
        const savingMsg = `Saving detail page for event ${eventId}...`;
        console.log(savingMsg);
        fs.writeFileSync(`html_pages/events/${fileName}`, file);
    }

    await parseEventFile(eventId, file, lite);
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

module.exports = { getEventHtml };