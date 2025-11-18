<<<<<<< HEAD
﻿require('dotenv').config();

module.exports = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });     
    }
    next();
};
=======
require('dotenv').config();
function auth(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};
module.exports = { auth };
>>>>>>> 5fcf782f4375cde65b27a7d0632140dc88bec13e
