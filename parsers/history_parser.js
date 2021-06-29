function parseHistoryFile(html) {
    let refIndex = html.indexOf('<!-- Detail: 1  -->');
    let index = 1;
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

module.exports = { parseHistoryFile };