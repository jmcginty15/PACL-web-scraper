const fs = require('fs');
const { CONFIG } = require('../config');
const axios = require('axios');
const { parseMemberFile } = require('../parsers/member_parser.js');

async function getMember(id) {
    const pageName = 'MbrDtlMain';
    const path = `${pageName}.php?${id}`;
    const fileName = `${pageName}_${id}.html`;
    let file = findMemberFile(fileName);

    if (!file) {
        const findingMsg = `Finding detail page for member ${id}...`;
        console.log(findingMsg);
        const res = await axios.get(`${CONFIG.API_URL}?api_key=${CONFIG.API_KEY}&url=${CONFIG.USCHESS_URL}${path}`);
        file = res.data;
        const savingMsg = `Saving detail page for member ${id}...`;
        console.log(savingMsg);
        fs.writeFileSync(`html_pages/members/${fileName}`, file);
    }

    const member = parseMemberFile(id, file);
    return member;
}

async function updateMember(id) {
    const pageName = 'MbrDtlMain';
    const path = `${pageName}.php?${id}`;
    const fileName = `${pageName}_${id}.html`;

    const findingMsg = `Finding updated detail page for member ${id}...`;
    console.log(findingMsg);
    const res = await axios.get(`${CONFIG.API_URL}?api_key=${CONFIG.API_KEY}&url=${CONFIG.USCHESS_URL}${path}`);
    file = res.data;
    const savingMsg = `Saving updated detail page for member ${id}...`;
    console.log(savingMsg);
    fs.writeFileSync(`html_pages/members/${fileName}`, file);

    const member = parseMemberFile(id, file);
    return member;
}

function findMemberFile(fileName) {
    const memberFiles = fs.readdirSync('html_pages/members', 'utf-8');
    for (let file of memberFiles) {
        if (file === fileName) {
            const fileHtml = fs.readFileSync(`html_pages/members/${file}`, 'utf-8');
            return fileHtml;
        }
    }
    return null;
}

module.exports = { getMember, updateMember };