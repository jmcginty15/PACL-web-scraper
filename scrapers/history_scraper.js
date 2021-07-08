const fs = require('fs');
const { CONFIG } = require('../config');
const { ScraperApi } = require('../api');

async function getHistory(id, page = null) {
    const pageName = 'MbrDtlTnmtHst';
    const path = page ? `${pageName}.php?${id}.${page}` : `${pageName}.php?${id}`;
    const fileName = page ? `${pageName}_${id}_${page}.html` : `${pageName}_${id}.html`;
    let file = findHistoryFile(fileName);

    if (!file) {
        const findingMsg = page ? `Finding tournament history page ${page} for member ${id}...` : `Finding tournament history page for member ${id}...`;
        console.log(findingMsg);
        file = await ScraperApi.get(`${CONFIG.API_URL}?api_key=${CONFIG.API_KEY}&url=${CONFIG.USCHESS_URL}${path}`);
        const savingMsg = page ? `Saving tournament history page ${page} for member ${id}...` : `Saving tournament history page for member ${id}...`;
        console.log(savingMsg);
        fs.writeFileSync(`html_pages/histories/${fileName}`, file);
    }

    return file;
}

async function updateHistory(id, page = null) {
    const pageName = 'MbrDtlTnmtHst';
    const path = page ? `${pageName}.php?${id}.${page}` : `${pageName}.php?${id}`;
    const fileName = page ? `${pageName}_${id}_${page}.html` : `${pageName}_${id}.html`;

    const findingMsg = page ? `Finding tournament history page ${page} for member ${id}...` : `Finding tournament history page for member ${id}...`;
    console.log(findingMsg);
    file = await ScraperApi.get(`${CONFIG.API_URL}?api_key=${CONFIG.API_KEY}&url=${CONFIG.USCHESS_URL}${path}`);
    const savingMsg = page ? `Saving tournament history page ${page} for member ${id}...` : `Saving tournament history page for member ${id}...`;
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