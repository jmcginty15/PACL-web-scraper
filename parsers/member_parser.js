function parseMemberFile(id, html) {
    const member = { id: id };

    const nameIndex = html.indexOf(id) + id.length + 2;
    member.name = html.slice(nameIndex, html.indexOf('</b>', nameIndex));
    if (member.name.slice(-16) === '&nbsp;(Deceased)' || member.name.slice(-16) === '&nbsp;(Inactive)') member.name = member.name.slice(0, -16);

    const regRatingRefIndex = html.indexOf('Regular Rating');
    const regRatingIndex = html.indexOf('<nobr>', regRatingRefIndex) + 7;
    member.ratingRegular = parseProvisionalRating(html.slice(regRatingIndex, html.indexOf('&nbsp;', regRatingIndex)));

    const quickRatingRefIndex = html.indexOf('Quick Rating');
    const quickRatingIndex = html.indexOf('<b>', quickRatingRefIndex) + 4;
    member.ratingQuick = parseProvisionalRating(html.slice(quickRatingIndex, html.indexOf('&nbsp;', quickRatingIndex)));

    const blitzRatingRefIndex = html.indexOf('Blitz Rating');
    const blitzRatingIndex = html.indexOf('<b>', blitzRatingRefIndex) + 4;
    member.ratingBlitz = parseProvisionalRating(html.slice(blitzRatingIndex, html.indexOf('&nbsp;', blitzRatingIndex)));

    const onlineRegRatingRefIndex = html.indexOf('Online-Regular Rating');
    const onlineRegRatingIndex = html.indexOf('<b>', onlineRegRatingRefIndex) + 4;
    member.ratingRegularOnline = parseProvisionalRating(html.slice(onlineRegRatingIndex, html.indexOf('&nbsp;', onlineRegRatingIndex)));

    const onlineQuickRatingRefIndex = html.indexOf('Online-Quick Rating');
    const onlineQuickRatingIndex = html.indexOf('<b>', onlineQuickRatingRefIndex) + 4;
    member.ratingQuickOnline = parseProvisionalRating(html.slice(onlineQuickRatingIndex, html.indexOf('&nbsp;', onlineQuickRatingIndex)));

    const onlineBlitzRatingRefIndex = html.indexOf('Online-Blitz Rating');
    const onlineBlitzRatingIndex = html.indexOf('<b>', onlineBlitzRatingRefIndex) + 4;
    member.ratingBlitzOnline = parseProvisionalRating(html.slice(onlineBlitzRatingIndex, html.indexOf('&nbsp;', onlineBlitzRatingIndex)));

    const correspondenceRatingRefIndex = html.indexOf('Correspondence Rating');
    const correspondenceRatingIndex = html.indexOf('<b>', correspondenceRatingRefIndex) + 4;
    member.ratingCorrespondence = parseProvisionalRating(html.slice(correspondenceRatingIndex, html.indexOf('</b>', correspondenceRatingIndex)));

    const overallRankRefIndex = html.indexOf('Overall Ranking');
    if (overallRankRefIndex !== -1) {
        const overallRankIndex = html.indexOf('<b>', overallRankRefIndex) + 3;
        member.overallRank = parseRanking(html.slice(overallRankIndex, html.indexOf('</b>', overallRankIndex)));
    } else member.overallRank = null;

    const stateRankRefIndex = html.indexOf('State Ranking (');
    if (stateRankRefIndex !== -1) {
        const stateRankIndex = html.indexOf('<b>', stateRankRefIndex) + 3;
        member.stateRank = parseRanking(html.slice(stateRankIndex, html.indexOf('</b>', stateRankIndex)));
    } else member.stateRank = null;

    const seniorRankRefIndex = html.indexOf('Senior Ranking');
    if (seniorRankRefIndex !== -1) {
        const seniorRankIndex = html.indexOf('<b>', seniorRankRefIndex) + 3;
        member.seniorRank = parseRanking(html.slice(seniorRankIndex, html.indexOf('</b>', seniorRankIndex)));
    } else member.seniorRank = null;

    const juniorRankRefIndex = html.indexOf('Junior Ranking');
    if (juniorRankRefIndex !== -1) {
        const juniorRankIndex = html.indexOf('<b>', juniorRankRefIndex) + 3;
        member.juniorRank = parseRanking(html.slice(juniorRankIndex, html.indexOf('</b>', juniorRankIndex)));
    } else member.juniorRank = null;

    const femaleRankRefIndex = html.indexOf('Female Ranking');
    if (femaleRankRefIndex !== -1) {
        const femaleRankIndex = html.indexOf('<b>', femaleRankRefIndex) + 3;
        member.femaleRank = parseRanking(html.slice(femaleRankIndex, html.indexOf('</b>', femaleRankIndex) - 1));
    } else member.femaleRank = null;

    let stateRefIndex = html.indexOf('<td valign=top>\nState\n</td>');
    let stateIndex = html.indexOf('<b>', stateRefIndex) + 4;
    member.state = html.slice(stateIndex, html.indexOf(' </b>', stateIndex));
    while (member.state.slice(-1) === ' ') member.state = member.state.slice(0, -1);

    if (member.state === '') {
        if (stateRankRefIndex !== -1) {
            stateIndex = html.indexOf('(', stateRankRefIndex) + 1;
            member.state = html.slice(stateIndex, html.indexOf(')', stateIndex));
        } else member.state = null;
    }

    const genderRefIndex = html.indexOf('Gender');
    const genderIndex = html.indexOf('<b>', genderRefIndex) + 4;
    member.gender = html.slice(genderIndex, genderIndex + 1);
    if (member.gender === 'U') member.gender = null;

    const FIDEIDRefIndex = html.indexOf('FIDE ID');
    if (FIDEIDRefIndex !== -1) {
        const FIDEIDIndex = html.indexOf('<b>', FIDEIDRefIndex) + 3;
        member.FIDEID = html.slice(FIDEIDIndex, html.indexOf('</b>', FIDEIDIndex));
    } else member.FIDEID = null;

    const FIDECountryRefIndex = html.indexOf('FIDE Country');
    if (FIDECountryRefIndex !== -1) {
        const FIDECountryIndex = html.indexOf('<b>', FIDECountryRefIndex) + 3;
        member.FIDECountry = html.slice(FIDECountryIndex, html.indexOf('</b>', FIDECountryIndex));
    } else member.FIDEID = null;

    const expDateRefIndex = html.indexOf('Expiration Dt.');
    const expDateIndex = html.indexOf('<b>', expDateRefIndex) + 3;
    member.expDate = html.slice(expDateIndex, html.indexOf('</b>', expDateIndex));

    const lastChangeDateRefIndex = html.indexOf('Last Change Dt.');
    const lastChangeDateIndex = html.indexOf('<b>', lastChangeDateRefIndex) + 3;
    member.lastChangeDate = html.slice(lastChangeDateIndex, html.indexOf('</b>', lastChangeDateIndex));

    return member;
}

