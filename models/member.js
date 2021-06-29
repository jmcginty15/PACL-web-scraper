const TYPES = require('tedious').TYPES;
const { executeSql } = require('../db');
const { getMember, updateMember } = require('../scrapers/member_scraper');
const { getHistory, updateHistory } = require('../scrapers/history_scraper');
const { parseHistoryFile } = require('../parsers/history_parser');

class Member {
    static async insertIfNotExists(id) {
        const memberCheckQuery = 'SELECT * FROM members WHERE id = @id';
        const memberCheckParams = [{ name: 'id', type: TYPES.BigInt, value: parseInt(id) }];
        const memberRes = await executeSql(memberCheckQuery, memberCheckParams, 'SELECT');

        if (memberRes.length === 0) {
            const member = await getMember(id);
            if (member.FIDEID) member.FIDEID = parseInt(member.FIDEID);
            const query = 'INSERT INTO members (id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence) VALUES (@id, @name, @state, @gender, @expDate, @lastChangeDate, @FIDEID, @FIDECountry, @overallRank, @seniorRank, @juniorRank, @femaleRank, @stateRank, @ratingBlitz, @ratingQuick, @ratingRegular, @ratingBlitzOnline, @ratingQuickOnline, @ratingRegularOnline, @ratingCorrespondence)';
            const params = [
                { name: 'id', type: TYPES.BigInt, value: parseInt(id) },
                { name: 'name', type: TYPES.Text, value: member.name },
                { name: 'state', type: TYPES.Text, value: member.state },
                { name: 'gender', type: TYPES.Text, value: member.gender },
                { name: 'expDate', type: TYPES.Text, value: member.expDate },
                { name: 'lastChangeDate', type: TYPES.Text, value: member.lastChangeDate },
                { name: 'FIDEID', type: TYPES.BigInt, value: member.FIDEID },
                { name: 'FIDECountry', type: TYPES.Text, value: member.FIDECountry },
                { name: 'overallRank', type: TYPES.Text, value: member.overallRank },
                { name: 'seniorRank', type: TYPES.Text, value: member.seniorRank },
                { name: 'juniorRank', type: TYPES.Text, value: member.juniorRank },
                { name: 'femaleRank', type: TYPES.Text, value: member.femaleRank },
                { name: 'stateRank', type: TYPES.Text, value: member.stateRank },
                { name: 'ratingBlitz', type: TYPES.Text, value: member.ratingBlitz },
                { name: 'ratingQuick', type: TYPES.Text, value: member.ratingQuick },
                { name: 'ratingRegular', type: TYPES.Text, value: member.ratingRegular },
                { name: 'ratingBlitzOnline', type: TYPES.Text, value: member.ratingBlitzOnline },
                { name: 'ratingQuickOnline', type: TYPES.Text, value: member.ratingQuickOnline },
                { name: 'ratingRegularOnline', type: TYPES.Text, value: member.ratingRegularOnline },
                { name: 'ratingCorrespondence', type: TYPES.Text, value: member.ratingCorrespondence }
            ];

            let msg = `Member ${id} ${member.name} inserted`;
            try {
                await executeSql(query, params, 'INSERT');
            } catch (err) {
                msg = `Member ${id} ${member.name} already exists`;
            }
            console.log(msg);
        } else {
            const member = memberRes[0];
            console.log(`Member ${id} ${member.name} already exists`);
        }
    }

