const { CONFIG } = require('./config');
const app = require('./app');

app.listen(CONFIG.PORT, () => {
    console.log(`Server starting on port ${CONFIG.PORT}`);
});
