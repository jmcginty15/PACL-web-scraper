const CONFIG = {
    API_KEY: 'a4cd8ca60ea95763f6b6d57fd1600cc7',
    API_URL: 'http://api.scraperapi.com/',
    USCHESS_URL: 'http://www.uschess.org/msa/'
};

CONFIG.SECRET_KEY = process.env.SECRET_KEY || 'greek-gift';
CONFIG.PORT = process.env.PORT || 3001;

module.exports = { CONFIG };