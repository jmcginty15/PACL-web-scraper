const fs = require('fs');
const { CONFIG } = require('../config');
const axios = require('axios');

async function getSectionHtml(path, lite) {
    const dotIndex = path.indexOf('.');
    const lastDotIndex = path.lastIndexOf('.');
    const pageName = path.slice(0, dotIndex);
    const eventId = path.slice(dotIndex + 5, lastDotIndex);
    const sectionNum = path.slice(lastDotIndex + 1);
    const fileName = `${pageName}_${eventId}_${sectionNum}.html`;
    let file = findSectionFile(fileName);

    if (!file) {
        const findingMsg = `Finding detail page for section ${eventId}.${sectionNum}...`;
        console.log(findingMsg);
        const res = await axios.get(`${CONFIG.API_URL}?api_key=${CONFIG.API_KEY}&url=${CONFIG.USCHESS_URL}${path}`);
        file = res.data;
        const savingMsg = `Saving detail page for section ${eventId}.${sectionNum}...`;
        console.log(savingMsg);
        fs.writeFileSync(`html_pages/sections/${fileName}`, file);
    }

    return file;
}

function findSectionFile(fileName) {
    const sectionFiles = fs.readdirSync('html_pages/sections', 'utf-8');
    for (let file of sectionFiles) {
        if (file === fileName) {
            const fileHtml = fs.readFileSync(`html_pages/sections/${file}`, 'utf-8');
            return fileHtml;
        }
    }
    return null;
}

module.exports = { getSectionHtml };