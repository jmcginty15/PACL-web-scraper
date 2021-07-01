const express = require('express');
const { Event } = require('../models/event');
const { insertOrUpdateEvent } = require('../functions');
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

/** POST /:id
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

 router.post('/:id', async function (req, res, next) {
    try {
        const { id } = req.params;
        let event = await Event.getById(id);
        if (event !== null) return res.json({ message: `Event ${id} ${event.name} already exists`});
        const error = await insertOrUpdateEvent(id);
        if (error === 'error') return res.json({ message: `Event ${id} does not exist`});
        event = await Event.getById(id);
        return res.json({ event: event });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;