const express = require('express');
const { Event } = require('../models/event');
const ExpressError = require('../expressError');
const router = new express.Router();

/** GET /:id
 * => {
 *      id,
 *      name,
 *      locationCity,
 *      locationZip,
 *      dates,
 *      sponsoringClub: { id, name },
 *      chiefTd: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingRegularOnline, ratingCorrespondence },
 *      sections: [{ id, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl }, ...],
 *      players,
 *      entries: [{ section, player, pairingNum, score, ratingBefore, ratingAfter, ratingDualBefore, ratingDualAfter }]
 *    }
 */

 router.get('/:id', async function (req, res, next) {
    try {
        const { id } = req.params;
        const event = await Event.getById(id);
        if (event === null) throw new ExpressError(`Event ${id} not found`, 404);
        return res.json({ event: event });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;