    static async insertOrUpdate(id) {
        const memberCheckQuery = 'SELECT * FROM members WHERE id = @id';
        const memberCheckParams = [{ name: 'id', type: TYPES.BigInt, value: parseInt(id) }];
        const memberRes = await executeSql(memberCheckQuery, memberCheckParams, 'SELECT');
        const member = await updateMember(id);

        let query = null;
        let msgQueryType = null;
        let errMsgQueryType = null;
        if (memberRes.length === 0) {
            query = 'INSERT INTO members (id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence) VALUES (@id, @name, @state, @gender, @expDate, @lastChangeDate, @FIDEID, @FIDECountry, @overallRank, @seniorRank, @juniorRank, @femaleRank, @stateRank, @ratingBlitz, @ratingQuick, @ratingRegular, @ratingBlitzOnline, @ratingQuickOnline, @ratingRegularOnline, @ratingCorrespondence)';
            msgQueryType = 'inserted';
            errMsgQueryType = 'inserting';
        } else {
            query = 'UPDATE members SET name = @name, state = @state, gender = @gender, expDate = @expDate, lastChangeDate = @lastChangeDate, FIDEID = @FIDEID, FIDECountry = @FIDECountry, overallRank = @overallRank, seniorRank = @seniorRank, juniorRank = @juniorRank, femaleRank = @femaleRank, stateRank = @stateRank, ratingBlitz = @ratingBlitz, ratingQuick = @ratingQuick, ratingRegular = @ratingRegular, ratingBlitzOnline = @ratingBlitzOnline, ratingQuickOnline = @ratingQuickOnline, ratingRegularOnline = @ratingRegularOnline, ratingCorrespondence = @ratingCorrespondence WHERE id = @id';
            msgQueryType = 'updated';
            errMsgQueryType = 'updating';
        }
        const queryType = query.slice(0, 6);
        const params = [
            { name: 'name', type: TYPES.Text, value: member.name },
            { name: 'state', type: TYPES.Text, value: member.state },
            { name: 'gender', type: TYPES.Text, value: member.gender },
            { name: 'expDate', type: TYPES.Text, value: member.expDate },
            { name: 'lastChangeDate', type: TYPES.Text, value: member.lastChangeDate },
            { name: 'FIDEID', type: TYPES.BigInt, value: member.FIDEID },
            { name: 'FIDECountry', type: TYPES.Text, value: member.FIDECountry },
            { name: 'overallRank', type: TYPES.Text, value: member.overallRank },
            { name: 'seniorRank', type: TYPES.Text, value: member.seniorRank },
            { name: 'juniorRank', type: TYPES.Text, value: member.juniorRank },
            { name: 'femaleRank', type: TYPES.Text, value: member.femaleRank },
            { name: 'stateRank', type: TYPES.Text, value: member.stateRank },
            { name: 'ratingBlitz', type: TYPES.Text, value: member.ratingBlitz },
            { name: 'ratingQuick', type: TYPES.Text, value: member.ratingQuick },
            { name: 'ratingRegular', type: TYPES.Text, value: member.ratingRegular },
            { name: 'ratingBlitzOnline', type: TYPES.Text, value: member.ratingBlitzOnline },
            { name: 'ratingQuickOnline', type: TYPES.Text, value: member.ratingQuickOnline },
            { name: 'ratingRegularOnline', type: TYPES.Text, value: member.ratingRegularOnline },
            { name: 'ratingCorrespondence', type: TYPES.Text, value: member.ratingCorrespondence },
            { name: 'id', type: TYPES.BigInt, value: parseInt(id) }
        ];

        let msg = `Member ${id} ${member.name} ${msgQueryType}`;
        try {
            await executeSql(query, params, queryType);
        } catch (err) {
            msg = `Error ${errMsgQueryType} member ${id} ${member.name}`;
        }
        console.log(msg);
    }

    static async getHistory(id) {
        const html = await getHistory(id);
        return parseHistoryFile(html);
    }

    static async updateHistory(id) {
        const html = await updateHistory(id);
        return parseHistoryFile(html);
    }

    static async findById(id) {
        const memberQuery = 'SELECT * FROM members WHERE id = @id';
        const memberParams = [{ name: 'id', type: TYPES.BigInt, value: parseInt(id) }];
        const memberRes = await executeSql(memberQuery, memberParams, 'SELECT');
        return memberRes.length === 0 ? null : memberRes[0];
    }
}

module.exports = { Member };