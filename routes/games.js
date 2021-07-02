const express = require('express');
const { Game } = require('../models/game');
const ExpressError = require('../expressError');
const router = new express.Router();

/** GET /:event/:section/:round/:white/:black
 * => {
 *      event: { id, name, locationCity, locationZip, dates, sponsoringClub, chiefTd, sections, players },
 *      section: { id, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl },
 *      round,
 *      white: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *      black: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *      colorsReported,
 *      result
 *    }
 */

router.get('/:event/:section/:round/:white/:black', async function (req, res, next) {
    try {
        const { event, section, round, white, black } = req.params;
        const game = await Game.getById(event, section, round, white, black);
        if (game === null) throw new ExpressError(`Game ${event}.${section}.${round} ${white}-${black} not found`, 404);
        return res.json({ game: game });
    } catch (err) {
        return next(err);
    }
});

/** GET /:player/all
 * => { games: [{
 *          event: { id, name, locationCity, locationZip, dates, sponsoringClub, chiefTd, sections, players },
 *          section: { id, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl },
 *          round,
 *          white: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          black: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          colorsReported,
 *          result
 *      }, ...]
 *    }
 */

router.get('/:player/all', async function (req, res, next) {
    try {
        const { player } = req.params;
        const games = await Game.getByPlayer(player);
        return res.json({ games: games });
    } catch (err) {
        return next(err);
    }
});

/** GET /:player/white
 * => { games: [{
 *          event: { id, name, locationCity, locationZip, dates, sponsoringClub, chiefTd, sections, players },
 *          section: { id, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl },
 *          round,
 *          white: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          black: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          colorsReported,
 *          result
 *      }, ...]
 *    }
 */

router.get('/:player/white', async function (req, res, next) {
    try {
        const { player } = req.params;
        const games = await Game.getWhitesByPlayer(player);
        return res.json({ games: games });
    } catch (err) {
        return next(err);
    }
});

/** GET /:player/black
 * => { games: [{
 *          event: { id, name, locationCity, locationZip, dates, sponsoringClub, chiefTd, sections, players },
 *          section: { id, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl },
 *          round,
 *          white: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          black: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          colorsReported,
 *          result
 *      }, ...]
 *    }
 */

router.get('/:player/black', async function (req, res, next) {
    try {
        const { player } = req.params;
        const games = await Game.getBlacksByPlayer(player);
        return res.json({ games: games });
    } catch (err) {
        return next(err);
    }
});

/** GET /:player/unreported
 * => { games: [{
 *          event: { id, name, locationCity, locationZip, dates, sponsoringClub, chiefTd, sections, players },
 *          section: { id, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl },
 *          round,
 *          white: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          black: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          colorsReported,
 *          result
 *      }, ...]
 *    }
 */

 router.get('/:player/unreported', async function (req, res, next) {
    try {
        const { player } = req.params;
        const games = await Game.getUnreportedsByPlayer(player);
        return res.json({ games: games });
    } catch (err) {
        return next(err);
    }
});

/** GET /:player/:event/all
 * => { event: { id, name, locationCity, locationZip, dates, sponsoringClub, chiefTd, sections, players },
 *      games: [{
 *          section: { id, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl },
 *          round,
 *          white: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          black: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          colorsReported,
 *          result
 *      }, ...]
 *    }
 */

router.get('/:player/:event/all', async function (req, res, next) {
    try {
        const { player, event } = req.params;
        const games = await Game.getByPlayerEvent(player, event);
        return res.json(games);
    } catch (err) {
        return next(err);
    }
});

/** GET /:player/:event/white
 * => { event: { id, name, locationCity, locationZip, dates, sponsoringClub, chiefTd, sections, players },
 *      games: [{
 *          section: { id, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl },
 *          round,
 *          white: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          black: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          colorsReported,
 *          result
 *      }, ...]
 *    }
 */

router.get('/:player/:event/white', async function (req, res, next) {
    try {
        const { player, event } = req.params;
        const games = await Game.getWhitesByPlayerEvent(player, event);
        return res.json(games);
    } catch (err) {
        return next(err);
    }
});

