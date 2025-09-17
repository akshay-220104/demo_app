const pool = require('../config/db');

const getItems = (req, res) => {
  pool.query('SELECT * FROM items', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results.rows);
  });
};

const deleteItem = (req, res) => {
  const itemId = parseInt(req.params.id, 10);
  pool.query('DELETE FROM items WHERE id = $1', [itemId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(204).send();
  });
};

const createItem = (req, res) => {
  const { name, description, createdat, sizekb, tags, visibility } = req.body;
  pool.query(
    'INSERT INTO items (name, description, createdat, sizekb, tags, visibility) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [name, description, createdat, sizekb, tags, visibility],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(results.rows[0]);
    }
  );
};

const updateItem = (req, res) => {
  const itemId = parseInt(req.params.id, 10);
  const { name, description, createdat, sizekb, tags, visibility } = req.body;  

  pool.query(
    'UPDATE items SET name = $1, description = $2, createdat = $3, sizekb = $4, tags = $5, visibility = $6 WHERE id = $7 RETURNING *',
    [name, description, createdat, sizekb, tags, visibility, itemId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results.rows[0]);
    }
  );
};

module.exports = { getItems, deleteItem, createItem, updateItem };