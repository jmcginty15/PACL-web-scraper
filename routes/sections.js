const express = require('express');
const { Section } = require('../models/section');
const ExpressError = require('../expressError');
const router = new express.Router();

/** GET /:event/:id
 * => {
 *      event: { id, name, locationCity, locationZip, dates, sponsoringClub, chiefTd, sections, players },
 *      id,
 *      name,
 *      dates,
 *      chiefTd: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *      rounds,
 *      players,
 *      kFactor,
 *      ratingSys,
 *      tournamentType,
 *      timeControl,
 *      entries: [{ player, pairingNum, score, ratingBefore, ratingAfter, ratingDualBefore, ratingDualAfter }, ...]
 *    }
 */

 router.get('/:event/:id', async function (req, res, next) {
    try {
        const { event, id } = req.params;
        const section = await Section.getById(event, id);
        if (section === null) throw new ExpressError(`Section ${event}.${id} not found`, 404);
        return res.json({ section: section });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;