/** GET /:player/:event/black
 * => { event: { id, name, locationCity, locationZip, dates, sponsoringClub, chiefTd, sections, players },
 *      games: [{
 *          section: { id, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl },
 *          round,
 *          white: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          black: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          colorsReported,
 *          result
 *      }, ...]
 *    }
 */

router.get('/:player/:event/black', async function (req, res, next) {
    try {
        const { player, event } = req.params;
        const games = await Game.getBlacksByPlayerEvent(player, event);
        return res.json(games);
    } catch (err) {
        return next(err);
    }
});

/** GET /:player/:event/unreported
 * => { event: { id, name, locationCity, locationZip, dates, sponsoringClub, chiefTd, sections, players },
 *      games: [{
 *          section: { id, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl },
 *          round,
 *          white: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          black: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          colorsReported,
 *          result
 *      }, ...]
 *    }
 */

 router.get('/:player/:event/unreported', async function (req, res, next) {
    try {
        const { player, event } = req.params;
        const games = await Game.getUnreportedsByPlayerEvent(player, event);
        return res.json(games);
    } catch (err) {
        return next(err);
    }
});

/** GET /:player/:event/:section/all
 * => { event: { id, name, locationCity, locationZip, dates, sponsoringClub, chiefTd, sections, players },
 *      section: { id, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl },
 *      games: [{
 *          round,
 *          white: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          black: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          colorsReported,
 *          result
 *      }, ...]
 *    }
 */

router.get('/:player/:event/:section/all', async function (req, res, next) {
    try {
        const { player, event, section } = req.params;
        const games = await Game.getByPlayerEventSection(player, event, section);
        return res.json(games);
    } catch (err) {
        return next(err);
    }
});

/** GET /:player/:event/:section/white
 * => { event: { id, name, locationCity, locationZip, dates, sponsoringClub, chiefTd, sections, players },
 *      section: { id, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl },
 *      games: [{
 *          round,
 *          white: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          black: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          colorsReported,
 *          result
 *      }, ...]
 *    }
 */

router.get('/:player/:event/:section/white', async function (req, res, next) {
    try {
        const { player, event, section } = req.params;
        const games = await Game.getWhitesByPlayerEventSection(player, event, section);
        return res.json(games);
    } catch (err) {
        return next(err);
    }
});

/** GET /:player/:event/:section/black
 * => { event: { id, name, locationCity, locationZip, dates, sponsoringClub, chiefTd, sections, players },
 *      section: { id, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl },
 *      games: [{
 *          round,
 *          white: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          black: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          colorsReported,
 *          result
 *      }, ...]
 *    }
 */

 router.get('/:player/:event/:section/black', async function (req, res, next) {
    try {
        const { player, event, section } = req.params;
        const games = await Game.getBlacksByPlayerEventSection(player, event, section);
        return res.json(games);
    } catch (err) {
        return next(err);
    }
});

/** GET /:player/:event/:section/unreported
 * => { event: { id, name, locationCity, locationZip, dates, sponsoringClub, chiefTd, sections, players },
 *      section: { id, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl },
 *      games: [{
 *          round,
 *          white: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          black: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *          colorsReported,
 *          result
 *      }, ...]
 *    }
 */

 router.get('/:player/:event/:section/unreported', async function (req, res, next) {
    try {
        const { player, event, section } = req.params;
        const games = await Game.getUnreportedsByPlayerEventSection(player, event, section);
        return res.json(games);
    } catch (err) {
        return next(err);
    }
});

/** GET /:player1/:player2
 * => [{
 *      event: { id, name, locationCity, locationZip, dates, sponsoringClub, chiefTd, sections, players },
 *      section: { id, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl },
 *      round,
 *      white: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *      black: { id, name, state, gender, expDate, lastChangeDate, FIDEID, FIDECountry, overallRank, seniorRank, juniorRank, femaleRank, stateRank, ratingBlitz, ratingQuick, ratingRegular, ratingBlitzOnline, ratingQuickOnline, ratingRegularOnline, ratingCorrespondence },
 *      colorsReported,
 *      result
 *    }, ...]
 */

router.get('/:player1/:player2', async function (req, res, next) {
    try {
        const { player1, player2 } = req.params;
        const games = await Game.getByPlayers(player1, player2);
        return res.json({ games: games });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;