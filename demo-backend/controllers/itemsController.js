const pool = require('../config/db');

const getItems = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 4;
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  const sortBy = req.query.sortBy || 'id';
  const sortOrder = req.query.sortOrder || 'ASC';

  pool.query('SELECT COUNT(*) FROM items', (countErr, countResult) => {
    if (countErr) {
      return res.status(500).json({ error: countErr.message });
    }
    const totalCount = parseInt(countResult.rows[0].count);

    pool.query(
      `SELECT * FROM items ORDER BY ${sortBy} ${sortOrder} LIMIT $1 OFFSET $2`,
      [limit, offset],
      (itemsErr, itemsResult) => {
        if (itemsErr) {
          return res.status(500).json({ error: itemsErr.message });
        }
        // console.log(itemsResult.rows);
      res.json({
        items: itemsResult.rows,
        total: totalCount,
        page,
        pageSize
      });
    });
  });
};

const createItem = (req, res) => {
  const { name, description, createdat } = req.body;
  console.log(createdat);
  if (!name || !description || !createdat) {
    return res.status(400).json({ error: 'Name, description, and createdat are required' });
  }
  pool.query(
    'INSERT INTO items (name, description, createdat) VALUES ($1, $2, $3) RETURNING *',
    [name, description, createdat],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(result.rows[0]);
    }
  );
};

const updateItem = (req, res) => {
  const { id } = req.params;
  const { name, description, createdat } = req.body;

  if (!name || !description || !createdat) {
    return res.status(400).json({ error: 'Name, description, and createdat are required' });
  }

  pool.query(
    'UPDATE items SET name = $1, description = $2, createdat = $3 WHERE id = $4 RETURNING *',
    [name, description, createdat, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json(result.rows[0]);
    }
  );
}

const deleteItem = (req, res) => {
  const { id } = req.params;

  pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  });
};

module.exports = { getItems, createItem, updateItem, deleteItem };