const express = require('express');
const cors = require('cors');
const app = express();
const ExpressError = require('./expressError');
const clubRoutes = require('./routes/clubs');
const entryRoutes = require('./routes/entries');
const eventRoutes = require('./routes/events');
const gameRoutes = require('./routes/games');
const memberRoutes = require('./routes/members');
const sectionRoutes = require('./routes/sections');

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/clubs', clubRoutes);
app.use('/entries', entryRoutes);
app.use('/events', eventRoutes);
app.use('/games', gameRoutes);
app.use('/members', memberRoutes);
app.use('/sections', sectionRoutes);

app.use(function (req, res, next) {
    const err = new ExpressError('Not Found', 404);
    return next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);

    return res.json({
        error: err,
        message: err.message
    });
});

module.exports = app;
