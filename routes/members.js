const express = require('express');
const { Member } = require('../models/member');
const { insertOrUpdateMember } = require('../functions');
const ExpressError = require('../expressError');
const router = new express.Router();

/** GET /:id
 * => {
 *      id,
 *      name,
 *      state,
 *      gender,
 *      expDate,
 *      lastChangeDate,
 *      FIDEID,
 *      FIDECountry,
 *      overallRank,
 *      seniorRank,
 *      juniorRank,
 *      femaleRank,
 *      stateRank,
 *      ratingBlitz,
 *      ratingQuick,
 *      ratingRegular,
 *      ratingBlitzOnline,
 *      ratingQuickOnline,
 *      ratingRegularOnline,
 *      ratingCorrespondence,
 *      entries: [{ event, section, pairingNum, score, ratingBefore, ratingAfter, ratingDualBefore, ratingDualAfter }, ...],
 *      directedEvents: [{ id, name, locationCity, locationZip, dates, sponsoringClub, sections, players }, ...],
 *      directedSections: [{ event, id, name, dates, rounds, players, kFactor, ratingSys, tournamentType, timeControl }, ...]
 *    }
 */

 router.get('/:id', async function (req, res, next) {
    try {
        const { id } = req.params;
        const member = await Member.getById(id);
        if (member === null) throw new ExpressError(`Member ${id} not found`, 404);
        return res.json({ member: member });
    } catch (err) {
        return next(err);
    }
});

/** POST /:id
 * => {
 *      id,
 *      name,
 *      state,
 *      gender,
 *      expDate,
 *      lastChangeDate,
 *      FIDEID,
 *      FIDECountry,
 *      overallRank,
 *      seniorRank,
 *      juniorRank,
 *      femaleRank,
 *      stateRank,
 *      ratingBlitz,
 *      ratingQuick,
 *      ratingRegular,
 *      ratingBlitzOnline,
 *      ratingQuickOnline,
 *      ratingRegularOnline,
 *      ratingCorrespondence,
 *      entries: [{ event, section, pairingNum, score, ratingBefore, ratingAfter, ratingDualBefore, ratingDualAfter }, ...],
 *      directedEvents: [{ id, name, locationCity, locationZip, dates, sponsoringClub, sections, players }, ...],
 *      directedSections: [{ event, id, name, dates, rounds, players, kFactor, ratingSys, tournamentType, timeControl }, ...]
 *    }
 */

 router.post('/:id', async function (req, res, next) {
    try {
        const { id } = req.params;
        let member = await Member.getById(id);
        if (member !== null) return res.json({ message: `Member ${id} ${member.name} already exists` });
        await insertOrUpdateMember(id);
        member = await Member.getById(id);
        return res.json({ member: member });
    } catch (err) {
        return next(err);
    }
});

/** PUT /:id
 * => {
 *      id,
 *      name,
 *      state,
 *      gender,
 *      expDate,
 *      lastChangeDate,
 *      FIDEID,
 *      FIDECountry,
 *      overallRank,
 *      seniorRank,
 *      juniorRank,
 *      femaleRank,
 *      stateRank,
 *      ratingBlitz,
 *      ratingQuick,
 *      ratingRegular,
 *      ratingBlitzOnline,
 *      ratingQuickOnline,
 *      ratingRegularOnline,
 *      ratingCorrespondence,
 *      entries: [{ event, section, pairingNum, score, ratingBefore, ratingAfter, ratingDualBefore, ratingDualAfter }, ...],
 *      directedEvents: [{ id, name, locationCity, locationZip, dates, sponsoringClub, sections, players }, ...],
 *      directedSections: [{ event, id, name, dates, rounds, players, kFactor, ratingSys, tournamentType, timeControl }, ...]
 *    }
 */

router.put('/:id', async function (req, res, next) {
    try {
        const { id } = req.params;
        await insertOrUpdateMember(id);
        const member = await Member.getById(id);
        if (member === null) throw new ExpressError(`Member ${id} not found`, 404);
        return res.json({ member: member });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;