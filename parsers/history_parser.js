function parseHistoryFile(html, page = 1) {
    let index = 50 * (page - 1) + 1;
    let refIndex = html.indexOf(`<!-- Detail: ${index}  -->`);
    const endIndex = html.indexOf('<!-- Resume Tabset Table -->');

    const events =  [];
    while (refIndex !== -1 && refIndex < endIndex) {
        const event = {};
        const eventIndex = html.indexOf('<small>', refIndex) + 7;
        event.id = html.slice(eventIndex, html.indexOf(' </small>', eventIndex));

        const sectionIndex = html.indexOf('<small>', eventIndex + 1) + 7;
        event.section = html.slice(sectionIndex, html.indexOf(':', sectionIndex));
        events.push(event);

        index += 1;
        refIndex = html.indexOf(`<!-- Detail: ${index}  -->`);
    }
    return events;
}

function countPages(html) {
    const startIndex = html.indexOf('Show Events:');
    const endIndex = html.indexOf('</table>', startIndex);

    let nextIndex = startIndex;
    let pageCount = 0;
    while (nextIndex < endIndex && nextIndex !== -1) {
        pageCount++;
        nextIndex++;
        nextIndex = html.indexOf('<nobr>', nextIndex);
    }
    pageCount--;

    return pageCount;
}

module.exports = { parseHistoryFile, countPages };