const pool = require('../config/db');

const getItems = (req, res) => {
  pool.query('SELECT * FROM items', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results.rows);
  });
};

module.exports = { getItems };