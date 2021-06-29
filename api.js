const axios = require('axios');

class ScraperApi {
    static async get(url) {
        while (true) {
            try {
                const res = await axios.get(url);
                return res.data;
            } catch (err) {
                console.log('Retrying...\nCtrl+C to cancel.');
            }
        }
    }
}

module.exports = { ScraperApi };