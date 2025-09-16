const express = require('express');
const { getItems, createItem, updateItem, deleteItem } = require('../controllers/itemsController');

const router = express.Router();

router.get('/', getItems);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;
