const fs = require('fs');
const { CONFIG } = require('../config');
const { ScraperApi } = require('../api');

async function getHistory(id) {
    const pageName = 'MbrDtlTnmtHst';
    const path = `${pageName}.php?${id}`;
    const fileName = `${pageName}_${id}.html`;
    let file = findHistoryFile(fileName);

    if (!file) {
        const findingMsg = `Finding tournament history page for member ${id}...`;
        console.log(findingMsg);
        file = await ScraperApi.get(`${CONFIG.API_URL}?api_key=${CONFIG.API_KEY}&url=${CONFIG.USCHESS_URL}${path}`);
        const savingMsg = `Saving tournament history page for member ${id}...`;
        console.log(savingMsg);
        fs.writeFileSync(`html_pages/histories/${fileName}`, file);
    }

    return file;
}

async function updateHistory(id) {
    const pageName = 'MbrDtlTnmtHst';
    const path = `${pageName}.php?${id}`;
    const fileName = `${pageName}_${id}.html`;

    const findingMsg = `Finding updated tournament history page for member ${id}...`;
    console.log(findingMsg);
    file = await ScraperApi.get(`${CONFIG.API_URL}?api_key=${CONFIG.API_KEY}&url=${CONFIG.USCHESS_URL}${path}`);
    const savingMsg = `Saving updated tournament history page for member ${id}...`;
    console.log(savingMsg);
    fs.writeFileSync(`html_pages/histories/${fileName}`, file);

    return file;
}

function findHistoryFile(fileName) {
    const historyFiles = fs.readdirSync('html_pages/histories', 'utf-8');
    for (let file of historyFiles) {
        if (file === fileName) {
            const fileHtml = fs.readFileSync(`html_pages/histories/${file}`, 'utf-8');
            return fileHtml;
        }
    }
    return null;
}

module.exports = { getHistory, updateHistory };