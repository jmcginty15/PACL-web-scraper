const express = require('express');
const { Entry } = require('../models/entry');
const ExpressError = require('../expressError');
const router = new express.Router();

/** GET /:event/:section/:player
 * => {
 *      event: { id, name, locationCity, locationZip, dates, sponsoringClub, chiefTd, sections, players },
 *      section: { id, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl },
 *      player: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *      pairingNum,
 *      score,
 *      ratingBefore,
 *      ratingAfter,
 *      ratingDualBefore,
 *      ratingDualAfter
 *    }
 */

 router.get('/:event/:section/:player', async function (req, res, next) {
    try {
        const { event, section, player } = req.params;
        const entry = await Entry.getById(event, section, player);
        if (entry === null) throw new ExpressError(`Entry ${event}.${section}.${player} not found`, 404);
        return res.json({ entry: entry });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;