function parseProvisionalRating(rating) {
    if (rating === '(Unrated)') return 'Unrated';
    const basedOnIndex = rating.indexOf(' (Based on');
    if (basedOnIndex !== -1) {
        const ratingNum = rating.slice(0, basedOnIndex);
        const gamesIndex = rating.indexOf(' game');
        const numGames = rating.slice(basedOnIndex + 11, gamesIndex);
        return `${ratingNum}P${numGames}`;
    }
    return rating;
}

function parseRanking(ranking) {
    const parts = ranking.split(' out of ');
    if (parts[0].indexOf('(Tied)') !== -1) parts[0] = `T${parts[0].slice(0, -6)}`;
    return `${parts[0]}/${parts[1]}`;
}

// function parseName(name) {
//     const outputNames = {
//         prefix: null,
//         firstName: null,
//         middleName: null,
//         lastName: null
//     };

//     const names = name.split(' ');
//     if (['MR.', 'MRS.', 'MS.', 'DR.'].includes(names[0])) {
//         const prefix = names.shift();
//         outputNames.prefix = `${prefix.slice(0, 1)}${prefix.slice(1).toLowerCase()}`;
//     }

//     const firstName = names.shift();
//     outputNames.firstName = `${firstName.slice(0, 1)}${firstName.slice(1).toLowerCase()}`;
//     if (['Mc', `O'`].includes(outputNames.firstName.slice(0, 2))) outputNames.firstName = `${outputNames.firstName.slice(0, 2)}${outputNames.firstName.slice(2, 3).toUpperCase()}${outputNames.firstName.slice(3)}`;

//     if (names.length > 1 )
//     const middleName = names.shift();
//     outputNames.middleName = `${middleName.slice(0, 1)}${middleName.slice(1).toLowerCase()}`;
//     if (['Mc', `O'`].includes(outputNames.middleName.slice(0, 2))) outputNames.middleName = `${outputNames.middleName.slice(0, 2)}${outputNames.middleName.slice(2, 3).toUpperCase()}${outputNames.middleName.slice(3)}`;

//     const lastName = names.shift();
//     outputNames.lastName = `${lastName.slice(0, 1)}${lastName.slice(1).toLowerCase()}`;
//     if (['Mc', `O'`].includes(outputNames.lastName.slice(0, 2))) outputNames.lastName = `${outputNames.lastName.slice(0, 2)}${outputNames.lastName.slice(2, 3).toUpperCase()}${outputNames.lastName.slice(3)}`;

//     return outputNames;
// }

module.exports = { parseMemberFile };