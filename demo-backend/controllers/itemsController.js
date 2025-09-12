const pool = require('../config/db');

const getItems = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 4;
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  pool.query('SELECT COUNT(*) FROM items', (countErr, countResult) => {
    if (countErr) {
      return res.status(500).json({ error: countErr.message });
    }
    const totalCount = parseInt(countResult.rows[0].count);

    pool.query('SELECT * FROM items LIMIT $1 OFFSET $2', [limit, offset], (itemsErr, itemsResult) => {
      if (itemsErr) {
        return res.status(500).json({ error: itemsErr.message });
      }

      res.json({
        items: itemsResult.rows,
        total: totalCount,
        page,
        pageSize
      });
    });
  });
};

module.exports = { getItems };