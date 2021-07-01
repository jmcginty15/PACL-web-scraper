const express = require('express');
const { Club } = require('../models/club');
const ExpressError = require('../expressError');
const router = new express.Router();

/** GET /:id
 * => {
 *      id,
 *      name,
 *      events: [{ id, name, locationCity, locationZip, dates, chiefTd, sections, players }, ... ]
 *      members: [{ id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence }, ...]
 *    }
 */

router.get('/:id', async function (req, res, next) {
    try {
        const { id } = req.params;
        const club = await Club.getById(id);
        return res.json({ club: club });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;